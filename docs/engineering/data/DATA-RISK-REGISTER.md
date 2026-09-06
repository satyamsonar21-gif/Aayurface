# AayurFace — Database Architecture Specification
## Master Data Risk Register (17 Critical Architecture Risks)

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Data Security Architect  

---

### 1. Risk Scoring Methodology
* **Severity / Impact (1–5):** 1 = Negligible, 2 = Minor, 3 = Moderate, 4 = Major, 5 = Catastrophic.
* **Probability / Likelihood (1–5):** 1 = Rare, 2 = Unlikely, 3 = Moderate, 4 = Likely, 5 = Almost Certain.
* **Risk Score:** $\text{Severity} \times \text{Probability}$ (Max 25).

---

### 2. Comprehensive Data Risk Register

| Risk ID | Risk Description | Pre-Sev | Pre-Prob | Pre-Score | Architectural Mitigation Strategy | Post-Sev | Post-Prob | Post-Score | Residual Risk Level | Owner |
|---|---|---|---|---|---|---|---|---|---|---|
| **RSK-DB-01** | BOLA / IDOR cross-tenant data leakage via forged `userId`. | 5 | 4 | **20** | Enforce PostgreSQL kernel RLS; server-side extraction from JWT `auth.uid()`. | 5 | 1 | **5** | Low | Data Security Architect |
| **RSK-DB-02** | Exposure of raw facial biometric imagery to unauthorized parties. | 5 | 3 | **15** | Private S3 bucket with zero public reads; HMAC pre-signed URLs (15m TTL). | 4 | 1 | **4** | Low | Data Security Architect |
| **RSK-DB-03** | Inability to reproduce historical analysis due to unversioned models/prompts. | 4 | 4 | **16** | Multi-vector semantic versioning in `scan_results` (6 version flags). | 2 | 1 | **2** | Low | AI Data Architect |
| **RSK-DB-04** | LLM hallucinating toxic herbal recipes or clinical disease diagnoses. | 5 | 4 | **20** | Grounded RAG retrieval ($\ge 0.75$ cosine similarity); strict Zod validation; regex medical filters. | 4 | 1 | **4** | Low | Ayurvedic Knowledge Analyst |
| **RSK-DB-05** | Resurrection of deleted accounts upon disaster recovery backup restore. | 5 | 3 | **15** | Autonomous `deletion_tombstones` ledger; automated post-restore purge script. | 4 | 1 | **4** | Low | Platform/SRE Architect |
| **RSK-DB-06** | Database table bloat and I/O degradation from base64 image strings. | 4 | 4 | **16** | Strict biometric decoupling; raw images stored in S3; DB holds numerical floats only. | 2 | 1 | **2** | Low | Principal Database Architect |
| **RSK-DB-07** | Duplicate analysis job executions and billing drain from mobile retries. | 4 | 4 | **16** | Database-enforced `UNIQUE (user_id, idempotency_key)` on `analysis_jobs`. | 2 | 1 | **2** | Low | Staff Backend Architect |
| **RSK-DB-08** | Inability to prove DPDP/GDPR consent compliance during regulatory audit. | 5 | 3 | **15** | Immutable append-only `consents` ledger recording policy version and client metadata hash. | 4 | 1 | **4** | Low | Privacy Officer |
| **RSK-DB-09** | Broken referential integrity from unconstrained JSONB in `scan_results`. | 4 | 4 | **16** | Normalized 3NF relational decomposition (`recommendation_items`, `visual_observations`). | 2 | 1 | **2** | Low | Principal Database Architect |
| **RSK-DB-10** | Slow dashboard loading ($> 500\text{ms}$) due to on-the-fly progress delta math. | 3 | 4 | **12** | Precomputed immutable `progress_checkpoints` generated asynchronously upon scan completion. | 2 | 1 | **2** | Low | Performance Architect |
| **RSK-DB-11** | pgvector HNSW memory exhaustion causing latency spikes during RAG search. | 4 | 3 | **12** | Dedicated shared buffer allocation; corpus chunk size capped at $\le 50,000$; `ef_search=40`. | 3 | 1 | **3** | Low | AI Data Architect |
| **RSK-DB-12** | Algorithmic bias across deeper Fitzpatrick skin phototypes (Types III–VI). | 4 | 4 | **16** | Dedicated research schema with stratified benchmark splits and automated Disparate Impact audits. | 3 | 2 | **6** | Moderate | Research Systems Analyst |
| **RSK-DB-13** | Database deadlock or table lock outage during schema migration deployments. | 4 | 3 | **12** | Versioned migration tooling; Expand-Contract pattern; non-blocking `CREATE INDEX CONCURRENTLY`. | 3 | 1 | **3** | Low | DevOps/SRE Architect |
| **RSK-DB-14** | Database connection pool exhaustion under sudden traffic spikes. | 4 | 3 | **12** | Supabase PgBouncer pooler in transaction mode; max connection limits; short statement timeouts. | 3 | 1 | **3** | Low | Platform/SRE Architect |
| **RSK-DB-15** | Accidental deletion of classical literature chunks breaking user history citations. | 4 | 3 | **12** | `ON DELETE RESTRICT` constraint on `knowledge_chunks` referenced by `recommendation_items`. | 2 | 1 | **2** | Low | Principal Database Architect |
| **RSK-DB-16** | Unauthorized privilege escalation where regular user modifies `profiles.role`. | 5 | 3 | **15** | PostgreSQL RLS column-level restrictions preventing modification of `role` and `is_verified`. | 4 | 1 | **4** | Low | Data Security Architect |
| **RSK-DB-17** | Uncontrolled S3 storage cost explosion if facial retention remains open (DEC-004). | 3 | 5 | **15** | Enforce automated S3 bucket lifecycle rules (rolling 30-day purge or immediate extraction purge). | 2 | 1 | **2** | Low | Principal Database Architect |
