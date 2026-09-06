# ADR-API-001: API Architectural Style & Communication Paradigm

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Context:**  
AayurFace requires an API architecture supporting web SPA clients, mobile applications, high-concurrency relational data transactions, and multi-stage asynchronous AI/CV pipelines while maintaining strict resource-level security and low operational overhead.

**Decision:**  
We adopt a **Resource-Oriented RESTful JSON Architecture over HTTPS** complemented by an **Asynchronous Job Polling Protocol (`202 Accepted`)** deployed as a **Modular Monolith on Serverless Edge Infrastructure (Deno / Supabase Edge Functions)**.

**Consequences:**  
* Simplifies edge gateway caching, standard HTTP status handling, and anti-BOLA authorization enforcement.
* Eliminates GraphQL query complexity analysis, N+1 query tuning, and dedicated gateway server maintenance.
* Requires formal OpenAPI 3.1 / Zod contract generation for TypeScript client typing.

**Truth Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`
