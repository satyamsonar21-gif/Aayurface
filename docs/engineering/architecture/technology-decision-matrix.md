# AayurFace — Architecture Specification
## Technology Evaluation & Decision Matrix

**Phase:** Phase 02 — Target System Architecture, ADRs & Implementation Blueprint  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION  
**Authority:** Principal Software Architect, Staff Backend Architect, Staff Frontend Architect, AI/ML Architect  

---

### 1. Technology Evaluation Framework

Every candidate technology was evaluated across seven objective criteria:
1. **Security & Data Isolation:** Ability to enforce tenant isolation and protect biometric data.
2. **Performance & Latency:** Real-time responsiveness, bundle efficiency, and computational throughput.
3. **Operational Complexity:** Maintenance burden, infrastructure overhead, and operational surface.
4. **Project & Domain Fit:** Alignment with AayurFace's Ayurvedic wellness intelligence mission and PRD v1.0.
5. **Ecosystem & Tooling:** Community maturity, library compatibility, and developer ergonomics.
6. **Migration & Switching Cost:** Feasibility of integrating with the existing codebase without high-risk rewrites.
7. **Cost Profile:** Cloud operating expenditure, inference token costs, and license constraints.

---

### 2. Comprehensive Technology Decision Matrix

| Domain | Evaluated Option | Advantages | Disadvantages | Security / Privacy | Performance | Ops Complexity | Migration Cost | Recommendation | Classification & Status |
|---|---|---|---|---|---|---|---|---|---|
| **Frontend Framework (DEC-001)** | **React 19.2.8 (Current)** | Modern React compiler, native actions, already integrated in `package.json`, Vite v8 bundles cleanly in 2.54s. | Peer dependency warnings with older unmaintained React libraries. | High | High (FCP < 1.5s) | Low | Zero (Already installed) | **Retain conditionally** pending toolchain compatibility check for MediaPipe & Recharts. | **OPEN DECISION (DEC-001)** |
| **Frontend Framework (DEC-001)** | **React 18 LTS** | 100% ecosystem compatibility with established React packages (MediaPipe, Recharts, React-PDF). | Deprecated lifecycle paradigms; will require major upgrade later. | High | High | Low | Low (npm install downgrade) | Fallback option if React 19 encounters blocking peer-dependency conflicts. | **OPEN DECISION (DEC-001)** |
| **Frontend Framework** | **Next.js (App Router)** | Built-in SSR, API routes, image optimization. | Complete rewrite of existing Vite SPA; vendor lock-in to Node/Vercel server; SSR unnecessary for client-heavy camera app. | High | Moderate (Server cold starts) | High | Critical (Complete application rewrite) | **REJECTED** | **OUT OF SCOPE** |
| **Backend Architecture** | **Supabase Edge Functions (Deno)** | Stateless, ultra-low latency edge deployment, native TypeScript, zero infrastructure maintenance, built-in Supabase Auth & DB integration. | Cold starts if idle, 45s execution limit, limited C/C++ native binary execution. | High (Encrypted secrets, isolated sandboxes) | High (< 50ms startup) | Low | Low (Builds on existing directory) | **ACCEPTED (ADR-003)** | **CONFIRMED** |
| **Backend Architecture** | **Node.js / Express Container** | Mature ecosystem, long-running processes, WebSocket flexibility. | Requires dedicated server/container hosting (ECS/Fargate/Render), continuous server patching, higher base cost. | Moderate | Moderate | Moderate to High | High (Must build new backend service from scratch) | **REJECTED for MVP** (Consider for specialized long-running microservice in V2) | **PROPOSED ALTERNATIVE** |
| **Backend Architecture** | **Python (FastAPI / Celery)** | Native OpenCV, PyTorch, SciPy for advanced biometric research and feature extraction. | High infrastructure overhead; separate language ecosystem from frontend TypeScript; dual maintenance. | High | High for ML | High | High | **DEFERRED to Research Phase** for advanced offline model training. | **RESEARCH SCOPE** |
| **Primary Database** | **Supabase PostgreSQL 15+** | Relational integrity, built-in Row-Level Security (RLS), ACID transactions, native JSONB, `pgvector` support. | Requires strict schema migrations; connection pool management under spike load. | Maximum (Kernel-enforced RLS tenant isolation) | High (Indexed p95 < 10ms) | Low (Fully managed) | Low (Extends existing schema) | **ACCEPTED (ADR-004)** | **CONFIRMED** |
| **Vector Database** | **PostgreSQL `pgvector`** | Colocated with relational user data; single ACID transaction boundaries; zero cross-database network latency; no extra cloud bill. | Scale limited by database server memory compared to dedicated vector clouds (>10M vectors). | High (Inherits Postgres RLS and encryption) | Target budget $\le 25\text{ms}$ with HNSW index (unverified target requiring benchmark validation) | Low (Zero additional infrastructure) | Low (Native extension in Supabase) | **ACCEPTED (ADR-010)** | **CONFIRMED** |
| **Vector Database** | **Pinecone / Qdrant Cloud** | Specialized vector indexing, auto-scaling to billions of vectors. | Extra third-party billing; cross-cloud latency; separate tenant isolation logic; increased operational complexity. | Moderate | High | Moderate | High | **REJECTED for MVP** (Unnecessary overhead for curated ~2,000 Ayurvedic text chunks) | **PROPOSED ALTERNATIVE** |
| **Biometric Object Storage** | **Supabase Private Storage (S3)** | Fully integrated with Supabase Auth & RLS; short-lived signed URLs (15m TTL); zero public bucket exposure. | Bandwidth egress costs at high video scale. | High (No public reads; signed URL access only) | High | Low | Low (Native feature) | **ACCEPTED (ADR-005)** | **CONFIRMED** |
| **Computer Vision (Tier 1)** | **MediaPipe Face Mesh (Wasm)** | 468 3D landmarks, runs locally in browser WebAssembly; zero server compute; volatile memory evaluation protects privacy. | Client device performance varies on low-end Android hardware. | Maximum (Frames never leave client RAM) | High on modern devices (>=15 FPS) | Low | Moderate (Package integration) | **ACCEPTED (ADR-006)** | **CONFIRMED** |
| **Generative AI Provider** | **OpenAI GPT-4o (Pinned Version)** | High multimodal reasoning, reliable structured JSON output compliance, deep multilingual competence (English/Hindi). | Commercial vendor dependency, token usage costs ($0.03-$0.08 per analysis). | High (Enterprise API zero-data-retention agreement) | Moderate (2-5s completion) | Low (Managed API) | Low (Direct SDK call) | **ACCEPTED (ADR-007)** | **CONFIRMED** |
| **Realtime Telemetry** | **Supabase Realtime (CDC)** | Native PostgreSQL Change Data Capture; pushes database status directly to client over WebSockets; zero extra server. | Requires connection management on mobile network drop. | High (RLS-scoped channels) | Realtime (<100ms) | Low | Low (Native feature) | **ACCEPTED (ADR-013)** | **CONFIRMED** |
| **PDF Generation (DEC-009)**| **Client-Side (`@react-pdf/renderer`)** | Zero server compute cost; generated instantly in browser; private frame data never sent to third-party PDF service. | Increases client JavaScript bundle size (~250 kB gzipped); font loading considerations for Devanagari. | High (Executed locally) | High on client | Low | Moderate | **PROPOSED (DEC-009)** pending bundle benchmarking in Phase 02/03. | **PROPOSED** |
| **PDF Generation (DEC-009)**| **Serverless Headless PDF (Deno)** | Consistent server rendering; zero client bundle bloat; reliable Devanagari font rendering. | High memory consumption in Edge Functions; cold start delays; higher compute cost. | High | Moderate | Moderate | Moderate | Backup alternative if client bundle exceeds 350 kB budget. | **OPEN DECISION (DEC-009)** |
