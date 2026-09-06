# ADR-API-010: Cryptographic Capability Tokens for Public Report Sharing

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Context:**  
Users wish to share their Ayurvedic assessment results with family members or external wellness practitioners without requiring the recipient to create an account, while preventing unauthorized link discovery.

**Decision:**  
We implement a **Capability-Based Sharing Protocol** utilizing 256-bit cryptographically secure random tokens (`shr_...`). Only the SHA-256 hash of the token is persisted in `shared_reports`. Resolving the token serves a strictly redacted view (zero PII, zero facial pixels).

**Consequences:**  
* 256-bit entropy makes brute-force discovery mathematically impossible ($2^{256}$ search space).
* Storing only `token_hash` in the database ensures that a database compromise does not expose usable share links.
* Users can instantly revoke links via `DELETE /api/v1/shares/:id`.

**Truth Status:** `TARGET ARCHITECTURE / PROPOSED (REQUIRES IMPLEMENTATION)`
