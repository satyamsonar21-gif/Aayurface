-- ============================================================
-- AayurFace — Migration: Phase 13-R Pgvector Hardening & Similarity RPC
-- Migration ID: 20260924000002_phase13_pgvector_hardening.sql
-- Adds 64-Dimensional Semantic Projection Column & Stored Procedure
-- ============================================================

-- 1. Initialize pgvector extension safely
DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS vector;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Vector extension could not be initialized or is unavailable in this environment.';
END $$;

-- 2. Add embedding column to knowledge_chunks if pgvector is available
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vector') THEN
    ALTER TABLE public.knowledge_chunks
      ADD COLUMN IF NOT EXISTS embedding vector(64);

    -- Create IVFFlat cosine index for scalable nearest-neighbor queries
    CREATE INDEX IF NOT EXISTS idx_k_chunks_embedding 
      ON public.knowledge_chunks 
      USING ivfflat (embedding vector_cosine_ops) 
      WITH (lists = 10);
  ELSE
    RAISE NOTICE 'Vector type does not exist; skipping embedding vector column addition.';
  END IF;
END $$;

-- 3. Stored Procedure for Grounded Vector Search (match_knowledge_chunks)
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
  similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
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
    1 - (kc.embedding <=> query_embedding) AS similarity
  FROM public.knowledge_chunks kc
  JOIN public.knowledge_sources ks ON ks.source_id = kc.source_id
  WHERE ks.ingestion_status = 'ACTIVE'
    AND kc.verification_status = 'VERIFIED'
    AND (filter_tier IS NULL OR kc.authority_tier = filter_tier)
    AND (1 - (kc.embedding <=> query_embedding)) >= match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- 4. Permissions
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'match_knowledge_chunks') THEN
    GRANT EXECUTE ON FUNCTION public.match_knowledge_chunks(vector(64), float, int, text) TO authenticated, anon;
  END IF;
END $$;
