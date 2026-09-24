-- ============================================================
-- AayurFace — Migration: Phase 13 Knowledge Base, RAG & XAI Audit Traces
-- Migration ID: 20260924000001_phase13_rag_knowledge.sql
-- Enforces Source Authority, Cryptographic Ingestion Idempotency & User-Scoped Traces
-- ============================================================

-- Safely attempt to create vector extension if supported
DO $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS vector;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Vector extension could not be initialized or is unavailable in this environment.';
END $$;

-- ------------------------------------------------------------
-- 1. KNOWLEDGE SOURCES TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.knowledge_sources (
  source_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  language TEXT NOT NULL,
  authority_tier TEXT NOT NULL CHECK (
    authority_tier IN (
      'TIER_1_CLASSICAL_PRIMARY',
      'TIER_2_SCHOLARLY_TRANSLATION',
      'TIER_3_MODERN_RESEARCH',
      'TIER_4_PROJECT_RESEARCH',
      'TIER_5_DATASET',
      'TIER_6_UNVERIFIED'
    )
  ),
  verification_status TEXT NOT NULL CHECK (
    verification_status IN ('VERIFIED', 'PARTIALLY_VERIFIED', 'UNVERIFIED', 'QUARANTINED', 'REJECTED')
  ),
  ingestion_status TEXT NOT NULL CHECK (
    ingestion_status IN ('DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'QUARANTINED', 'REJECTED', 'DEPRECATED')
  ),
  file_hash TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  pages INT NOT NULL DEFAULT 0,
  format TEXT NOT NULL CHECK (format IN ('PDF_SCANNED', 'PDF_TEXT', 'CSV_TABULAR', 'TEXT_MARKDOWN')),
  source_type TEXT NOT NULL CHECK (
    source_type IN ('CLASSICAL_SAMHITA', 'NIGHANTU', 'SCHOLARLY_COMMENTARY', 'MODERN_STUDY', 'INTERNAL_RESEARCH')
  ),
  license_status TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 2. KNOWLEDGE DOCUMENTS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.knowledge_documents (
  document_id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES public.knowledge_sources(source_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  document_version TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  parser_version TEXT NOT NULL,
  structure_summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 3. KNOWLEDGE CHUNKS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.knowledge_chunks (
  chunk_id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL REFERENCES public.knowledge_documents(document_id) ON DELETE CASCADE,
  source_id TEXT NOT NULL REFERENCES public.knowledge_sources(source_id) ON DELETE CASCADE,
  chapter TEXT NOT NULL,
  section TEXT NOT NULL,
  verse_numbers TEXT,
  page_number INT NOT NULL DEFAULT 0,
  content_sanskrit TEXT,
  content_english TEXT NOT NULL,
  content_original TEXT,
  language TEXT NOT NULL,
  authority_tier TEXT NOT NULL CHECK (
    authority_tier IN (
      'TIER_1_CLASSICAL_PRIMARY',
      'TIER_2_SCHOLARLY_TRANSLATION',
      'TIER_3_MODERN_RESEARCH',
      'TIER_4_PROJECT_RESEARCH',
      'TIER_5_DATASET',
      'TIER_6_UNVERIFIED'
    )
  ),
  verification_status TEXT NOT NULL CHECK (
    verification_status IN ('VERIFIED', 'PARTIALLY_VERIFIED', 'UNVERIFIED', 'QUARANTINED', 'REJECTED')
  ),
  content_hash TEXT NOT NULL,
  chunking_version TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT ARRAY[]::text[],
  contraindications TEXT[] NOT NULL DEFAULT ARRAY[]::text[],
  safety_level TEXT NOT NULL CHECK (
    safety_level IN ('TOPICAL_SAFE', 'INTERNAL_SAFE', 'CAUTION_REQUIRED', 'CONTRAINDICATED')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 4. RAG AUDIT TRACES TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rag_audit_traces (
  request_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  query_intent TEXT NOT NULL,
  retrieved_chunk_ids TEXT[] NOT NULL DEFAULT ARRAY[]::text[],
  selected_evidence_ids TEXT[] NOT NULL DEFAULT ARRAY[]::text[],
  rejected_evidence_ids TEXT[] NOT NULL DEFAULT ARRAY[]::text[],
  rejection_reasons TEXT[] NOT NULL DEFAULT ARRAY[]::text[],
  claim_count INT NOT NULL DEFAULT 0,
  unsupported_claim_count INT NOT NULL DEFAULT 0,
  gating_passed BOOLEAN NOT NULL DEFAULT FALSE,
  fallback_triggered BOOLEAN NOT NULL DEFAULT FALSE,
  safety_violations TEXT[] NOT NULL DEFAULT ARRAY[]::text[],
  runtime_versions JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_latency_ms INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- 5. INDEXES
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_k_sources_tier_status ON public.knowledge_sources(authority_tier, ingestion_status);
CREATE INDEX IF NOT EXISTS idx_k_docs_source_id ON public.knowledge_documents(source_id);
CREATE INDEX IF NOT EXISTS idx_k_chunks_doc_id ON public.knowledge_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_k_chunks_source_id ON public.knowledge_chunks(source_id);
CREATE INDEX IF NOT EXISTS idx_k_chunks_tier ON public.knowledge_chunks(authority_tier);
CREATE INDEX IF NOT EXISTS idx_k_chunks_tags ON public.knowledge_chunks USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_rag_audit_user_created ON public.rag_audit_traces(user_id, created_at DESC);

-- ------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------
ALTER TABLE public.knowledge_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rag_audit_traces ENABLE ROW LEVEL SECURITY;

-- Knowledge Sources: Public Read for Active/Published Sources; Read-only to clients
DROP POLICY IF EXISTS "Public can view active knowledge sources" ON public.knowledge_sources;
CREATE POLICY "Public can view active knowledge sources" ON public.knowledge_sources
  FOR SELECT USING (ingestion_status = 'ACTIVE');

-- Knowledge Documents: Public Read for Documents linked to Active Sources
DROP POLICY IF EXISTS "Public can view documents from active sources" ON public.knowledge_documents;
CREATE POLICY "Public can view documents from active sources" ON public.knowledge_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.knowledge_sources ks
      WHERE ks.source_id = public.knowledge_documents.source_id
        AND ks.ingestion_status = 'ACTIVE'
    )
  );

-- Knowledge Chunks: Public Read for Verified Chunks in Active Sources
DROP POLICY IF EXISTS "Public can view verified active chunks" ON public.knowledge_chunks;
CREATE POLICY "Public can view verified active chunks" ON public.knowledge_chunks
  FOR SELECT USING (
    verification_status = 'VERIFIED' AND
    EXISTS (
      SELECT 1 FROM public.knowledge_sources ks
      WHERE ks.source_id = public.knowledge_chunks.source_id
        AND ks.ingestion_status = 'ACTIVE'
    )
  );

-- RAG Audit Traces: Users can only view and insert their own traces
DROP POLICY IF EXISTS "Users can view own RAG traces" ON public.rag_audit_traces;
CREATE POLICY "Users can view own RAG traces" ON public.rag_audit_traces
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own RAG traces" ON public.rag_audit_traces;
CREATE POLICY "Users can insert own RAG traces" ON public.rag_audit_traces
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);
