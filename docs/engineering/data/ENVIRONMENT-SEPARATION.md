# AayurFace — Database Architecture Specification
## Multi-Environment Data Isolation & Credential Boundaries

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Data Security Architect, Platform/SRE Architect  

---

### 1. Environment Architecture & Isolation Matrix

AayurFace operates across four isolated environments with absolute physical data and credential boundaries:

| Environment | Purpose & Infrastructure | Data Populated | S3 Storage Bucket | Cross-Contamination Defenses |
|---|---|---|---|---|
| **Local Development** | Local developers running `supabase start` in Docker on developer workstations. | Synthetic mock users (`dev-user-1`), synthetic captures, seeded classical literature. | Local MinIO container (`facial-captures-local`). | Zero access to staging or production credentials; all network calls loopback. |
| **Testing / CI/CD** | Automated GitHub Actions runners executing Vitest unit/integration suites. | Ephemeral test fixtures; generated and wiped dynamically on every test run. | Ephemeral mock S3 in-memory bucket. | Disposable Docker containers; database reset on every commit. |
| **Staging** | Pre-production validation and performance benchmarking on Supabase Cloud. | Anonymized synthetic datasets; internal test accounts for QA engineers. | Dedicated staging bucket (`aayurface-staging-facial-captures`). | Completely separate Supabase project; independent KMS encryption keys; staging tokens cannot decrypt prod. |
| **Production** | Live consumer-facing application serving registered users. | Real consumer profiles, captures, and health assessments. | Dedicated production bucket (`aayurface-prod-facial-captures`). | Dedicated production project; access restricted to automated CI/CD service roles and MFA-enforced SREs. |

---

### 2. Invariant Rules Against Data Contamination

> [!CRITICAL]
> **Production Data Contamination Invariants**  
> 1. **ZERO PRODUCTION CLONES IN LOWER ENVIRONMENTS:** Production database dumps or customer facial captures shall **NEVER** be copied, restored, or downloaded into local dev, CI/CD, or staging environments.  
> 2. **ISOLATED CREDENTIAL VAULTS:** Supabase service-role keys, database passwords, and AWS KMS keys are strictly unique per environment and managed via Doppler/AWS Secrets Manager. A credential leak in staging has zero cryptographic authority in production.
