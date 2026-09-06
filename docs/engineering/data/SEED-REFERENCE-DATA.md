# AayurFace — Database Architecture Specification
## Seed Data Classification, Reference Datasets & Deployment Governance

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Ayurvedic Knowledge Systems Analyst  

---

### 1. Seed & Reference Data Classification

| Data Category | Target Entity / File | Environment Deployment | Mutability & Versioning | Production Deployment Policy |
|---|---|---|---|---|
| **Constitutional Template**| `questionnaire_templates` (`supabase/seed/intake_v1.sql`) | ALL (Dev, Test, Staging, Prod) | Versioned (`v1.0.0`) | **MANDATORY PRODUCTION SEED:** Core 15 questions and scoring weights must be present at launch. |
| **Fusion Configurations** | `fusion_configurations` (`supabase/seed/fusion_v1.sql`) | ALL (Dev, Test, Staging, Prod) | Versioned (`fuse-v1.0.0`) | **MANDATORY PRODUCTION SEED:** Baseline weights ($0.40, 0.35, 0.25$) and thresholds. |
| **Classical Compendiums** | `knowledge_sources` (`supabase/seed/sources.sql`) | ALL (Dev, Test, Staging, Prod) | Static Reference | **MANDATORY PRODUCTION SEED:** *Charaka*, *Sushruta*, *Ashtanga Hridaya*, *Bhavaprakasha*. |
| **Vetted Classical Chunks**| `knowledge_chunks` (`supabase/seed/chunks_v1.sql`) | ALL (Dev, Test, Staging, Prod) | Versioned (`rag-v1.0.0`) | **MANDATORY PRODUCTION SEED:** Minimum 200 vetted classical verse chunks and 1536-dim embeddings. |
| **Public Remedies Catalog**| `remedies` (`supabase/seed/remedies.sql`) | ALL (Dev, Test, Staging, Prod) | Static Reference | **MANDATORY PRODUCTION SEED:** 30 verified classical home formulations migrated from mock data. |
| **Synthetic Demo Accounts**| Mock profiles & dummy scans (`src/lib/mockData.ts`) | **STRICTLY LOCAL DEV & TEST ONLY** | Ephemeral | **STRICTLY PROHIBITED IN PRODUCTION:** Zero synthetic profiles, mock scans, or fake emails in prod. |

---

### 2. Versioning & Deployment Automation

* Seed scripts are stored under `supabase/seed/` and committed to version control.
* Seed files use idempotent `INSERT ... ON CONFLICT DO NOTHING` statements to prevent duplicate key errors during re-runs.
* Automated CI/CD pipelines run `supabase db reset` locally for integration testing and apply versioned seed files automatically.
