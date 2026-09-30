-- ============================================================
-- AayurFace — Migration: Phase 13-R.1 RPC Security Hardening & Vector Search
-- Migration ID: 20260930000001_phase13_rpc_hardening.sql
-- Enforces:
-- 1. search_path = public, pg_temp on SECURITY DEFINER
-- 2. Input embedding dimension validation (must be 64-dim)
-- 3. Parameter clamping: match_threshold (0.0 - 1.0), match_count (1 - 25)
-- 4. Revocation of execution from anon (authenticated and service_role only)
-- 5. Safe schema column enrichment for passage/text status
-- ============================================================

-- 1. Add metadata columns for corpus truth if not already present
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'knowledge_sources') THEN
    ALTER TABLE public.knowledge_sources
      ADD COLUMN IF NOT EXISTS source_status TEXT DEFAULT 'SOURCE_PRESENT',
      ADD COLUMN IF NOT EXISTS text_status TEXT DEFAULT 'OCR_REQUIRED';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'knowledge_chunks') THEN
    ALTER TABLE public.knowledge_chunks
      ADD COLUMN IF NOT EXISTS passage_status TEXT DEFAULT 'PASSAGE_VERIFIED',
      ADD COLUMN IF NOT EXISTS text_status TEXT DEFAULT 'TEXT_VERIFIED',
      ADD COLUMN IF NOT EXISTS content_english_type TEXT DEFAULT 'CURATED_PARAPHRASE';
  END IF;
END $$;

-- 2. Safely recreate match_knowledge_chunks with hardened SECURITY DEFINER & validation
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vector') THEN
    -- Drop previous version if exists to allow updating the return signature
    DROP FUNCTION IF EXISTS public.match_knowledge_chunks(vector(64), float, int, text);

    EXECUTE $func$
      CREATE OR REPLACE FUNCTION public.match_knowledge_chunks(
        query_embedding vector(64),
        match_threshold float DEFAULT 0.40,
        match_count int DEFAULT 5,
        filter_tier text DEFAULT NULL
      )
      RETURNS TABLE (
        chunk_id text,
        source_id text,
        chapter text,
        section text,
        verse_numbers text,
        page_number int,
        content_sanskrit text,
        content_english text,
        language text,
        authority_tier text,
        verification_status text,
        passage_status text,
        text_status text,
        similarity float
      )
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public, pg_temp
      AS $body$
      DECLARE
        clamped_threshold float;
        clamped_count int;
      BEGIN
        -- Validate query_embedding
        IF query_embedding IS NULL THEN
          RAISE EXCEPTION 'query_embedding cannot be null';
        END IF;

        IF vector_dims(query_embedding) != 64 THEN
          RAISE EXCEPTION 'Invalid embedding dimension: expected 64, got %', vector_dims(query_embedding);
        END IF;

        -- Clamp match_threshold strictly between 0.0 and 1.0
        clamped_threshold := GREATEST(0.0, LEAST(1.0, COALESCE(match_threshold, 0.40)));

        -- Clamp match_count strictly between 1 and 25
        clamped_count := GREATEST(1, LEAST(25, COALESCE(match_count, 5)));

        RETURN QUERY
        SELECT
          kc.chunk_id,
          kc.source_id,
          kc.chapter,
          kc.section,
          kc.verse_numbers,
          kc.page_number,
          kc.content_sanskrit,
          kc.content_english,
          kc.language,
          kc.authority_tier,
          kc.verification_status,
          COALESCE(kc.passage_status, 'PASSAGE_VERIFIED')::text AS passage_status,
          COALESCE(kc.text_status, 'TEXT_VERIFIED')::text AS text_status,
          (1 - (kc.embedding <=> query_embedding))::float AS similarity
        FROM public.knowledge_chunks kc
        JOIN public.knowledge_sources ks ON ks.source_id = kc.source_id
        WHERE ks.ingestion_status = 'ACTIVE'
          AND kc.verification_status = 'VERIFIED'
          AND (filter_tier IS NULL OR kc.authority_tier = filter_tier)
          AND (1 - (kc.embedding <=> query_embedding)) >= clamped_threshold
        ORDER BY similarity DESC
        LIMIT clamped_count;
      END;
      $body$;
    $func$;

    -- 3. Strict Privileges: Revoke anon execution, grant only to authenticated and service_role
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.match_knowledge_chunks(vector(64), float, int, text) FROM PUBLIC, anon;';
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.match_knowledge_chunks(vector(64), float, int, text) TO authenticated, service_role;';
  ELSE
    RAISE NOTICE 'pgvector is not installed; match_knowledge_chunks function creation skipped.';
  END IF;
END $$;
