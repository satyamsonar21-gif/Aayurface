# AayurFace — Database Architecture Specification
## Database Security Mapping, STRIDE Mitigations & Phase 03 Alignment

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Data Security Architect  

---

### 1. Mapping Database Mechanisms to STRIDE Threats

Every database architectural mechanism directly mitigates specific threats identified in the Phase 03 Threat Model:

| STRIDE Threat Category | Identified Threat Scenario | Target Database Security Control | Implementation Mechanism |
|---|---|---|---|
| **Spoofing** | Attacker impersonates legitimate user to insert or read records. | Server-side identity extraction from cryptographically verified RS256 JWT claim `auth.uid()`. | Database connection sets `request.jwt.claim.sub`; RLS evaluates kernel identity. |
| **Tampering** | Rogue actor alters historical scan results or audit logs. | Strict table immutability rules; append-only design. | PostgreSQL rules block `UPDATE`/`DELETE` on `security_audit_events`; RLS blocks `UPDATE` on `scan_results`. |
| **Repudiation** | User denies granting consent; admin denies modifying system weights. | Tamper-evident append-only ledger with cryptographic client metadata hashes. | `consents` and `security_audit_events` tables record immutable actor and timestamp proofs. |
| **Information Disclosure** | Broken Object Level Authorization (BOLA) exposing another user's biometric records. | PostgreSQL kernel-level Row-Level Security (RLS) on 100% of user-owned tables. | Queries filter via `USING (auth.uid() = user_id)`; returns empty set (HTTP 404), zero information leaked. |
| **Denial of Service** | Attacker floods database with duplicate multi-megabyte analysis jobs. | Database UNIQUE constraints, rate limiting, and 5 MB file size checks. | `UNIQUE (user_id, idempotency_key)` on `analysis_jobs`; `CHECK (file_size_bytes <= 5242880)` on `captures`. |
| **Elevation of Privilege**| Standard authenticated user updates `profiles.role` to `'admin'`. | Column-restricted RLS UPDATE policies and database triggers. | RLS policy explicitly forbids standard users from modifying `role` or `is_verified`. |

---

### 2. Physical Storage & Encryption Mapping

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. DATA IN TRANSIT: TLS 1.3 Strict                                          │
│ Enforced on all Supabase Edge Functions, REST endpoints, and DB connections.│
│ HSTS configured with max-age=31536000; includeSubDomains; preload.          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. DATA AT REST (PostgreSQL Relational Storage): AES-256                    │
│ Transparent Data Encryption (TDE) at the block/volume layer in AWS/Supabase. │
│ Point-in-time recovery backup snapshots encrypted via AWS KMS keys.         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. BIOMETRIC OBJECT STORAGE (Private S3 Bucket `facial-captures`):          │
│ Server-Side Encryption with Customer-Managed Keys (SSE-KMS).                │
│ Bucket configured with zero public IP reads; direct access blocked 100%.    │
└─────────────────────────────────────────────────────────────────────────────┘
```
