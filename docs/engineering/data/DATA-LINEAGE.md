# AayurFace — Database Architecture Specification
## End-to-End Data Lineage & Provenance Architecture

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** AI Data Architect, Principal Database Architect  

---

### 1. Seven-Stage Multimodal Data Lineage Pipeline

```text
STAGE 1: CAPTURE & INTAKE INGESTION
├── Inputs: Camera WebRTC stream, 15-question intake answers, lifestyle form.
├── Transformation: MediaPipe Wasm quality gate in RAM; canvas EXIF strip; HMAC signed S3 PUT.
├── Storage: `captures` table (metadata), `facial-captures/{userId}/{captureId}.jpg` (private S3).
└── Lineage Metadata: `capture_id`, `checksum_sha256`, client metadata hash.

STAGE 2: COMPUTER VISION FEATURE EXTRACTION
├── Inputs: Raw JPEG binary loaded from S3 via ephemeral signed GET (60s TTL).
├── Transformation: Edge worker decodes pixel matrix; calculates CIELAB a*, b*, GLCM contrast, Melanin index.
├── Storage: `visual_observations` table.
└── Lineage Metadata: `cv_version` (e.g., 'cv-v1.0.0').

STAGE 3: MULTIMODAL FUSION & UNCERTAINTY GATING
├── Inputs: `visual_observations`, `questionnaire_responses`, `lifestyle_contexts`.
├── Transformation: Matrix dot product with `fusion_configurations` weights; compute harmonic agreement A.
├── Storage: `multimodal_fusions` table.
└── Lineage Metadata: `fusion_version`, `configuration_id`, `agreement_index`.

STAGE 4: GROUNDED CLASSICAL RAG RETRIEVAL
├── Inputs: Fused imbalance query vector.
├── Transformation: OpenAI `text-embedding-3-small` query embedding; pgvector HNSW cosine search.
├── Storage: Memory buffer of retrieved `knowledge_chunks`.
└── Lineage Metadata: `knowledge_version`, `knowledge_chunk_ids` (foreign key array).

STAGE 5: CONSTRAINED GENERATIVE SYNTHESIS
├── Inputs: Fenced prompt containing user vectors + retrieved classical shlokas.
├── Transformation: OpenAI GPT-4o inference (JSON Mode); Zod validation; medical keyword scrubbing.
├── Storage: In-memory validated structured analysis payload.
└── Lineage Metadata: `model_version` ('gpt-4o-2024-08-06'), `prompt_version` ('prompt-v2.1.0').

STAGE 6: ATOMIC DATABASE PERSISTENCE
├── Inputs: Validated JSON payload from Stage 5.
├── Transformation: Single ACID PostgreSQL transaction.
├── Storage: `scan_results`, `visual_observations`, `multimodal_fusions`, `recommendation_items`.
└── Lineage Metadata: All 6 version strings written immutably to `scan_results`.

STAGE 7: CLIENT CONSUMPTION & PROGRESS ACCUMULATION
├── Inputs: Database record via `GET /api/v1/analysis/:id`.
├── Transformation: Client renders interactive dosha breakdown, canvas overlays, and ritual cards.
├── Storage: `routines`, `routine_tracking`, `progress_checkpoints`.
└── Lineage Metadata: `scan_context_id`, `baseline_scan_id`.
```
