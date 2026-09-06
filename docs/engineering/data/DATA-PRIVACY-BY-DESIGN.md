# AayurFace — Database Architecture Specification
## Privacy by Design Architecture & Statutory Rights Technical Implementation

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Privacy Officer, Data Security Architect, Principal Database Architect  
**Statutory Compliance Notice:** Technical mechanisms designed to align with principles of the Indian Digital Personal Data Protection (DPDP) Act 2023 and GDPR Article 9; **ALL STATUTORY INTERPRETATIONS REQUIRE FORMAL LEGAL REVIEW**.  

---

### 1. Privacy by Design Core Technical Pillars

| Privacy Pillar | Technical Database & Storage Implementation | Statutory Alignment (*LEGAL REVIEW*) |
|---|---|---|
| **Data Minimization** | Camera stream processed in client RAM; 100% EXIF stripped; relational tables store derived numerical floats (`VisualObservations`), never raw pixel matrices. | DPDP Act Sec. 6 / GDPR Art. 5(1)(c) |
| **Purpose Limitation** | Biometric and wellness data accessed strictly for generating user-requested Ayurvedic guidance; prohibited from secondary unconsented ad-targeting. | DPDP Act Sec. 4 / GDPR Art. 5(1)(b) |
| **Storage Limitation** | Ephemeral pre-signed URLs (15m TTL); raw facial imagery subjected to immediate post-extraction purge or 30-day automated rolling lifecycle deletion (DEC-004). | DPDP Act Sec. 8(7) / GDPR Art. 5(1)(e) |
| **Integrity & Confidentiality**| Kernel Row-Level Security, AES-256 rest encryption, TLS 1.3 transit, WORM audit logging. | DPDP Act Sec. 8(5) / GDPR Art. 5(1)(f) |

---

### 2. Technical Implementation of User Statutory Rights

```text
1. RIGHT TO ACCESS (Data Portability)
Endpoint: GET /api/v1/profile/export
Database Action: Serializes user records across `profiles`, `questionnaire_responses`,
`lifestyle_contexts`, `scan_results`, `routines`, and `routine_tracking` into an
encrypted, downloadable JSON archive within 60 seconds.

2. RIGHT TO RECTIFICATION (Correction)
Endpoint: PUT /api/v1/profile
Database Action: Allows user to update mutable fields (`full_name`, `age_bracket`, `gender`).
Immutable historical analysis records are preserved to prevent retrospective data falsification.

3. RIGHT TO ERASURE (Account Deletion & Obliteration)
Endpoint: DELETE /api/v1/profile/account (Requires re-authentication)
Database Action:
  Step 1: Sets profile status to 'PENDING_DELETION'; revokes active JWTs.
  Step 2: Hard-deletes S3 objects under `facial-captures/{userId}/*` and `reports/{userId}/*`.
  Step 3: Executes cascading SQL purge: `DELETE FROM auth.users WHERE id = :userId`.
  Step 4: Records anonymous SHA-256 tombstone in `deletion_tombstones`.

4. RIGHT TO REVOKE CONSENT
Endpoint: POST /api/v1/consents (Payload: { scope: 'research_sharing', status: 'REVOKED' })
Database Action: Appends revocation record to `consents`; immediate trigger purges user
from any pending un-anonymized research staging queues.
```
