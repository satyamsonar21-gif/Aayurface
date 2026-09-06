# Architecture Decision Record: ADR-005
## Object Storage Strategy: Private S3-Compatible Storage with Ephemeral Signed URLs

**Status:** ACCEPTED WITH OPEN DECISION (DEC-004)  
**Date:** 2026-09-03  
**Deciders:** Security & Privacy Architect, Staff Backend Architect  
**Technical Area:** Unstructured Biometric & Artifact Storage  

---

### 1. Context
AayurFace processes captured user facial imagery and generates downloadable PDF wellness reports. Facial images constitute sensitive biometric personal data under the Indian DPDP Act 2023 and GDPR Art. 9.

### 2. Problem
Architecting an object storage pipeline that completely prevents unauthorized public access, eliminates client-side token exposure, and supports automated retention purging.

### 3. Options Evaluated
* **Option A: Public S3 Bucket with Obfuscated UUIDs:** Fast, but catastrophic privacy violation; anyone with URL can view biometric selfies.
* **Option B: Private S3-Compatible Bucket with Ephemeral HMAC-Signed URLs (Selected):** Zero public reads; short-lived signed URLs (15m TTL) issued only to authenticated users.
* **Option C: Base64 String Storage directly in PostgreSQL:** High database bloat, poor performance, high backup costs.

### 4. Decision
Adopt **Option B: Private S3-Compatible Bucket with Ephemeral HMAC-Signed URLs**.
Facial captures are stored in a private Supabase Storage bucket (`facial-captures`). Clients obtain single-use signed PUT URLs via authenticated Edge Functions with a proposed 15-minute Time-To-Live (TTL) security policy. Raw image retention remains subject to Open Decision DEC-004 (Immediate purge vs 30 days).

### 5. Rationale
* **Zero Public Exposure:** Public reads are disabled at the storage layer. Direct URL queries return HTTP 403 Forbidden.
* **Client-Direct Upload:** Clients upload images directly to storage, avoiding serverless compute memory bottlenecks.
* **Biometric Minimization:** Decouples raw image storage from relational metadata, enabling clean hard-purges of raw imagery while retaining derived numerical vectors.

### 6. Consequences
* *Positive:* Privacy architecture is designed to support applicable data-protection obligations (including DPDP Act 2023 principles; formal legal/compliance review required), minimal server load, strict access control.
* *Negative:* Requires an extra API roundtrip to obtain signed upload URLs prior to frame transmission.

### 7. Risks & Mitigations
* *Risk:* Orphaned uploaded files accumulate if analysis orchestration fails.
* *Mitigation:* Storage lifecycle policy automatically deletes unreferenced files older than 24 hours.

### 8. Evidence
Supabase Storage API provides built-in `createSignedUploadUrl` and `createSignedUrl` with millisecond TTL enforcement.

### 9. Revisit Conditions
Revisit when the Privacy Officer finalizes the biometric retention policy (DEC-004).
