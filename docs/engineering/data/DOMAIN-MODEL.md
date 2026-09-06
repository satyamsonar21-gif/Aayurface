# AayurFace — Database Architecture Specification
## Target Data Domain Model & Storage Allocation

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Data Architect, Solution Architect, AI Data Architect  

---

### 1. Conceptual Domain Boundaries

The target data model decomposes the AayurFace platform into eight logical data bounded contexts:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. IDENTITY & GOVERNANCE BOUNDED CONTEXT                                    │
│ Auth Credentials • Profiles • Preferences • Consent Ledger • Audit Events   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────┴──────────────────────────────────────┐
│ 2. CONSTITUTIONAL & LIFESTYLE INTAKE CONTEXT                                │
│ Questionnaire Templates • Intake Responses • Dynamic Lifestyle Contexts     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────┴──────────────────────────────────────┐
│ 3. BIOMETRIC CAPTURE & QUALITY CONTEXT                                      │
│ Ephemeral Stream • Capture Sessions • Quality Metrics • S3 Object Metadata   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────┴──────────────────────────────────────┐
│ 4. ORCHESTRATION & ANALYSIS CONTEXT                                         │
│ Analysis Jobs • Visual Observations • Multimodal Fusion • Scan Snapshots     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────┴──────────────────────────────────────┐
│ 5. AYURVEDIC INTELLIGENCE & GUIDANCE CONTEXT                                │
│ Tridosha States • Actionable Rituals • Classical Citations • Daily Routines │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────┴──────────────────────────────────────┐
│ 6. LONGITUDINAL PROGRESS & SHARING CONTEXT                                  │
│ Checkpoint Snapshots • Historical Deltas • Cryptographic Share Tokens • PDFs │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────┴──────────────────────────────────────┐
│ 7. CLASSICAL KNOWLEDGE BASE & RAG CONTEXT                                   │
│ Compendiums • Canonical Documents • Vetted Chunks • pgvector Embeddings      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────┴──────────────────────────────────────┐
│ 8. EXPERT RESEARCH & EVALUATION CONTEXT (POST-MVP)                          │
│ De-Identified Subjects • Masked ROIs • Expert Annotations • Consensus Labels│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Comprehensive Concept Storage Allocation Matrix

Rather than naively creating a database table for every domain concept, each concept is evaluated and allocated to its optimal architectural storage paradigm:

| Domain Concept | Storage Paradigm Decision | Storage Location | Mutability & Versioning | Architectural Rationale (WHY) | Status |
|---|---|---|---|---|---|
| **Identity & Passwords** | Externally Managed Entity | Supabase Auth (`auth.users`) | Mutable via Auth API | Delegated to specialized auth engine; zero password hashes in application tables. | `TARGET` |
| **User Profile** | Relational Entity | PostgreSQL `profiles` table | Mutable (updated_at) | Structured, frequently queried for display, core foreign key anchor. | `TARGET` |
| **UI Preferences** | Relational Entity / JSONB | PostgreSQL `user_preferences` table | Mutable | Low-cardinality UI flags (theme, language, audio toggles). | `TARGET` |
| **Consent Ledger** | Immutable Relational Entity | PostgreSQL `consents` table | Immutable (Append-only) | Legal compliance audit trail; requires exact timestamp, policy version, and scope. | `TARGET` |
| **Questionnaire Template** | Versioned Relational Entity | PostgreSQL `questionnaire_templates` | Versioned | Master question set; versioned to support historical analysis reproducibility. | `TARGET` |
| **Intake Responses** | Versioned Relational Entity | PostgreSQL `questionnaire_responses` | Immutable per analysis | Raw answers and calculated intake dosha scores required for fusion lineage. | `TARGET` |
| **Lifestyle Context** | Versioned Relational Entity | PostgreSQL `lifestyle_contexts` | Immutable per analysis | Dynamic environment context (sleep, stress, climate) feeding the fusion engine. | `TARGET` |
| **Capture Video Stream** | Ephemeral Volatile State | Browser WebAssembly RAM | Ephemeral (Dropped in ms) | Strict privacy; continuous video frames must never touch disk or network. | `TARGET` |
| **Capture Attempt** | Relational Entity | PostgreSQL `captures` table | Immutable metadata | Tracks metadata, storage path, and retention state for the frozen frame. | `TARGET` |
| **Capture Quality Metrics**| Relational Entity / JSONB | PostgreSQL `capture_quality_metrics` | Immutable metadata | Lighting, blur variance, centering metrics; raw landmarks stored as JSONB. | `TARGET` |
| **Raw Facial Image** | Private Object Storage | Private S3 Bucket (`facial-captures/`)| Decoupled / Purgeable | High-resolution binary imagery cannot be stored in PostgreSQL without table bloat. | `TARGET / OPEN DECISION (DEC-004)` |
| **Analysis Job** | State Machine Relational Entity | PostgreSQL `analysis_jobs` table | Mutable state transitions | Tracks queue lifecycle (`QUEUED` $\rightarrow$ `COMPLETED`/`FAILED`) with idempotency. | `TARGET` |
| **Scan Result Snapshot** | Immutable Relational Entity | PostgreSQL `scan_results` table | Immutable snapshot | Central analysis entity anchoring dominant dosha, confidence, and version lineage. | `TARGET` |
| **Visual Observations** | Normalized Relational Entity | PostgreSQL `visual_observations` | Immutable per scan | Derived scalar metrics (CIELAB $a^*$, GLCM, Melanin) decoupled from raw pixels. | `TARGET` |
| **Regional Face ROIs** | JSONB within Observations | `visual_observations.regional_features` | Immutable JSONB | Forehead/cheek bounding boxes read together for UI overlays; no separate joins needed. | `TARGET` |
| **Multimodal Fusion** | Normalized Relational Entity | PostgreSQL `multimodal_fusions` | Immutable per scan | Mathematical vectors (visual, quiz, lifestyle, fused) and harmonic agreement $A$. | `TARGET` |
| **Fusion Configuration**| Versioned Relational Entity | PostgreSQL `fusion_configurations` | Versioned (Immutable rows) | Master weight definitions ($w_1, w_2, w_3$); versioned to track calibration experiments. | `HYPOTHESIS / PROPOSED (REQUIRES VALIDATION)` |
| **Harmonic Agreement $A$** | Derived Scalar Value | Stored in `multimodal_fusions.agreement_index` | Immutable scalar | Persisted scalar to avoid expensive on-the-fly recomputation during dashboard queries. | `TARGET` |
| **Calibrated Confidence**| Derived Scalar Value | Stored in `scan_results.calibrated_confidence` | Immutable scalar | Explicitly bounded confidence value ($< 60\%$ on modality clash). | `TARGET` |
| **Recommendations** | Normalized Relational Entity | PostgreSQL `recommendation_items` | Immutable per scan | Individual actionable ritual cards linked via foreign keys to `knowledge_chunks`. | `TARGET` |
| **Active Routine** | Mutable Relational Entity | PostgreSQL `routines` table | Mutable (`is_active`) | User's active morning/evening Dinacharya ritual plan. | `TARGET` |
| **Routine Ritual Items**| Relational Entity | PostgreSQL `routine_items` table | Mutable | Individual steps within an active routine (timing, frequency, instructions). | `TARGET` |
| **Adherence Logs** | High-Frequency Event Entity | PostgreSQL `routine_tracking` table | Append-only event | Daily completion checkbox events indexed by user and date for progress tracking. | `TARGET` |
| **Progress Checkpoints**| Analytical Snapshot Entity | PostgreSQL `progress_checkpoints` | Immutable snapshot | Day 1/7/14/30/60/90 historical deltas precomputed to support sub-100ms dashboards. | `TARGET` |
| **Voice Audio Stream** | Ephemeral Hardware State | Browser Web Speech Memory | Zero persistence | Audio processed locally by browser speech engine; zero audio uploaded to server. | `TARGET` |
| **Voice Chat Messages**| Minimal Relational Entity | PostgreSQL `chat_messages` table | Append-only text | Optional textual query logging for chat history; excludes raw audio. | `TARGET` |
| **PDF Report Asset** | Ephemeral Object Storage | Private S3 Bucket (`reports/`) | Ephemeral (7-day lifecycle) | Pre-compiled PDF files cached temporarily; permanently recomputable from DB data. | `TARGET / PROPOSED` |
| **Shared Report Token** | Cryptographic Relational Entity | PostgreSQL `shared_reports` table | Mutable (`is_revoked`) | 256-bit entropy token hash, expiration timestamp, and access view counter. | `TARGET / PROPOSED` |
| **Classical Sources** | Static Relational Entity | PostgreSQL `knowledge_sources` | Rare update | Compendium catalog (*Charaka*, *Sushruta*, *Ashtanga Hridaya*, *Bhavaprakasha*). | `TARGET` |
| **Classical Chunks** | Versioned Relational Entity | PostgreSQL `knowledge_chunks` | Immutable version rows | Vetted 400–600 token shloka chunks with Sanskrit, English, and Hindi translations. | `TARGET` |
| **Vector Embeddings** | Vector Extension Data | `knowledge_chunks.embedding` (pgvector) | Re-computable vector | 1536-dimensional float array indexed via HNSW for cosine similarity search. | `TARGET` |
| **Research Subjects** | De-Identified Relational Entity| PostgreSQL `research.research_subjects`| Post-MVP Immutable | De-identified participant cohort records stripped of all personal identifiers. | `TARGET / POST-MVP` |
| **Expert Annotations** | Double-Blind Relational Entity| PostgreSQL `research.expert_annotations`| Locked upon submission | Independent practitioner ratings (Vata/Pitta/Kapha percentages) per masked ROI. | `TARGET / POST-MVP` |
| **Consensus Labels** | Analytical Relational Entity | PostgreSQL `research.consensus_labels` | Immutable benchmark | Adjudicated expert-consensus reference labels with calculated Fleiss' Kappa score. | `TARGET / POST-MVP` |
| **Security Audit Logs** | Immutable WORM Event Entity | PostgreSQL `security_audit_events` | Append-only WORM | Audit trail of auth events, RLS blocks, admin actions, and account deletions. | `TARGET / PROPOSED (REQUIRES VALIDATION)` |
| **Deletion Tombstones** | Anonymous Relational Entity | PostgreSQL `deletion_tombstones` | Permanent tombstone | SHA-256 tenant hash and purge timestamp for post-disaster-recovery reconciliation. | `TARGET` |

