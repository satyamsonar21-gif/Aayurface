# Security Contract: API Privacy & Data Tiering Standard
## 7-Tier Data Classification, Transport Security & Erasure Policies

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Privacy & Data Protection  
**Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION & LEGAL REVIEW)`  
**Authority:** Privacy Officer, Data Security Architect, Legal Counsel  

---

## 1. The 7-Tier Data Privacy Classification

| Tier | Category | Example Fields & Entities | Transport Security | Storage Location & Encryption | Logging Policy | Retention & Erasure | Access Control |
|---|---|---|---|---|---|---|---|
| **Tier 1** | **Public Reference** | `remedies`, `knowledge_chunks` | TLS 1.3 | PostgreSQL (AES-256) | Allowed | Permanent | Public / Anonymous |
| **Tier 2** | **Account & Preferences**| `profiles.full_name`, `user_preferences` | TLS 1.3 | PostgreSQL (AES-256) | Masked PII | Active Lifespan; Purged on request | Owner Only (`auth.uid()`) |
| **Tier 3** | **Sensitive Wellness** | `scan_results`, `visual_observations`, `questionnaire_responses` | TLS 1.3 | PostgreSQL (AES-256) | Redacted | Active Lifespan; Hard deleted on request | Owner Only (`auth.uid()`) |
| **Tier 4** | **Biometric Assets** | `facial-captures/` in S3 | TLS 1.3 (Signed PUT) | Private S3 (AES-256 KMS) | Prohibited | Purged per DEC-004; Hard deleted on request | Ephemeral Signed URL (Owner/Worker) |
| **Tier 5** | **Auth & Security** | `auth.users`, `security_audit_events` | TLS 1.3 | Supabase Vault / PostgreSQL | Scrubbed IP | 365 days WORM; Detached on request | Security Admin Only |
| **Tier 6** | **Anonymous Governance**| `deletion_tombstones(tenant_hash)` | Internal TLS | PostgreSQL (AES-256) | Anonymous | Permanent Disaster Recovery Ledger | System Reconciler Only |
| **Tier 7** | **Research Cohort** | `research.research_subjects` | Internal TLS | Isolated Schema (`research.*`)| De-Identified | Permanent Benchmark (Post-MVP) | Certified Practitioners |
