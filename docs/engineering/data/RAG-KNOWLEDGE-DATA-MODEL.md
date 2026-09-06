# AayurFace — Database Architecture Specification
## Classical Ayurvedic Literature, RAG Knowledge Schema & Content Governance

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** AI Data Architect, Ayurvedic Knowledge Systems Analyst  

---

### 1. Classical Knowledge Hierarchy & Multilingual Representation

The classical Ayurvedic knowledge architecture is decomposed into three structural relational levels, supporting Sanskrit shlokas, English translations, and Hindi equivalents:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. `knowledge_sources`                                                      │
│ Classical Compendiums (*Charaka Samhita*, *Sushruta*, *Ashtanga Hridaya*)   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────┴──────────────────────────────────────┐
│ 2. `knowledge_documents`                                                    │
│ Major structural divisions (Sthana, Adhyaya / Chapter)                      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────┴──────────────────────────────────────┐
│ 3. `knowledge_chunks`                                                       │
│ 400-600 token verse chunks • Multilingual Content • 1536-dim Embedding      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Concrete Relational Schema Definitions

```sql
-- Target Schema for Classical RAG Literature (Milestones 09 & 10)

CREATE TABLE knowledge_sources (
    id UUID PRIMARY KEY,
    title VARCHAR(100) NOT NULL UNIQUE, -- e.g., 'Charaka Samhita'
    author VARCHAR(100) NOT NULL,       -- e.g., 'Maharshi Agnivesha / Charaka'
    tradition VARCHAR(50) NOT NULL DEFAULT 'Ayurveda',
    total_chunks INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE knowledge_documents (
    id UUID PRIMARY KEY,
    source_id UUID NOT NULL REFERENCES knowledge_sources(id) ON DELETE RESTRICT,
    sthana VARCHAR(100) NOT NULL, -- e.g., 'Sutra Sthana'
    adhyaya VARCHAR(100) NOT NULL, -- e.g., 'Chapter 5: Matrashitiya'
    title VARCHAR(200) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE knowledge_chunks (
    id UUID PRIMARY KEY,
    document_id UUID NOT NULL REFERENCES knowledge_documents(id) ON DELETE RESTRICT,
    
    source_work VARCHAR(100) NOT NULL,
    section_reference VARCHAR(100) NOT NULL, -- e.g., 'Charaka.Sutra.5.12-14'
    verse_numbers VARCHAR(50) NOT NULL,      -- e.g., '12-14'
    
    -- Multilingual Text Fields
    content_sanskrit TEXT NOT NULL,          -- Devanagari Sanskrit shloka
    content_transliteration TEXT,            -- IAST Roman transliteration
    content_english TEXT NOT NULL,           -- Authoritative peer-reviewed English translation
    content_hindi TEXT,                      -- Hindi translation
    botanical_names TEXT[],                  -- e.g., ARRAY['Azadirachta indica', 'Curcuma longa']
    target_doshas VARCHAR(20)[] NOT NULL,    -- e.g., ARRAY['PITTA', 'VATA']
    
    token_count INT NOT NULL CHECK (token_count BETWEEN 50 AND 1000),
    embedding vector(1536) NOT NULL,         -- OpenAI text-embedding-3-small
    
    -- Content Governance Lifecycle
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (
        status IN ('DRAFT', 'UNDER_REVIEW', 'ACTIVE', 'DEPRECATED', 'ARCHIVED')
    ),
    version VARCHAR(20) NOT NULL DEFAULT 'v1.0.0',
    approved_by UUID[] NOT NULL DEFAULT '{}', -- Array of reviewer practitioner IDs
    approved_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 3. Strict Editorial Governance Pipeline

To prevent hallucinated, unverified, or toxic botanical entries from entering the RAG knowledge pool:
1. **Draft Ingestion:** Chunks are imported by technical writers with status `DRAFT`.
2. **Domain Expert Review:** Certified Ayurvedic practitioners audit translations, botanical names, and contraindications. Status shifts to `UNDER_REVIEW`.
3. **Cryptographic Sign-Off:** When approved by at least two certified experts, practitioner UUIDs are appended to `approved_by` and status shifts to `ACTIVE`.
4. **Runtime Guardrail:** The runtime vector search query strictly filters `WHERE status = 'ACTIVE'`.
