# AayurFace — Security Architecture Specification
## Data Classification & Handling Architecture

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Privacy Officer, Security Architect, Principal Data Architect  
**Legal Notice:** Where classifications intersect with statutory data definitions (e.g., DPDP Act 2023, GDPR Article 9), labels are designated as **REQUIRES LEGAL REVIEW**.  

---

### 1. Data Classification Tiers

AayurFace establishes five distinct data sensitivity tiers to govern transmission, storage, encryption, and logging:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ TIER 5: HIGHLY SENSITIVE                                                    │
│ • Raw Biometric Facial Imagery (`facial-captures/`)                         │
│ • Database Password Hashes (bcrypt/Argon2)                                  │
│ • Supabase Service-Role Keys, OpenAI API Keys, Storage HMAC Secrets         │
│ Controls: Client RAM minimization, signed URLs, zero public reads, NO LOGS. │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────┴──────────────────────────────────────┐
│ TIER 4: SENSITIVE PERSONAL & WELLNESS DATA                                  │
│ • Derived Visual Observations Vector (CIELAB a*, GLCM, Melanin indices)     │
│ • 15-Question Constitutional Intake Responses & Dominant Dosha Scores        │
│ • Lifestyle Context (Sleep, stress, hydration, climate ratings)             │
│ • Analysis Result Snapshots (`scan_results`) & Longitudinal Histories        │
│ • User Profile (Name, age bracket, email) & Consent Records                 │
│ Controls: Mandatory PostgreSQL RLS, TLS 1.3 transit, automated PII scrubber.│
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────┴──────────────────────────────────────┐
│ TIER 3: CONFIDENTIAL BUSINESS & RESEARCH DATA                               │
│ • Double-blind expert practitioner annotations & consensus ratings           │
│ • System prompts, proprietary heuristic rules, and weighting matrices        │
│ • Security audit trails & administrative event logs                         │
│ Controls: RBAC access control, admin MFA, write-once audit vaults.           │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────┴──────────────────────────────────────┐
│ TIER 2: INTERNAL OPERATIONAL DATA                                            │
│ • Daily routine schedules & habit adherence checkboxes                      │
│ • Capture gateway technical quality metrics (luma, blur variance, aspect)    │
│ • Anonymized performance telemetry & APM error traces                       │
│ Controls: Standard authenticated access, internal correlation IDs.          │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────┴──────────────────────────────────────┐
│ TIER 1: PUBLIC / VETTED DOMAIN DATA                                         │
│ • Classical Ayurvedic verses & compendium chunks (`knowledge_chunks`)       │
│ • Public marketing landing page assets & brand documentation                 │
│ • Terms of Service, Privacy Policy, and non-diagnostic disclaimers           │
│ Controls: Public read access, CDN caching, integrity hash verification.     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Detailed Data Classification & Handling Matrix

| Data Category | Classification Tier | Legal Jurisdiction Classification | Storage Location | In-Transit Encryption | At-Rest Encryption | Logging Policy | Permitted Data Processors |
|---|---|---|---|---|---|---|---|
| **Raw Facial Image** | **HIGHLY SENSITIVE** | Biometric Personal Data (*REQUIRES LEGAL REVIEW*) | Private S3 Bucket (`facial-captures`) | TLS 1.3 | AES-256 (Server-Side S3) | **STRICTLY PROHIBITED** (Zero Base64 in logs) | Browser WebAssembly, Serverless Feature Extractor |
| **Password Hash** | **HIGHLY SENSITIVE** | Security Credential | `auth.users.encrypted_password` | TLS 1.3 | PostgreSQL Table Encryption | **STRICTLY PROHIBITED** | Supabase Auth Engine |
| **Platform Secrets** | **HIGHLY SENSITIVE** | Cryptographic Secret | Cloud Environment Secret Vaults | TLS 1.3 | Cloud KMS Encryption | **STRICTLY PROHIBITED** | Serverless Edge Runtimes (Deno) |
| **Visual Observations** | **SENSITIVE** | Derived Health/Biometric (*REQUIRES LEGAL REVIEW*) | `scan_results` (Postgres) | TLS 1.3 | PostgreSQL Table Encryption | Numerical vectors permitted; no raw images | Analysis Orchestrator, Fusion Engine |
| **Questionnaire Answers** | **SENSITIVE** | Health/Wellness Personal Data | `questionnaire_responses` | TLS 1.3 | PostgreSQL Table Encryption | Redacted; log question ID and score only | Scoring Service, Ayurvedic Engine |
| **Lifestyle Data** | **SENSITIVE** | Personal Wellness Context | `lifestyle_contexts` | TLS 1.3 | PostgreSQL Table Encryption | Redacted; log normalized vector | Lifestyle Scorer, Multimodal Fusion |
| **Analysis Results** | **SENSITIVE** | Personal Wellness Assessment | `scan_results` | TLS 1.3 | PostgreSQL Table Encryption | Log scan UUID & dosha score only | Presentation Layer, PDF Exporter |
| **User Profile (PII)** | **SENSITIVE** | Personally Identifiable Information (PII) | `profiles` | TLS 1.3 | PostgreSQL Table Encryption | Masked (e.g., `u***@domain.com`) | Profile Service, Auth Context |
| **Consent Records** | **SENSITIVE** | Legal / Compliance Audit Proof | `consents` | TLS 1.3 | PostgreSQL Table Encryption | Safe to log consent ID, scopes, and hash | Consent Service, Compliance Audit |
| **Research Datasets** | **CONFIDENTIAL** | Pseudonymized Research Data (*REQUIRES LEGAL REVIEW*) | `research_subjects`, `expert_annotations` | TLS 1.3 | PostgreSQL Table Encryption | Anonymized Subject UUID only | Approved Ayurvedic Researchers |
| **System Prompts** | **CONFIDENTIAL** | Proprietary Intellectual Property | Edge Function Code Repository | TLS 1.3 | Encrypted Code Vault | Redacted in production logs | AI Orchestration Service |
| **Security Audit Logs** | **CONFIDENTIAL** | Security Telemetry | Dedicated Security WORM Vault | TLS 1.3 | Encrypted Log Bucket | Fully structured audit events | Security Engineers, Incident Responders |
| **Routine Adherence** | **INTERNAL** | Behavioral Tracking Data | `routine_tracking` | TLS 1.3 | Standard DB Encryption | Safe for APM telemetry | Routine Service, Progress Analytics |
| **Classical Texts (RAG)** | **PUBLIC** | Public Domain Literature | `knowledge_chunks` | TLS 1.3 | Standard DB Encryption | Fully readable & loggable | RAG Retrieval Service, Public Search |
