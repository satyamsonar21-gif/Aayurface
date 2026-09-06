# AayurFace — Architecture Specification
## Target Performance Architecture, Budgets & Empirical Benchmark Protocol

**Phase:** Phase 02 — Target System Architecture, ADRs & Implementation Blueprint  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION  
**Authority:** Platform/SRE Architect, Performance Engineer  
**Measurement Integrity Notice:** All metric values in this document represent architectural TARGETS and BUDGETS. No benchmark numbers are claimed as empirically verified until physical load testing is executed in Milestone 14.  

---

### 1. Architectural Performance Principles

1. **Target vs. Verified Separation:** Performance assertions must never be stated as verified facts without reproducible load test logs.
2. **Client Resource Minimization:** WebAssembly landmarking and canvas drawing must preserve a minimum 15 FPS on mid-tier mobile hardware without exhausting device battery or triggering thermal throttling.
3. **Bandwidth Economy:** Biometric image uploads are compressed on the client to $\le 500\text{ kB}$ prior to transmission, ensuring reliable capture over 3G/4G cellular networks.
4. **Predictable Asynchronous Pipelines:** End-to-end multimodal analysis is budgeted to complete within an acceptable consumer wait time (10–25s target), with real-time stage updates preventing user abandonment.

---

### 2. Architectural Performance Budgets & Future Benchmark Categories

The table below delineates the formal target budgets and their future verification methods:

| Benchmark Category | Target Budget (p50) | Target Budget (p95) | Current Status | Empirical Verification Protocol (Milestone 14) | Potential Bottleneck | Optimization Strategy |
|---|---|---|---|---|---|---|
| **Client Initial Page Load (FCP)** | $\le 1.2\text{ s}$ | $\le 2.0\text{ s}$ | **TARGET (Unverified)** | Lighthouse CI audit over emulated 4G mobile network. | Large JS bundle size; unoptimized fonts. | Code splitting via `React.lazy()`; asset tree-shaking; Brotli compression. |
| **Client Bundle Size (Gzipped)** | $\le 280\text{ kB}$ | $\le 350\text{ kB}$ | **CURRENT (261 kB JS Verified in Vite)** | `npx vite build` bundle output analysis. | Heavy third-party libraries (MediaPipe, Recharts). | Dynamic imports for routes (`/capture`, `/progress`, `/results`). |
| **MediaPipe Gateway FPS** | $\ge 20\text{ FPS}$ | $\ge 15\text{ FPS}$ | **TARGET (Unverified)** | Chrome DevTools Performance recording on real mobile device. | WebAssembly CPU consumption on low-end hardware. | Frame decimation (evaluate every 2nd or 3rd frame); WebGL delegate. |
| **Signed Upload URL Latency** | $\le 150\text{ ms}$ | $\le 350\text{ ms}$ | **TARGET (Unverified)** | Automated k6 HTTP benchmarking on `/api/v1/capture/upload-url`. | Cold start latency on Supabase Edge Functions. | Keep-alive edge function warming; minimal dependency footprint. |
| **Direct Image Upload (S3 PUT)** | $\le 1,500\text{ ms}$ | $\le 3,500\text{ ms}$ | **TARGET (Unverified)** | k6 cellular simulation uploading 450 kB JPEG. | High image resolution; uplink packet drop. | Client-side Canvas downsampling to max $1280 \times 720$ at 85% JPEG quality. |
| **Serverless CV Feature Extraction** | $\le 1,200\text{ ms}$ | $\le 2,500\text{ ms}$ | **TARGET (Unverified)** | Integration test profiling CIELAB and GLCM extraction on Deno worker. | GLCM texture matrix computation across large pixel grids. | Compute GLCM on downsampled $256 \times 256$ grayscale ROI patches. |
| **Classical pgvector Semantic Search** | $\le 25\text{ ms}$ | $\le 60\text{ ms}$ | **TARGET (Unverified)** | PostgreSQL `EXPLAIN ANALYZE` on 1536-dim cosine similarity query. | Unindexed sequential vector scan as table grows. | HNSW vector index (`m = 16`, `ef_construction = 64`) with cosine distance. |
| **Generative AI Completion Latency** | $\le 5,000\text{ ms}$ | $\le 12,000\text{ ms}$ | **TARGET (Unverified)** | Upstream OpenAI API telemetry logging per completion call. | OpenAI upstream server load or long generation output. | Enforce `max_tokens = 800`; stream tokens or use pinned high-speed model snapshot. |
| **End-to-End Analysis Pipeline** | $\le 12\text{ s}$ | $\le 25\text{ s}$ | **TARGET (Unverified)** | End-to-end timing from `/orchestrate` call to `COMPLETED` CDC event. | Serial execution of extraction, search, and generative AI. | Parallelize RAG vector retrieval with CV feature extraction. |
| **Database Query Latency (RLS)** | $\le 10\text{ ms}$ | $\le 25\text{ ms}$ | **TARGET (Unverified)** | pgBouncer / PostgreSQL query performance metrics. | Unindexed foreign keys or complex subqueries in RLS policies. | Index `(user_id)` on 100% of user tables; maintain atomic RLS expressions. |

---

### 3. Pipeline Latency Breakdown & Parallelization Architecture

```text
SERIAL PIPELINE (Worst Case: ~24s):
[Image Download: 1.5s] ──► [CV Extraction: 2.0s] ──► [DB Context Read: 0.2s] ──► [pgvector Search: 0.1s] ──► [GPT-4o Synthesis: 10.0s] ──► [DB Write: 0.2s]

PARALLELIZED PIPELINE ARCHITECTURE (Target Case: ~11s):
             ┌──► [CV Feature Extraction: 2.0s] ──────┐
[Download] ──┤                                        ├──► [Multimodal Fusion: 0.1s] ──► [GPT-4o XAI: 7.0s] ──► [Snapshot Write: 0.2s]
  (1.2s)     └──► [DB Context + pgvector Search: 0.3s]─┘
```

By executing the database context read and classical literature vector search concurrently with the image feature extraction, the orchestrator eliminates 2–3 seconds of serial wait time before invoking the generative synthesis engine.
