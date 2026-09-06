# ADR-API-004: Mutation Idempotency via IETF Idempotency-Key

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Context:**  
Mobile network drops, user retries, and rapid double-clicks can cause duplicate analysis dispatch or double habit logging, causing wasted AI compute costs and corrupted data.

**Decision:**  
We mandate the `Idempotency-Key` HTTP header for critical mutation endpoints (`POST /api/v1/analyses`, `POST /api/v1/reports/compile`, `POST /api/v1/routines/items/:id/track`). The gateway caches execution states and returns cached responses with `Idempotent-Replay: true` for duplicates within a 120-second TTL.

**Consequences:**  
* Protects AI infrastructure from duplicate billing and parallel execution.
* Requires caching layer (Redis / PostgreSQL Key-Value) with atomic insert-or-check semantics.

**Truth Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`
