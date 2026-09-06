# ADR-FE-001: Frontend Architecture & Client Framework

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Context:**  
AayurFace requires an ultra-responsive web frontend supporting hardware camera capture, MediaPipe WebAssembly execution, real-time client-side image processing, and secure communication with Supabase Edge Functions.

**Decision:**  
We adopt a **Pure Client-Side Single Page Application (SPA)** built with **React 19 and Vite 8**.

**Consequences:**  
* Eliminates SSR hydration mismatches with WebRTC camera and WebAssembly modules.
* Enables static immutable asset deployment to edge CDNs at near-zero hosting cost.
* Relies on standard client-side routing and TanStack Query for data fetching.

**Truth Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`
