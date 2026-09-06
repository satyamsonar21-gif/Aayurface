# Architecture Decision Record: ADR-003
## Backend Strategy: Supabase Edge Functions (Deno Runtime)

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Deciders:** Staff Backend Architect, Principal Software Architect  
**Technical Area:** Compute & API Infrastructure  

---

### 1. Context
AayurFace requires an API layer to authenticate requests, validate schemas, coordinate computer vision extraction, invoke OpenAI GPT-4o, and interact with PostgreSQL and object storage.

### 2. Problem
Choosing between serverless edge execution and dedicated containerized application servers (Node.js/Express or Python/FastAPI) for the primary backend tier.

### 3. Options Evaluated
* **Option A: Supabase Edge Functions on Deno (Selected):** Globally distributed, stateless TypeScript functions running on Deno.
* **Option B: Dedicated Node.js / Express Server:** Traditional containerized server hosted on AWS ECS, GCP Cloud Run, or Render.
* **Option C: Python FastAPI Backend:** Dedicated Python service to unify backend API with native scientific Python libraries (OpenCV/NumPy).

### 4. Decision
Adopt **Option A: Supabase Edge Functions on Deno**.
All backend endpoints (`/api/v1/...`) are implemented as modular Supabase Edge Functions deployed via the Supabase CLI.

### 5. Rationale
* **Zero Infrastructure Maintenance:** Eliminates server provisioning, OS patching, container scaling policies, and separate cluster monitoring.
* **Co-location with Persistence:** Native integration with Supabase Auth, PostgreSQL, and private Storage eliminates cross-cloud API authentication overhead.
* **TypeScript Uniformity:** Enables shared type definitions and Zod validation contracts between frontend and backend.

### 6. Consequences
* *Positive:* Instant global deployment, pay-per-use billing, sub-50ms cold starts, secure secrets isolation via `supabase secrets`.
* *Negative:* 45-second execution limit per invocation; cannot run long-lived background daemons or heavy C++ binaries directly.

### 7. Risks & Mitigations
* *Risk:* Complex scientific image processing slows down Deno functions.
* *Mitigation:* Heavy landmarking is offloaded to client-side WebAssembly; serverless feature extraction operates on downsampled ROI image buffers.

### 8. Evidence
Repository contains existing `supabase/functions/` directory with two working functions (`analyze-skin` and `ayurveda-chat`).

### 9. Revisit Conditions
Revisit if proprietary offline neural networks are introduced requiring specialized GPU instances.
