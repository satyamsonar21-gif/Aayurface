# ADR-FE-009: WebAssembly MediaPipe Offloading to Web Worker

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Context:**  
Real-time 468-point facial landmark mesh tracking and lighting calculation on the main UI thread can cause frame drops and battery drain on mobile devices.

**Decision:**  
MediaPipe Face Mesh WebAssembly runs inside a **Dedicated Background Web Worker**, passing frame landmarks via Zero-Copy Transferable Objects to maintain a smooth 60 FPS UI thread.

**Consequences:**  
* Guarantees responsive UI feedback and eliminates jank during camera capture.
* Requires Web Worker build configuration in Vite.

**Truth Status:** `TARGET ARCHITECTURE / PROPOSED (REQUIRES BENCHMARKING)`
