# ADR-FE-015: Frontend Performance Strategy & Asset Optimization

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Context:**  
Mobile users on variable networks require sub-2 second initial load times and instant interaction responses without jank during camera capture.

**Decision:**  
We enforce strict **Core Web Vitals Performance Budgets** (LCP $\le 2.0\text{s}$, INP $\le 100\text{ms}$, CLS $\le 0.05$) supported by route code-splitting, font preloading, TanStack Query caching, and Web Worker offloading.

**Consequences:**  
* Guarantees high-performance user experience across mobile devices.
* Requires automated Lighthouse CI performance auditing in Phase 07.

**Truth Status:** `TARGET PERFORMANCE TARGETS (REQUIRES BENCHMARKING)`
