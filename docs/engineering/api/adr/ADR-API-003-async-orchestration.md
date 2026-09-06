# ADR-API-003: Asynchronous Multi-Stage AI Job Orchestration

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Context:**  
Multimodal AI facial analysis, semantic vector retrieval, and LLM reasoning take between 3 and 8 seconds. Executing this synchronously within an HTTP request-response cycle causes mobile connection drops, gateway timeouts, and serverless thread starvation.

**Decision:**  
`POST /api/v1/analyses` executes as an asynchronous job returning `202 Accepted` with a tracking resource URL (`/api/v1/analyses/:id/status`). Job queueing and worker locking are managed directly in PostgreSQL via `analysis_jobs` using `FOR UPDATE SKIP LOCKED`.

**Consequences:**  
* Guaranteed sub-150ms HTTP response times on initial job submission.
* Eliminates heavy external message broker infrastructure (Kafka/RabbitMQ) for early production phases.
* Clients poll the lightweight status endpoint until completion.

**Truth Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`
