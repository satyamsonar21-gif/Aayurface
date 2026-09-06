# ADR-API-009: Asynchronous PDF Report Compilation & Ephemeral Storage

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Context:**  
Rendering multi-page, high-fidelity PDF wellness reports requires headless browser execution taking 2 to 4 seconds, exceeding standard synchronous API budgets.

**Decision:**  
Report generation is decoupled into an asynchronous worker workflow (`POST /api/v1/reports/compile` returning `202 Accepted`). Compiled PDF binaries are stored in an ephemeral S3 bucket with a 7-day lifecycle rule, and clients download reports via short-lived HMAC signed GET URLs (60-second TTL).

**Consequences:**  
* Prevents API gateway thread blocking during headless PDF rendering.
* Minimizes long-term S3 storage costs through automatic 7-day bucket lifecycle purge rules.

**Truth Status:** `TARGET ARCHITECTURE / PROPOSED (REQUIRES IMPLEMENTATION)`
