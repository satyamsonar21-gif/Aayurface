# Architecture Decision Record: ADR-011
## Asynchronous Processing: Idempotent Analysis Pipeline with Realtime State Streaming

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Deciders:** Staff Backend Architect, Platform/SRE Architect, Staff Frontend Architect  
**Technical Area:** Pipeline Execution & State Coordination  

---

### 1. Context
An end-to-end multimodal analysis involves image download, signal calculation, vector retrieval, and generative reasoning, which collectively require 8 to 25 seconds. Supabase Edge Functions enforce a 45-second execution timeout, and mobile network drops frequently interrupt long synchronous HTTP connections.

### 2. Problem
Preventing dropped connections, eliminating duplicate billable LLM calls on mobile retries, and providing real-time pipeline visibility to the user without polling storms.

### 3. Options Evaluated
* **Option A: Synchronous HTTP Request/Response:** Hold the browser HTTP connection open for 25 seconds until the full JSON response is returned.
* **Option B: Heavy Background Job Queue (Redis + BullMQ + Node Workers):** Provision a dedicated Redis instance and worker pool.
* **Option C: Asynchronous Serverless Dispatch with Supabase Realtime & Idempotency (Selected):** Dispatch job asynchronously; return `202 Accepted` with `analysisId`; stream pipeline stage updates over Supabase Realtime; enforce `Idempotency-Key`.

### 4. Decision
Adopt **Option C: Asynchronous Serverless Dispatch with Supabase Realtime & Idempotency**.
1. Client submits analysis request with an `Idempotency-Key` header (UUIDv4) and receives `202 Accepted`.
2. Edge Function updates database state through discrete stages (`CV_EXTRACTION`, `FUSION_CALCULATION`, `KNOWLEDGE_RETRIEVAL`, `AI_SYNTHESIS`, `COMPLETED`).
3. PostgreSQL Change Data Capture streams status updates over WebSockets directly to the client.

### 5. Rationale
* **Zero Infrastructure Overhead:** Utilizes native Supabase PostgreSQL and Realtime without provisioning Redis clusters.
* **Network Resilience:** If the user’s mobile browser refreshes or loses connection, the job completes on the server. Upon reconnecting, the client fetches the completed result via `analysisId`.
* **Cost Protection:** Idempotency prevents users from double-clicking "Analyze" and triggering duplicate OpenAI inference charges.

### 6. Consequences
* *Positive:* Highly resilient across cellular networks, instant client acknowledgement, excellent UX feedback.
* *Negative:* Requires client to handle asynchronous status transitions instead of a simple `fetch()` promise.

### 7. Risks & Mitigations
* *Risk:* Mobile browser sleep terminates WebSocket connection during processing.
* *Mitigation:* Client automatically activates a 5-second polling fallback if the WebSocket disconnects for $\ge 8$ seconds.

### 8. Evidence
Phase 00 reconnaissance confirmed Supabase Realtime is enabled on the target database.

### 9. Revisit Conditions
Revisit if daily volume exceeds 50 concurrent analyses per second, requiring a dedicated Redis/Kafka message queue.
