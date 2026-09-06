# AayurFace — Security Architecture Specification
## Comprehensive Security Asset Inventory

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Data Architect, Security Architect, Privacy Officer  

---

### 1. Asset Classification Framework

Every data asset and system artifact processed within AayurFace is classified by sensitivity, ownership, storage boundaries, retention, and threat profile:

| Asset ID | Asset Name | Description | Sensitivity | Owner | Storage Location | Purpose | Retention Status | Deletion Trigger | Logging Rule | Primary Threats |
|---|---|---|---|---|---|---|---|---|---|---|
| **AST-ID-01** | User Email Address | Primary login credential & contact identity. | Confidential | User | `auth.users`, `profiles.email` | Account identity, recovery, communications. | Active account life. | Account deletion. | Masked/Hashed only. | Credential stuffing, account takeover, phishing. |
| **AST-ID-02** | Password Hash | Bcrypt/Argon2 one-way hash of user password. | Highly Sensitive | System | `auth.users.encrypted_password` | Cryptographic authentication. | Active account life. | Account deletion. | STRICTLY FORBIDDEN. | Offline hash cracking, credential exposure. |
| **AST-ID-03** | Access Token (JWT) | Short-lived RS256 token (sub=userId, role). | Confidential | User | Client RAM / Ephemeral headers | API authorization. | 60 minutes TTL. | Token expiration / logout. | Masked token signature. | Session hijacking, XSS token theft. |
| **AST-ID-04** | Refresh Token | Opaque single-use token for rotating JWTs. | Highly Sensitive | User / System | `auth.refresh_tokens` | Secure session renewal. | 30 days rolling. | Logout, token reuse, deletion. | STRICTLY FORBIDDEN. | Replay attack, long-term unauthorized access. |
| **AST-PR-01** | User Profile Data | Full name, age bracket, language, skin goals. | Sensitive | User | `profiles` table | Personalization & UX display. | Active account life. | Account deletion. | Safe to log ID, not raw PII. | Profile tampering, mass scraping. |
| **AST-PR-02** | User Consent Record | Unbundled audit trail of granted scopes & hash. | Sensitive | User / System | `consents` table | Legal/regulatory audit proof. | Permanent audit tombstone. | Tombstoned upon deletion. | Log consent ID & version. | Repudiation, unauthorized data processing. |
| **AST-WL-01** | 15-Q Intake Answers | Constitutional questionnaire selections. | Sensitive | User | `questionnaire_responses` | Prakriti/Vikriti baseline determination. | Active account life. | Account deletion. | Log vector score, not answers. | Profiling, unauthorized wellness inference. |
| **AST-WL-02** | Lifestyle Context | Sleep, stress, climate, hydration ratings. | Sensitive | User | `lifestyle_contexts` | Multimodal lifestyle vector calculation. | Active account life. | Account deletion. | Redact detailed wellness notes. | Context manipulation, false confidence. |
| **AST-WL-03** | Daily Routines | Morning/Evening Dinacharya ritual items. | Internal | User | `routines` table | User wellness guidance & tracking. | Active account life. | Account deletion. | Non-sensitive. | Unauthorized schedule tampering. |
| **AST-WL-04** | Routine Adherence | Checkbox logs of completed daily rituals. | Internal | User | `routine_tracking` | Longitudinal habit consistency calculation. | Active account life. | Account deletion. | Non-sensitive. | Adherence metric spoofing. |
| **AST-VS-01** | Raw Facial Capture | Single high-resolution JPEG facial photo. | Highly Sensitive | User | Private S3 (`facial-captures/`) | Biometric feature extraction. | OPEN DECISION (DEC-004: Purge vs 30d). | Post-extraction or deletion. | STRICTLY FORBIDDEN. | Biometric identity theft, unauthorized facial access. |
| **AST-VS-02** | Visual Observations | Derived numerical vector (a*, GLCM, Melanin). | Sensitive | User | `scan_results.visual_observations` | Quantitative signal analysis & fusion. | Active account life. | Account deletion. | Numerical vector safe to log. | Algorithmic re-identification. |
| **AST-VS-03** | Quality Metrics | Lighting score, blur variance, centering delta. | Internal | System | `captures.quality_metrics` | Capture gateway audit & calibration. | 90 days. | Expiration / deletion. | Safe to log metrics. | Denial-of-service gateway bypass. |
| **AST-AI-01** | Master System Prompt | Core system prompt & Ayurvedic safety guards. | Confidential | Engineering | Serverless Edge Function Code | Enforces persona, safety, and disclaimers. | Static code lifecycle. | Code refactoring. | Redact proprietary instructions. | Prompt leakage, jailbreak exploitation. |
| **AST-AI-02** | Analysis Result Record | Immutable JSON analysis result & recommendations. | Sensitive | User | `scan_results` table | Historical display, progress tracking, export. | Active account life. | Account deletion. | Log scan UUID and dosha scores. | BOLA/IDOR cross-user data leakage. |
| **AST-AI-03** | Classical Verses (RAG) | Curated Ayurvedic compendium chunks & verses. | Public / Vetted | Public Domain | `knowledge_chunks` table | Grounded generative herbal synthesis. | Permanent knowledge base. | Manual admin removal. | Public citations safe to log. | Knowledge base poisoning, fake citations. |
| **AST-RS-01** | Research Subject Record | De-identified subject profile & Fitzpatrick tone. | Sensitive | Research Subject | `research_subjects` table | Double-blind algorithmic calibration. | Research lifecycle. | Subject withdrawal. | Anonymized research ID only. | Re-identification of research participants. |
| **AST-RS-02** | Expert Annotations | Independent Ayurvedic practitioner assessments. | Confidential | Expert / System | `expert_annotations` table | Ground truth reference & Fleiss' Kappa. | Permanent research record. | Non-deletable benchmark. | Log annotator ID & agreement. | Expert label poisoning, tampering. |
| **AST-SC-01** | Supabase Service Key | Superuser administrative database secret. | Highly Sensitive | Platform | Serverless Environment Vault | Administrative background worker tasks. | Rotated every 90 days. | Revocation on breach. | STRICTLY FORBIDDEN. | Complete database compromise (RLS bypass). |
| **AST-SC-02** | OpenAI API Key | Cloud generative AI inference credential. | Highly Sensitive | Organization | Serverless Environment Vault | Foundation model inference & embedding. | Rotated every 90 days. | Revocation on breach. | STRICTLY FORBIDDEN. | Denial-of-wallet, unauthorized AI usage. |
| **AST-SC-03** | Storage Signing Secret | HMAC key for generating S3 signed URLs. | Highly Sensitive | Platform | Supabase Storage Service Vault | Ephemeral S3 upload/download gating. | Rotated periodically. | Revocation on breach. | STRICTLY FORBIDDEN. | Unauthorized public S3 read/write access. |
| **AST-OP-01** | Structured App Logs | JSON application telemetry and tracing events. | Internal | Platform | Observability Service Sink | Operational debugging & performance analysis. | 30 days rolling. | Automated retention purge. | Automated PII/Biometric Redaction. | Accidental PII leakage in logs. |
| **AST-OP-02** | Security Audit Trail | Immutable log of auth, RLS denials, deletions. | Confidential | Security Team | Dedicated WORM Audit Vault | Forensic breach investigation & compliance. | 1 year minimum. | WORM retention policy. | Redact passwords & tokens. | Audit tampering, log suppression. |
| **AST-OP-03** | Database Backups | Point-in-time snapshots of PostgreSQL database. | Highly Sensitive | Platform | Encrypted Cold Storage | Disaster recovery & business continuity. | 30 days rolling. | Rolling backup expiration. | STRICTLY FORBIDDEN. | Backup theft, unencrypted cold storage leak. |
