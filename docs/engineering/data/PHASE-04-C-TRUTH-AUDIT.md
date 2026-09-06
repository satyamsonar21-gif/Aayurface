# AayurFace — Phase 04-C Truth Audit
## Data Architecture Truth Audit, Terminology Hardening & Validation-Status Classification

**Phase:** Phase 04-C — Truth Audit & Quality Hardening  
**Date:** 2026-09-03  
**Status:** COMPLETE & FORMALLY CERTIFIED  
**Authority:** Principal Database Architect, Data Architect, AI Data Architect, Data Security Architect, Research Data Architect, Principal Software Architect, Hostile Senior Reviewer  
**Classification:** STRICT AUDIT / DOCUMENTATION ONLY (Zero Code / Zero DDL / Zero Runtime Mutations)

---

## 1. Executive Summary & Purpose

Phase 04 established the complete target database and data architecture for AayurFace, comprising 48 comprehensive specifications, 15 Architecture Decision Records (ADRs), and 12 visual Mermaid architectural diagrams.

The purpose of **Phase 04-C** is not to redesign the architecture, nor to implement application features or execute database migrations. Its sole, rigorous mission is to perform a systematic **Truth and Terminology Audit** across all Phase 04 artifacts to eliminate any remaining ambiguity between current repository state, target architecture, proposed hypotheses, and unvalidated claims.

### Core Audit Principles:
1. **Truth Over Completion:** Every architectural claim must be technically honest and accurately tagged. No target capability may masquerade as an existing runtime guarantee.
2. **Strict Implementation Boundary:** Implementation verification (e.g., executing RLS cross-tenant tests, issuing S3 signed URLs, benchmarking pgvector latency, testing deletion cascades) is **INTENTIONALLY OUT OF SCOPE** for Phase 04-C. These belong to later implementation and testing phases.
3. **Clinical Terminology Hardening:** AayurFace is **NOT** a medical diagnostic device, clinical decision support system, or disease treatment platform. All medicalized terminology has been eradicated and replaced with precise non-clinical, evidence-aware Ayurvedic domain and engineering terminology.
4. **Safety Threshold Reclassification:** All numerical thresholds (such as 0.75 cosine similarity and minimum 2 vetted matches) are formally reclassified as **HYPOTHESIS / PROPOSED SAFETY CONFIGURATIONS** requiring empirical calibration against curated datasets before being treated as validated production gates.

---

## 2. The 9 Approved Truth-Status Labels & Governance Rules

Across all AayurFace architectural and engineering documentation, only the following **nine approved status labels** are permitted. No ambiguous, invented, or unverified categories may be used:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       THE 9 TRUTH-STATUS LABELS                             │
├──────────────────────────┬──────────────────────────────────────────────────┤
│ 1. CURRENT VERIFIED      │ Actively implemented, verified in codebase/DB.   │
│ 2. TARGET                │ Planned, approved architectural target.          │
│ 3. PROPOSED              │ Candidate design requiring implementation review.│
│ 4. HYPOTHESIS            │ Mathematical/algorithmic assumption needing test.│
│ 5. OPEN DECISION         │ Unresolved architectural fork with open options. │
│ 6. UNVERIFIED            │ Claim lacking empirical or codebase proof.       │
│ 7. REQUIRES VALIDATION   │ Target requiring experimental/benchmark proof.   │
│ 8. REQUIRES IMPLEMENTATION│ Spec finalized; code/migration pending.         │
│ 9. REQUIRES LEGAL REVIEW │ Statutory/regulatory compliance check required.  │
└──────────────────────────┴──────────────────────────────────────────────────┘
```

### Governance Rules:
* If an entity exists in `supabase/schema.sql` (e.g., prototype `profiles`, `remedies`), its status is **`CURRENT VERIFIED (REWORK)`** because the prototype requires schema hardening and normalization.
* If an entity or capability is designed for production (e.g., `scan_results`, `visual_observations`, `multimodal_fusions`), its status is **`TARGET (REQUIRES IMPLEMENTATION)`**.
* If a numerical constant or gating logic is specified (e.g., 0.75 cosine similarity, 40/35/25% fusion weights, 15-minute signed URL expiration), it is tagged **`HYPOTHESIS / PROPOSED (REQUIRES VALIDATION)`**.
* If a regulatory or privacy policy boundary is established (e.g., 365-day audit retention under DPDP Act), it is tagged **`REQUIRES LEGAL REVIEW`**.

---

## 3. Terminology Hardening: Clinical vs Ayurvedic / Research / Engineering

To prevent regulatory misclassification and align with medical disclaimer requirements, all Phase 04 documents have been audited to replace medical/clinical phrasing with standardized domain terminology:

| Prohibited Clinical Terminology | Hardened Approved Terminology | Architectural & Legal Rationale |
|---|---|---|
| `clinical ground truth` | **`expert reference label`** / **`expert-consensus reference label`** | AayurFace does not establish clinical medical truth; it establishes expert practitioner reference benchmarks. |
| `clinical consensus` | **`expert consensus`** / **`inter-rater practitioner agreement`** | Refers to multi-expert Ayurvedic practitioner agreement, not clinical medical trials. |
| `clinical research` / `clinical dataset` | **`research dataset`** / **`expert evaluation enclave`** | Isolates post-MVP research evaluations without claiming medical trial status. |
| `medical diagnosis` / `diagnostic accuracy` | **`Ayurvedic constitutional assessment`** / **`model evaluation`** | Platform evaluates facial visual characteristics and doshic tendencies, not dermatological pathology. |
| `clinical validation` | **`research validation`** / **`empirical calibration`** | Focuses on statistical calibration and literature grounding rather than clinical therapeutic efficacy. |
| `clinical traceability` | **`Ayurvedic lineage & prompt auditability`** | Focuses on reconstructing the exact input vectors, weights, and classical literature citations. |
| `patient` | **`user`** / **`participant`** (research cohort) | AayurFace serves consumer wellness users and research study participants, not patients. |
| `treatment prescription` | **`wellness guidance & daily Dinacharya recommendations`** | Generative outputs suggest lifestyle, dietary, and herbal wellness rituals, not medical prescriptions. |

---

## 4. Comprehensive Claims Inventory & Classification Matrix

Every persistent table, key architectural mechanism, and storage tier has been inventoried and assigned its unambiguous truth status:

| # | Entity / Architecture Component | Current Codebase State | Target Architecture State | Rigorous Truth-Status Classification |
|---|---|---|---|---|
| 1 | `auth.users` | Supabase Auth Managed | Delegated Auth Anchor | `CURRENT VERIFIED` |
| 2 | `profiles` | Flat, unnormalized (7 cols) | Normalized user profile (11 cols) | `CURRENT VERIFIED (REWORK)` / `TARGET` |
| 3 | `user_preferences` | Missing in DB | Dedicated preferences table | `TARGET (REQUIRES IMPLEMENTATION)` |
| 4 | `consents` | Missing in DB | Immutable consent ledger | `TARGET (REQUIRES IMPLEMENTATION)` |
| 5 | `questionnaire_templates` | Missing in DB | Versioned template catalog | `TARGET (REQUIRES IMPLEMENTATION)` |
| 6 | `questionnaire_responses` | Flat JSON in prototype | Immutable response ledger | `TARGET (REQUIRES IMPLEMENTATION)` |
| 7 | `lifestyle_contexts` | Missing in DB | Environmental/stress inputs | `TARGET (REQUIRES IMPLEMENTATION)` |
| 8 | `captures` | Missing in DB | Biometric capture tracking | `TARGET (REQUIRES IMPLEMENTATION)` |
| 9 | `capture_quality_metrics` | Missing in DB | Wasm quality gateway metrics | `TARGET (REQUIRES IMPLEMENTATION)` |
| 10 | `analysis_jobs` | Missing in DB | Async state machine & queue | `TARGET (REQUIRES IMPLEMENTATION)` |
| 11 | `scan_results` | Flat JSON in prototype | Central analysis entity | `TARGET (REQUIRES IMPLEMENTATION)` |
| 12 | `visual_observations` | Missing in DB | Normalized numerical vectors | `TARGET (REQUIRES IMPLEMENTATION)` |
| 13 | `fusion_configurations` | Missing in DB | Versioned weight configurations | `HYPOTHESIS / PROPOSED (REQUIRES VALIDATION)` |
| 14 | `multimodal_fusions` | Missing in DB | Fused vectors & agreement $A$ | `TARGET (REQUIRES IMPLEMENTATION)` |
| 15 | `recommendation_items` | Flat JSON in prototype | Grounded ritual cards | `TARGET (REQUIRES IMPLEMENTATION)` |
| 16 | `routines` | Missing in DB | Active Dinacharya routine | `TARGET (REQUIRES IMPLEMENTATION)` |
| 17 | `routine_items` | Missing in DB | Individual routine steps | `TARGET (REQUIRES IMPLEMENTATION)` |
| 18 | `routine_tracking` | Missing in DB | Daily habit adherence log | `TARGET (REQUIRES IMPLEMENTATION)` |
| 19 | `progress_checkpoints` | Missing in DB | Precomputed progress deltas | `TARGET (REQUIRES IMPLEMENTATION)` |
| 20 | `chat_messages` | Missing in DB | Minimal textual chat history | `TARGET (REQUIRES IMPLEMENTATION)` |
| 21 | `shared_reports` | Missing in DB | SHA-256 token public shares | `TARGET / PROPOSED (REQUIRES IMPLEMENTATION)` |
| 22 | `knowledge_sources` | Missing in DB | Compendium catalog | `TARGET (REQUIRES IMPLEMENTATION)` |
| 23 | `knowledge_documents` | Missing in DB | Section & chapter hierarchy | `TARGET (REQUIRES IMPLEMENTATION)` |
| 24 | `knowledge_chunks` | Missing in DB | Vetted shlokas + pgvector | `TARGET (REQUIRES IMPLEMENTATION)` |
| 25 | `research.research_subjects`| Missing in DB | Post-MVP de-identified cohort | `TARGET / POST-MVP (REQUIRES VALIDATION)` |
| 26 | `research.expert_annotations`| Missing in DB | Double-blind practitioner log | `TARGET / POST-MVP (REQUIRES VALIDATION)` |
| 27 | `research.consensus_labels` | Missing in DB | Fleiss' Kappa consensus | `TARGET / POST-MVP (REQUIRES VALIDATION)` |
| 28 | `research.fairness_benchmarks`| Missing in DB | Subgroup fairness audits | `TARGET / POST-MVP (REQUIRES VALIDATION)` |
| 29 | `security_audit_events` | Missing in DB | Immutable WORM security log | `TARGET / PROPOSED (REQUIRES VALIDATION)` |
| 30 | `deletion_tombstones` | Missing in DB | Anonymous user purge ledger | `TARGET (REQUIRES IMPLEMENTATION)` |
| 31 | `remedies` | Prototype exists (8 cols) | Vetted reference remedies | `CURRENT VERIFIED (REWORK)` / `TARGET` |
| 32 | **Kernel RLS Policies** | None active on prototype | Enforced on 100% user tables | `TARGET (REQUIRES IMPLEMENTATION & VERIFICATION)`|
| 33 | **Private S3 Storage** | None configured | Private bucket with signed URLs| `TARGET (REQUIRES IMPLEMENTATION & SECURITY TEST)`|
| 34 | **pgvector Cosine Search** | Extension not enabled | HNSW index ($m=16, ef=64$) | `TARGET (REQUIRES IMPLEMENTATION & LOAD TEST)` |
| 35 | **UUIDv7 Primary Keys** | UUIDv4 in prototype | UUIDv7 for operational rows | `PROPOSED / TARGET (REQUIRES COMPATIBILITY CHECK)`|

---

## 5. Algorithmic & Retrieval Threshold Safety Hypotheses Audit

### 5.1 Retrieval Safety Thresholds (pgvector)
* **Threshold Claims:**
  * Minimum Cosine Similarity $\ge 0.75$
  * Minimum Match Count $\ge 2$ vetted classical chunks
* **Truth-Status Classification:** **`HYPOTHESIS / PROPOSED SAFETY CONFIGURATION (REQUIRES VALIDATION)`**
* **Mandatory Formal Statement:**
  > *"The values 0.75 cosine similarity and minimum 2 vetted matches are initial safety hypotheses/configuration candidates. They require empirical calibration against the actual curated knowledge corpus and retrieval evaluation dataset before being treated as validated operating thresholds."*
* **Mandatory Future Validation Suite (Milestone 09/10):**
  1. *Retrieval Precision:* Proportion of retrieved chunks relevant to the target constitutional imbalance.
  2. *Retrieval Recall:* Proportion of known authoritative classical verses retrieved.
  3. *False-Positive Rate:* Frequency of retrieving non-applicable or contraindicated herbs.
  4. *False-Negative Rate:* Frequency of failing to retrieve critical classical safety warnings.
  5. *Corpus Scaling:* Performance and ranking stability across 1,000 to 50,000 chunks.
  6. *Embedding Model Evaluation:* `text-embedding-3-small` vs multilingual domain models.
  7. *Language Variation:* Sanskrit Devanagari vs IAST transliteration vs English translations.
  8. *Chunking Strategy:* Optimization of 300 vs 500 vs 800 token windows across shlokas.
  9. *Duplicate Verse Resolution:* Deduplicating parallel passages in *Charaka* and *Ashtanga Hridaya*.
  10. *Source Authority Weighting:* Preferential scoring of primary Brihat Trayi treatises.
  11. *Multilingual Retrieval Alignment:* Cross-lingual accuracy between English queries and Sanskrit verses.
  12. *Expert Relevance Scoring:* Double-blind relevance evaluations by certified Ayurvedic scholars.

### 5.2 Multimodal Fusion Weights & Confidence Calibration
* **Initial Proposed Weights:** $w_1 = 0.40$ (Visual), $w_2 = 0.35$ (Questionnaire), $w_3 = 0.25$ (Lifestyle).
* **Truth-Status Classification:** **`INITIAL HYPOTHESIS / PROPOSED CONFIGURATION (REQUIRES VALIDATION)`**
* **Harmonic Agreement Thresholds:**
  * High Agreement $A \ge 0.80 \rightarrow$ High Confidence ($80–95\%$)
  * Moderate Agreement $0.60 \le A < 0.80 \rightarrow$ Moderate Confidence ($60–79\%$)
  * Modality Clash $A < 0.60 \rightarrow$ Bounded Low Confidence ($< 60\%$)
* **Validation Requirement:** Empirical calibration against Milestone 18 practitioner consensus datasets.

---

## 6. Expert Consensus & Ground Referencing Architecture Audit

The architecture establishes a rigorous protocol for validating AI models against certified practitioner evaluations without claiming clinical diagnostic truth:

```text
Participant (De-Identified Masked ROIs)
    │
    ├──► Independent Expert Assessment #1 (Ayurvedic Practitioner A)
    ├──► Independent Expert Assessment #2 (Ayurvedic Practitioner B)
    └──► Independent Expert Assessment #3 (Ayurvedic Practitioner C)
            │
            ▼
    Agreement Analysis (Fleiss' Kappa κ Calculation)
            │
            ▼
    Consensus / No Consensus Determination
            │
            ▼
    Expert Reference Label (Derived Consensus State)
            │
            ▼
    Research Dataset (Stratified by Skin-Tone / Pigmentation Subgroups)
            │
            ▼
    Model Evaluation (Algorithmic Calibration & Fairness Benchmarking)
```

### Truth Invariants:
1. **Double-Blind Isolation:** Annotators review masked cheek/forehead crops without access to user PII, history, or peer annotations (`TARGET / POST-MVP`).
2. **Immutable Submission:** Annotations lock immediately (`is_locked = TRUE`) to prevent consensus anchoring bias.
3. **Statistical Agreement:** Inter-rater reliability quantified using Fleiss' Kappa ($\kappa$). If $\kappa \ge 0.70$, statistical mean is derived; if $\kappa < 0.70$, senior arbitration is required.
4. **Non-Clinical Reference Standard:** Derived outputs are formally designated **`expert reference labels`** for engineering benchmarking, not medical diagnoses.

---

## 7. WORM Audit, Data Minimization & Statutory Erasure Reconciliation Audit

To reconcile immutable audit logging with statutory right-to-erasure requirements (DPDP Act 2023 / GDPR), the data architecture explicitly separates five distinct categories:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       DATA & TELEMETRY TAXONOMY                             │
├───────────────────────┬─────────────────────────┬───────────────────────────┤
│ 1. Security Audit Log │ `security_audit_events` │ Append-only WORM (365d)   │
│ 2. Operational Log    │ Datadog / Sentry        │ Ephemeral APM (30d TTL)   │
│ 3. User Wellness Data │ `scan_results`, etc.    │ User-owned (Purged on req)│
│ 4. Personal Identifiers│ `profiles.email`, etc. │ Mutable (Purged on req)   │
│ 5. Deletion Tombstone │ `deletion_tombstones`   │ Anonymous SHA-256 hash    │
└───────────────────────┴─────────────────────────┴───────────────────────────┘
```

### Audit Status & Validations:
* **Status:** **`TARGET / PROPOSED ARCHITECTURE (REQUIRES VALIDATION & LEGAL REVIEW)`**.
* **PII Minimization Invariant:** Passwords, auth tokens, client IP addresses (truncated to `/24`), and raw biometric images are strictly excluded/redacted from immutable audit payloads.
* **Account Erasure Interaction:** User deletion triggers cascade across all operational tables while detaching `security_audit_events.actor_id` (`ON DELETE SET NULL`), preserving audit integrity without retaining personal identifiers.
* **Tombstone Reconciliation:** Post-restore disaster recovery scripts query `deletion_tombstones` to prevent previously deleted users from being resurrected into production (*REQUIRES INFRASTRUCTURE TESTING*).

---

## 8. Skin-Tone Subgroups & Fitzpatrick Classification Fairness Audit

### Scientific & Methodological Constraints:
1. **Not Objective Ground Truth:** Fitzpatrick phototyping is a UV erythema scale, not an objective or comprehensive metric of skin health, tone, or Ayurvedic constitution.
2. **Subjectivity & Ambient Bias:** Early classifications based on user self-report or computer vision approximation are vulnerable to lighting and perceptual variations.
3. **Subgroup Proxy Variables:** Subgroups (`TYPE_I` through `TYPE_VI`) are treated strictly as **proxy subgroup variables** for auditing algorithmic equity.
4. **Status Classification:** **`PROPOSED / REQUIRES VALIDATION (POST-MVP MILESTONE 18)`**.
5. **Equity Benchmark:** Disparate Impact Ratio across subgroups must remain $\ge 0.80$ (Four-Fifths Rule) before any vision model update is certified for release.

---

## 9. Identity & Key Architecture Audit (UUIDv7 vs UUIDv4)

* **Operational Tables:** UUIDv7 (RFC 9562) is proposed for high-frequency operational tables (`scan_results`, `visual_observations`, `multimodal_fusions`, `captures`, `routine_tracking`, `security_audit_events`) to eliminate B-tree page splits and optimize sequential write locality.
* **External Tokens:** Cryptographically random UUIDv4 / SHA-256 tokens are used for public report shares and idempotency keys to prevent timestamp enumeration.
* **Status Classification:** **`PROPOSED / TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION COMPATIBILITY CHECK)`**. Client-side/Deno generation (`uuidv7` npm library) is recommended prior to native PostgreSQL 17 deployment.

---

## 10. Storage Architecture & Ephemeral Assets Audit

* **Raw Biometric Isolation:** High-resolution facial images are never stored in relational tables; they are uploaded directly to private S3 object storage via short-lived HMAC signed URLs.
* **EXIF Stripping:** Client-side canvas redraw permanently removes 100% of GPS and hardware metadata before upload (`TARGET`).
* **Preservation of Open Decision DEC-004:**
  * *Option A:* Immediate post-extraction purge of raw facial images.
  * *Option B:* Rolling 30-day automated lifecycle purge.
  * *Status:* **`OPEN DECISION (DEC-004)`** — preserved without premature resolution.

---

## 11. Performance, Latency & Capacity Estimates Audit

All performance and capacity figures are formally classified as **`CAPACITY ESTIMATES & TARGET OBJECTIVES (REQUIRES LOAD TESTING & PRODUCTION BENCHMARKING)`**:

| Metric | Target Architecture Estimate | Basis of Estimate | Validation Status |
|---|---|---|---|
| **P95 Analysis Query Latency** | $\le 150\text{ ms}$ | Single-row indexed B-tree lookup | `REQUIRES LOAD TESTING` |
| **pgvector Cosine Search Latency** | $\le 20\text{ ms}$ | In-memory HNSW index ($ef=40$) | `REQUIRES LOAD TESTING` |
| **Active Routine Home Screen** | $\le 10\text{ ms}$ | Partial B-tree index on active routine | `REQUIRES LOAD TESTING` |
| **Annual Relational Storage (100k Users)**| $\approx 102\text{ GB}$ | Normalized 3NF row sizing | `CAPACITY ESTIMATE` |
| **HNSW Index RAM Footprint (50k Chunks)**| $\approx 350\text{ MB}$ | 1536-dim vector memory model | `CAPACITY ESTIMATE` |
| **Disaster Recovery RPO Objective** | $\le 5\text{ minutes}$ | Continuous WAL streaming to S3 | `REQUIRES DR DRILL VALIDATION` |
| **Disaster Recovery RTO Objective** | $\le 60\text{ minutes}$ | Terraform replica provisioning | `REQUIRES DR DRILL VALIDATION` |

---

## 12. Architecture Decision Records (ADRs) Truth Audit

All 15 Data ADRs have been audited to ensure their status reflects architectural intent rather than claimed runtime implementation:

| ADR ID | Title | Verified Truth Status | Correction Applied in Phase 04-C |
|---|---|---|---|
| `ADR-DB-001` | Identifier Strategy (UUIDv7 vs UUIDv4) | `PROPOSED / TARGET` | Clarified as proposed key architecture; requires compatibility check. |
| `ADR-DB-002` | Relational 3NF vs Hybrid JSONB | `TARGET` | Clarified target relational boundaries; requires implementation. |
| `ADR-DB-003` | Sensitive Data Tier Separation | `TARGET` | Renamed "Clinical Signal Tier" to "Wellness & Health Observation Tier". |
| `ADR-DB-004` | Biometric Object Storage & Signed URLs | `TARGET / PROPOSED` | Tagged 15m signed URL TTL as proposed; requires security testing. |
| `ADR-DB-005` | Analysis Snapshot Versioning & Immutability | `TARGET` | Renamed "Clinical Traceability" to "Ayurvedic Lineage Traceability". |
| `ADR-DB-006` | Explicit Consent Ledger | `TARGET` | Tagged as target compliance schema; requires legal review. |
| `ADR-DB-007` | Row-Level Security & Server Identity | `TARGET` | Tagged as target kernel security policy; requires cross-user test. |
| `ADR-DB-008` | Dynamic Intake Question Catalog | `TARGET` | Tagged as target versioned catalog; requires editorial seed data. |
| `ADR-DB-009` | Double-Blind Expert Research Enclave | `PROPOSED / TARGET (POST-MVP)`| Replaced clinical ground truth with expert reference labels. |
| `ADR-DB-010` | Cascading Deletion & Tombstone Protocol | `TARGET` | Clarified target erasure state machine; requires DR testing. |
| `ADR-DB-011` | Vector Storage (pgvector + HNSW) | `TARGET (REQUIRES VALIDATION)`| Reclassified 0.75 / 2 matches to HYPOTHESIS safety configuration. |
| `ADR-DB-012` | Soft vs Hard Delete Architecture | `TARGET` | Tagged hard-delete user data / soft-archive knowledge as target. |
| `ADR-DB-013` | Immutable WORM Audit Telemetry | `TARGET / PROPOSED` | Tagged as target WORM schema; added 5-tier stream distinctions. |
| `ADR-DB-014` | Client-Side Idempotency Protocol | `TARGET` | Tagged as target middleware protocol; requires implementation. |
| `ADR-DB-015` | Partial & Functional Indexing Strategy | `TARGET` | Tagged as target index plan; requires production load testing. |

---

## 13. Architectural Diagrams Audit

All 12 visual Mermaid diagrams in `docs/engineering/data/diagrams/` have been audited and updated:
1. `conceptual-domain-model.mmd`: Renamed `ResearchClinicalDomain` to `ResearchExpertEvaluationDomain`.
2. `relational-erd.mmd`: Verified 3NF relationships, foreign key cascades, and status annotations.
3. `facial-data-flow.mmd`: Added explicit `TARGET` labels to S3 and database; labeled 15m signed URL as `PROPOSED`.
4. `analysis-data-flow.mmd`: Labeled cosine threshold and match gates as `Hypothesis Safety Gate (Requires Validation)`.
5. `multimodal-fusion.mmd`: Tagged 40/35/25% fusion weights and agreement thresholds as `Proposed Configuration`.
6. `rag-data-flow.mmd`: Labeled threshold gating as `Hypothesis Safety Gate (Requires Empirical Calibration)`.
7. `research-data-flow.mmd`: Replaced "Clinical Research Enclave" with "Isolated Expert Research Enclave (Post-MVP Target Architecture)"; updated to "Derive Expert Reference Label".
8. `deletion-flow.mmd`: Tagged tombstone reconciliation as target DR protocol.
9. `rls-ownership-flow.mmd`: Verified server-derived `auth.uid()` evaluation protocol (*Requires Implementation in Milestone 04*).
10. `async-job-lifecycle.mmd`: Verified queue state machine (`QUEUED` $\rightarrow$ `PROCESSING` $\rightarrow$ `COMPLETED`/`FAILED`).
11. `api-database-flow.mmd`: Labeled database layer as `TARGET: PostgreSQL Relational Engine (Kernel RLS — Requires Implementation)`.
12. `backup-recovery-flow.mmd`: Labeled RPO/RTO metrics as `TARGET / PROPOSED OBJECTIVES`.

---

## 14. Contradiction & Ambiguity Resolution Log

| ID | Issue Identified during Audit | Resolution Applied in Phase 04-C | Truth Status |
|---|---|---|---|
| **RES-01** | `EXPERT-CONSENSUS-MODEL.md` referred to "clinical gold standard". | Corrected to "expert reference label" and "expert-consensus reference label". | `CONFIRMED NON-CLINICAL` |
| **RES-02** | `PGVECTOR-STRATEGY.md` stated 0.75 and 2 matches as hard rules. | Reclassified as `HYPOTHESIS / PROPOSED SAFETY CONFIGURATION (REQUIRES VALIDATION)`. | `CONFIRMED HYPOTHESIS` |
| **RES-03** | `RESEARCH-DATA-MODEL.md` titled as "Clinical Research Enclave". | Retitled to "Expert Research Enclave, De-Identification & Fairness Modeling (Post-MVP)". | `CONFIRMED NON-CLINICAL` |
| **RES-04** | Fitzpatrick Phototyping lacked explicit scientific disclaimers. | Added 4-point disclaimer on UV erythema scope, self-report bias, and subgroup proxy usage. | `CONFIRMED PROPOSED` |
| **RES-05** | `AUDIT-DATA-MODEL.md` lacked explicit distinction between data and logs. | Added 5-tier taxonomy (Security Audit, Operational Log, User Data, PII, Tombstones). | `CONFIRMED DISTINCTION` |
| **RES-06** | `BACKUP-RECOVERY.md` phrased RPO/RTO as production guarantees. | Relabeled as `TARGET / PROPOSED OBJECTIVES (REQUIRES INFRASTRUCTURE VALIDATION)`. | `CONFIRMED TARGET` |
| **RES-07** | `RETENTION-DELETION.md` claimed "guarantees deleted users are never resurrected". | Replaced with "TARGET: designed to prevent resurrections (REQUIRES RECONCILIATION TESTING)". | `CONFIRMED TARGET` |

---

## 15. Implementation Verification Boundary & Future Requirements

> [!IMPORTANT]
> **Boundary Statement:** Implementation verification is **INTENTIONALLY OUT OF SCOPE** for Phase 04-C. No attempt has been made to verify runtime execution of RLS policies, S3 signed URLs, pgvector lookups, worker queues, or deletion cascades.

### Future Verification Requirements by Phase:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FUTURE IMPLEMENTATION & VERIFICATION PLAN                │
├───────────────────┬─────────────────────────────────────────────────────────┤
│ Milestone 04      │ Supabase Migration & DDL Execution                      │
│ (Phase 06)        │ • Verify foreign key constraints and CHECK rules.       │
│                   │ • Verify UUIDv7 PL/pgSQL generation function.           │
│                   │ • Automated SQL unit tests (pgTAP) for schema sanity.   │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ Milestone 05      │ Kernel Row-Level Security (RLS) Verification            │
│ (Phase 06)        │ • Execute cross-tenant read/write penetration tests.     │
│                   │ • Verify zero data leakage using compromised JWT claims.│
│                   │ • Assert client-supplied userId headers are ignored.    │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ Milestone 06      │ Private S3 & Signed URL Security Validation             │
│ (Phase 06)        │ • Verify raw capture objects reject public HTTP GET.    │
│                   │ • Validate 15-minute signed PUT and 60s signed GET TTL. │
│                   │ • Assert 100% EXIF stripping via image metadata parser. │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ Milestone 09      │ Classical Knowledge Corpus & pgvector Retrieval Testing │
│ (Phase 07)        │ • Measure HNSW query latency under 50,000 chunk load.   │
│                   │ • Empirically calibrate 0.75 cosine similarity cutoff.  │
│                   │ • Validate fallback trigger when match count < 2.       │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ Milestone 11      │ Multimodal Fusion Calibration & Boundary Testing        │
│ (Phase 07)        │ • Benchmark fusion calculations across 500 test cases.  │
│                   │ • Validate confidence capping (<60%) on modality clash. │
│                   │ • Verify numerical precision and rounding invariants.   │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ Milestone 14      │ WORM Audit, Deletion Cascades & DR Reconciliation Drill │
│ (Phase 08)        │ • Execute account deletion and verify zero orphan rows. │
│                   │ • Verify WORM rules block UPDATE/DELETE on audit table. │
│                   │ • Execute PITR restore and run tombstone reconciler.    │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ Milestone 18      │ Double-Blind Expert Consensus & Fairness Auditing       │
│ (Post-MVP)        │ • Calculate Fleiss' Kappa across multi-rater cohorts.   │
│                   │ • Audit Disparate Impact across skin-tone subgroups.    │
│                   │ • Derive validated expert reference benchmarks.         │
└───────────────────┴─────────────────────────────────────────────────────────┘
```
