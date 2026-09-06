# AayurFace — Engineering Reconnaissance Audit
## Document 10: Performance & Optimization Reconnaissance

**Phase:** Phase 00 — Full Repository & System Reconnaissance  
**Date:** 2026-09-03  
**Auditor:** Performance Engineer  
**Status:** FORENSIC EVIDENCE COLLECTED  

---

### 1. Bundle & Asset Analysis

Production build inspection (`npx vite build`) reveals the following distribution:

* **HTML:** `dist/index.html` — 0.70 kB (gzip: 0.41 kB)
* **CSS:** `dist/assets/index-D2vpN4Fb.css` — 43.41 kB (gzip: 8.05 kB)
* **Application JS:** `dist/assets/index-BBNkkXoo.js` — 261.39 kB (gzip: 82.68 kB)
* **Major Chunks:**
  * `dist/assets/createLucideIcon-2rMR4cju.js`: 122.09 kB (gzip: 39.68 kB) — Un-treeshaken Lucide icon barrel bundle.
  * `dist/assets/zod-BjFtz_f7.js`: 90.19 kB (gzip: 27.02 kB) — Zod v4 validation engine.
  * `dist/assets/mockData-DvHEt5E8.js`: 43.22 kB (gzip: 11.98 kB) — Entire static mock database shipped to every client!

#### Key Performance Risks Identified:

1. **Shipping 52KB of Mock Data in Client Bundles:** Shipping `mockData.ts` in production bundles adds unnecessary weight and leaks future remedy database records directly into browser memory.
2. **Icon Tree-Shaking Inefficiency:** `lucide-react` is bundled as a single large 122KB chunk rather than isolated dynamic imports.
3. **Heavy External Images on Landing Page:** The landing page requests external Unsplash imagery (`https://images.unsplash.com/...`) and high-resolution local images (`/images/1.jpg` [32KB], `/images/2.jpg` [168KB], `/images/auth-bg.jpg` [755KB]) without modern format conversion (WebP/AVIF), responsive `srcset`, or lazy-loading tags.
4. **Client-Side Camera Stream Processing Overhead:** Running real-time MediaPipe Face Mesh client-side in future phases will require web-worker offloading or frame skipping to prevent UI main-thread jank on lower-end mobile devices.
5. **Slow Test Environment Startup:** In Vitest, initializing `jsdom` took 27.79 seconds on Windows. Test configuration requires optimization for local developer iteration.
