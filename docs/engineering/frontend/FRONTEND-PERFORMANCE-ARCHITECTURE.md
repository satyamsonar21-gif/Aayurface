# AayurFace — Performance Architecture Specification
## Core Web Vitals, Bundle Optimization & Web Worker Wasm Offloading

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Domain:** Frontend Performance & Asset Optimization  
**Status:** `TARGET PERFORMANCE TARGETS (REQUIRES BENCHMARKING)`  
**Authority:** Frontend Performance Engineer, Principal Frontend Architect  

---

## 1. Core Web Vitals Target Performance Budgets

> [!NOTE]
> **Performance Classification Notice:** The figures below represent **ARCHITECTURAL TARGET OBJECTIVES**. They do not constitute measured benchmarks until load and real-user monitoring (RUM) tests are executed in Phase 07.

| Performance Metric | Target Budget (P75 Mobile) | Optimization Technique | Validation Status |
|---|---|---|---|
| **Largest Contentful Paint (LCP)** | $\le 2.0\text{ seconds}$ | Font preloading, hero asset compression, edge CDN | `TARGET (REQUIRES BENCHMARK)` |
| **Interaction to Next Paint (INP)**| $\le 100\text{ ms}$ | TanStack Query caching, lightweight render tree | `TARGET (REQUIRES BENCHMARK)` |
| **Cumulative Layout Shift (CLS)** | $\le 0.05$ | Explicit aspect ratio boxes, skeleton loaders | `TARGET (REQUIRES BENCHMARK)` |
| **Initial Bundle Size (Gzipped)** | $\le 150\text{ KB}$ | Route-level code splitting via `React.lazy()` | `TARGET (REQUIRES BENCHMARK)` |
| **MediaPipe Wasm Load Time** | $\le 1.5\text{ seconds}$ | Lazy-loaded on `/analyze/capture` route only | `TARGET (REQUIRES BENCHMARK)` |

---

## 2. Web Worker Wasm Offloading Invariant

To prevent camera landmark detection from dropping UI frame rates or locking the main browser thread:
* **Dedicated Web Worker:** MediaPipe Face Mesh WebAssembly runs inside a background Web Worker (`src/workers/faceMeshWorker.ts`).
* **OffscreenCanvas / Transferable Objects:** Video frames and landmark arrays are passed via Zero-Copy Transferable Objects, maintaining a smooth **60 FPS** UI interaction rate during capture.
