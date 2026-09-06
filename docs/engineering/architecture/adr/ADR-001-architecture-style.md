# Architecture Decision Record: ADR-001
## System Architecture Style: Modular Monolith with Serverless Orchestration

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Deciders:** Principal Software Architect, Staff Backend Architect, Staff Frontend Architect  
**Technical Area:** System Architecture Topology  

---

### 1. Context
AayurFace requires real-time camera-based image quality gating, complex multimodal data fusion, classical literature retrieval, and generative explainability. The repository currently exists as a single React/Vite single-page application and two unauthenticated Supabase Edge Functions.

### 2. Problem
Selecting an architectural topology that maximizes development velocity for a compact engineering team, ensures rigorous security and biometric isolation, and provides a low operational maintenance burden without introducing premature microservice operational overhead.

### 3. Options Evaluated
* **Option A: Traditional Monolith:** Single unified server managing web UI, API, CV processing, and database connections.
* **Option B: Modular Monolith Frontend with Serverless Asynchronous Orchestration (Selected):** Feature-sliced React SPA coupled with stateless Supabase Edge Functions and managed PostgreSQL.
* **Option C: Microservices Architecture:** Distributed independent microservices (Auth Service, Capture Service, CV Service, RAG Service, Recommendation Service) running in Kubernetes or container clusters.

### 4. Decision
Adopt **Option B: Modular Monolith Frontend with Serverless Asynchronous Orchestration**.
The frontend is structured as a modular single-page application with strict boundary encapsulation. Heavy, event-driven AI orchestration and data access logic are handled by stateless Supabase Edge Functions running on Deno.

### 5. Rationale
* **Velocity & Simplicity:** Eliminates the immense DevOps burden of Kubernetes, service discovery, distributed tracing, and cross-service authentication.
* **Cost Efficiency:** Serverless compute bills only during active analysis execution ($0 baseline idle cost), perfectly aligning with early startup economics.
* **Clean Evolutionary Path:** If specific tasks (e.g., intensive deep-learning model training) require specialized dedicated resources in the future, they can be extracted cleanly without disrupting the core application.

### 6. Consequences
* *Positive:* Single repository codebase, shared TypeScript types across frontend and backend, instant serverless deployments, zero server patching.
* *Negative:* Edge Functions are subject to cold starts (~50ms) and a 45-second execution timeout, requiring asynchronous pipeline architecture for long-running workflows.

### 7. Risks & Mitigations
* *Risk:* Serverless timeout on slow AI completions.
* *Mitigation:* Decouple the analysis flow into an asynchronous state machine with realtime status notifications.

### 8. Evidence
Repository reconnaissance confirmed existing Supabase integration; `npx vite build` succeeds in 2.54s for the client SPA.

### 9. Revisit Conditions
Revisit if daily active analyses exceed 100,000 requests/day, or if custom GPU-accelerated PyTorch models are deployed requiring persistent long-running Python daemons.
