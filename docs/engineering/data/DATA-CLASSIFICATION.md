# AayurFace — Database Architecture Specification
## Database Data Classification & Table Sensitivity Matrix

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Data Security Architect, Privacy Officer  
**Legal Notice:** Classifications intersecting with statutory definitions (DPDP Act 2023 / GDPR Article 9) are designated **REQUIRES LEGAL REVIEW**.  

---

### 1. Database Sensitivity Tiers

Data stored across AayurFace tables and object stores is partitioned into five distinct sensitivity tiers:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ TIER 5: HIGHLY SENSITIVE DATA                                               │
│ • Private S3 Bucket (`facial-captures/`): Raw facial photos                 │
│ • Supabase Auth (`auth.users`): Encrypted password hashes                   │
│ • Security Secrets: API keys, signing keys, service-role tokens             │
│ Controls: Client RAM minimization, signed URLs, zero public reads, NO LOGS. │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────┴──────────────────────────────────────┐
│ TIER 4: SENSITIVE PERSONAL & HEALTH/WELLNESS DATA                           │
│ • `profiles`: Full name, email, age bracket, gender                         │
│ • `consents`: Granted scopes, timestamps, policy versions                   │
│ • `questionnaire_responses`: 15-question intake answers & dosha scores      │
│ • `lifestyle_contexts`: Sleep, stress, climate, hydration ratings           │
│ • `captures`: Object storage paths, file sizes, checksums                   │
│ • `scan_results`: Dominant doshas, calibrated confidence, versions          │
│ • `visual_observations`: Derived numerical features (a*, GLCM, Melanin)    │
│ • `multimodal_fusions`: Modality vectors, harmonic agreement index A        │
│ • `recommendation_items`: Tailored Ayurvedic rituals and herbal suggestions │
│ • `progress_checkpoints`: 30/60/90-day progress and symptom deltas          │
│ Controls: Mandatory PostgreSQL kernel RLS, TLS 1.3 transit, automated PII   │
│           redaction in application loggers.                                 │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────┴──────────────────────────────────────┐
│ TIER 3: CONFIDENTIAL BUSINESS & RESEARCH DATA                               │
│ • `fusion_configurations`: Proprietary algorithm weights and thresholds    │
│ • `research_subjects`: De-identified participant cohorts                    │
│ • `expert_annotations`: Double-blind Ayurvedic practitioner ratings         │
│ • `consensus_labels`: Adjudicated ground-truth reference benchmarks         │
│ • `security_audit_events`: Immutable WORM security event logs               │
│ Controls: Strict RBAC, admin MFA, dedicated research schema isolation.     │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────┴──────────────────────────────────────┐
│ TIER 2: INTERNAL OPERATIONAL DATA                                            │
│ • `user_preferences`: Theme, language, notification preferences             │
│ • `capture_quality_metrics`: Luminance, blur variance, centering metrics    │
│ • `analysis_jobs`: Asynchronous queue state, retry counts, deadlines        │
│ • `routines` & `routine_items`: Active Dinacharya ritual schedules          │
│ • `routine_tracking`: Daily ritual adherence checkbox events                │
│ • `deletion_tombstones`: Anonymous hashes of purged accounts                │
│ Controls: Standard authenticated RLS, internal correlation tracing.         │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────┴──────────────────────────────────────┐
│ TIER 1: PUBLIC / VETTED DOMAIN DATA                                         │
│ • `questionnaire_templates`: Canonical question sets & scoring options      │
│ • `knowledge_sources`: Master classical compendium catalog                  │
│ • `knowledge_documents`: Compendium sections and adhyayas                   │
│ • `knowledge_chunks`: Classical verses, translations, pgvector embeddings   │
│ • `remedies`: Public reference catalog of traditional formulations          │
│ • `shared_reports`: Public read-only snapshots governed by share tokens     │
│ Controls: Public read policies, edge CDN caching, integrity hash validation.│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Table-Level Classification & Logging Rules

| Entity / Table Name | Classification Tier | Primary Storage | At-Rest Encryption | Logging Restrictions | Statutory Classification (*LEGAL REVIEW*) |
|---|---|---|---|---|---|
| `facial-captures/` | **TIER 5: HIGHLY SENSITIVE** | Private S3 Bucket | AES-256 (S3-KMS) | **STRICTLY FORBIDDEN** (Zero base64/URLs) | Biometric Data (DPDP / GDPR Art. 9) |
| `auth.users` | **TIER 5: HIGHLY SENSITIVE** | Supabase Auth DB | PostgreSQL Crypt | **STRICTLY FORBIDDEN** (Zero passwords) | Authentication Credential |
| `profiles` | **TIER 4: SENSITIVE** | PostgreSQL Table | PostgreSQL Crypt | Mask email; zero PII logging | Personal Data / PII |
| `consents` | **TIER 4: SENSITIVE** | PostgreSQL Table | PostgreSQL Crypt | Safe to log ID, scope, version | Legal / Consent Audit Proof |
| `questionnaire_responses` | **TIER 4: SENSITIVE** | PostgreSQL Table | PostgreSQL Crypt | Log quiz score only; redact raw text | Health / Wellness Data |
| `lifestyle_contexts` | **TIER 4: SENSITIVE** | PostgreSQL Table | PostgreSQL Crypt | Log normalized vector; redact free text | Health / Wellness Context |
| `captures` | **TIER 4: SENSITIVE** | PostgreSQL Table | PostgreSQL Crypt | Log capture UUID; redact storage path | Biometric Metadata |
| `scan_results` | **TIER 4: SENSITIVE** | PostgreSQL Table | PostgreSQL Crypt | Log scan UUID and dominant dosha only | Wellness Assessment Result |
| `visual_observations` | **TIER 4: SENSITIVE** | PostgreSQL Table | PostgreSQL Crypt | Safe to log derived numerical scalars | Derived Biometric Vector |
| `multimodal_fusions` | **TIER 4: SENSITIVE** | PostgreSQL Table | PostgreSQL Crypt | Safe to log agreement index and scores | Algorithmic Fusion Output |
| `recommendation_items` | **TIER 4: SENSITIVE** | PostgreSQL Table | PostgreSQL Crypt | Log ritual IDs; redact custom notes | Wellness Guidance |
| `progress_checkpoints` | **TIER 4: SENSITIVE** | PostgreSQL Table | PostgreSQL Crypt | Safe to log interval and stability index | Longitudinal Health Trend |
| `fusion_configurations`| **TIER 3: CONFIDENTIAL** | PostgreSQL Table | Standard DB Enc. | Safe to log version string | Proprietary Intellectual Property |
| `research.*` Tables | **TIER 3: CONFIDENTIAL** | Dedicated Schema | PostgreSQL Crypt | Research UUID only; zero PII | Pseudonymized Research Data |
| `security_audit_events`| **TIER 3: CONFIDENTIAL** | PostgreSQL Table | PostgreSQL Crypt | Scrubbed structured telemetry only | Security Audit Trail |
| `routines` & Tracking | **TIER 2: INTERNAL** | PostgreSQL Table | Standard DB Enc. | Safe for APM monitoring | Habit Adherence Data |
| `analysis_jobs` | **TIER 2: INTERNAL** | PostgreSQL Table | Standard DB Enc. | Safe to log status and attempt count | Operational State Machine |
| `knowledge_*` Tables | **TIER 1: PUBLIC** | PostgreSQL Table | Standard DB Enc. | Fully loggable and readable | Public Domain Classical Literature |
| `shared_reports` | **TIER 1: SHARED** | PostgreSQL Table | Standard DB Enc. | Log share token ID and view count | Public Shared Wellness View |
