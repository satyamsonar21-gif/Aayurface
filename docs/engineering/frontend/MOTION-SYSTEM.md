# AayurFace — Design System Specification
## Motion System, Easing Curves & Reduced-Motion Rules

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Date:** 2026-09-03  
**Status:** TARGET MOTION SPECIFICATION  
**Authority:** Interaction Designer, Accessibility Architect  

---

## 1. Motion Philosophy: Serene & Intentional

AayurFace rejects chaotic UI animations, bouncy morphs, and fast spins. Animation is used exclusively to:
1. Signal asynchronous state progression (e.g., gentle breathing pulse during analysis).
2. Guide visual focus (subtle vertical reveals).
3. Provide tactile feedback (gentle scale tap).

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       MOTION TOKENS & EASING CURVES                         │
├────────────────────┬──────────┬─────────────────────────────┬───────────────┤
│ Token Name         │ Duration │ Easing Curve                │ Purpose       │
├────────────────────┼──────────┼─────────────────────────────┼───────────────┤
│ `motion.fade.quick`│ `150ms`  │ `ease-out`                  │ Tooltip, Hover│
│ `motion.fade.base` │ `250ms`  │ `cubic-bezier(0.16,1,0.3,1)`│ Tab, Dialog   │
│ `motion.reveal`    │ `400ms`  │ `cubic-bezier(0.16,1,0.3,1)`│ Card Mount    │
│ `motion.breathe`   │ `3500ms` │ `ease-in-out` (Infinite)    │ Analysis Pulse│
└────────────────────┴──────────┴─────────────────────────────┴───────────────┘
```

---

## 2. Accessibility & Reduced Motion Governance

* **`prefers-reduced-motion: reduce` Support:** When enabled by the operating system, all durations are set to `0ms` or replaced with immediate crossfades (`opacity` only, zero translation/scaling).
* **No Flashing Content:** Zero animations exceed 3 flashes per second, complying with WCAG 2.2 Criterion 2.3.1.
