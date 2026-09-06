# ADR-API-008: Sliding-Window Rate Limiting & Denial-of-Wallet Defenses

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Context:**  
Generative AI endpoints and image upload workflows incur material cloud compute and API billing costs. Uncontrolled API traffic can result in Denial-of-Wallet exhaustion.

**Decision:**  
We implement a multi-tier sliding-window rate limiting architecture at the Edge Gateway. Specifically, expensive AI analysis orchestration (`POST /api/v1/analyses`) is capped at **5 requests / user / hour** (classified as `PROPOSED POLICY (REQUIRES PRODUCTION BENCHMARKING)`).

**Consequences:**  
* Caps maximum LLM provider cost exposure per active user.
* Standard `X-RateLimit-*` and `Retry-After` headers inform client interfaces of remaining quota.

**Truth Status:** `PROPOSED POLICY / TARGET ARCHITECTURE (REQUIRES BENCHMARKING)`
