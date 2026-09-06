# AayurFace — Frontend Architecture Specification
## Frontend Architecture & Framework Selection Decision

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Date:** 2026-09-03  
**Status:** TARGET ARCHITECTURE DECISION  
**Authority:** Principal Frontend Architect, Staff Software Architect  

---

## 1. Architectural Style Evaluation

To select the target frontend architecture for AayurFace, three primary options were evaluated against product requirements, camera/Wasm hardware access, security boundaries, and operational complexity:

| Evaluation Dimension | React 19 SPA + Vite 8 (Selected) | Next.js 15 (SSR / App Router) | Remix / React Router v7 Fullstack |
|---|---|---|---|
| **Client-Side Hardware & Wasm** | **Optimal:** Zero SSR hydration mismatch; native access to WebRTC `getUserMedia`, MediaPipe WebAssembly, and Canvas 2D image processing. | **Moderate:** SSR requires defensive `typeof window !== 'undefined'` checks and dynamic imports for camera/Wasm modules. | **Moderate:** Client-only modules require explicit client loader wrappers. |
| **API Boundary & Security** | **Optimal:** Clean separation; client calls Deno Edge Functions via Phase 05 REST API contracts with RS256 JWTs. | **Complex:** Two backend tiers (Next.js Server Actions + Supabase Edge Functions) create duplicate authorization logic. | **Complex:** Server loaders duplicate Edge Gateway authorization checks. |
| **Edge CDN Hosting & Cost** | **Optimal:** Deploys as static immutable assets on Cloudflare Pages / Vercel CDN; zero server compute runtime cost for frontend hosting. | **Expensive:** Requires continuous Node.js server compute runtime or Vercel Edge compute for SSR. | **Expensive:** Requires server compute runtime for SSR loaders. |
| **Development Velocity & Testing** | **Optimal:** Instant Vite HMR ($<50\text{ms}$); fast Vitest execution with standard JSDOM; zero complex server bundling. | **Moderate:** Complex Webpack/Turbopack SSR bundling and server-side component test mock overhead. | **Moderate:** Route loader testing requires complex synthetic request mocking. |

---

## 2. Decision Outcome & Chosen Topology

### Primary Decision:
AayurFace adopts a **Client-Side Single Page Application (SPA)** built with **React 19, Vite 8, React Router DOM 7, TanStack Query v5, Zustand, and Tailwind CSS v4**.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TARGET FRONTEND SYSTEM TOPOLOGY                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   [ Client Browser / Mobile Web View ]                                      │
│   ├── React 19 App Shell (Layouts, Modals, Toast Notifications)             │
│   ├── Route Layer (React Router DOM v7 with Lazy-Loaded Domains)            │
│   ├── State Architecture:                                                   │
│   │   • Server State: TanStack Query v5 (Auto-caching, Polling, Mutate)     │
│   │   • Client UI State: Zustand Stores (Audio, Capture, Theme, Drawer)     │
│   │   • Form State: React Hook Form + Zod Schema Validation                 │
│   └── Client Processing Engine:                                             │
│       • MediaPipe Face Mesh Wasm Worker (Off-Main-Thread Landmark Scoring)  │
│       • Canvas EXIF Metadata Stripper (Client-Side Privacy Barrier)         │
│                     │                                                       │
│                     │ HTTPS / TLS 1.3 (Bearer RS256 JWT)                    │
│                     ▼                                                       │
│   [ Supabase Edge API Gateway (Phase 05 REST Boundary) ]                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Truth-Status Classification
* **Selected Architecture (React 19 + Vite 8 SPA):** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`
* **MediaPipe Wasm Worker Architecture:** `PROPOSED (REQUIRES BENCHMARKING)`
