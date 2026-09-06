# AayurFace — State Architecture Specification
## Multi-Tier State Management Architecture & Ownership Model

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Date:** 2026-09-03  
**Status:** TARGET STATE ARCHITECTURE (REQUIRES IMPLEMENTATION)  
**Authority:** State Management Architect, Principal Frontend Architect  

---

## 1. The 5-Tier State Separation Model

To prevent bloated global state and eliminate synchronization race conditions, state is partitioned across 5 distinct lifecycle tiers:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    5-TIER STATE MANAGEMENT MODEL                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. SERVER STATE (Managed by TanStack Query v5)                              │
│    • Queries: `/profile`, `/consents`, `/routines`, `/history`, `/progress` │
│    • Cache keys, automatic background refetching, mutation rollback         │
│                                                                             │
│ 2. CLIENT UI STATE (Managed by Zustand Stores)                              │
│    • `useUIStore`: Sidebar collapsed state, active modals, toast queue      │
│    • `useAudioStore`: Conversational audio mute, speech synthesis state     │
│                                                                             │
│ 3. EPHEMERAL CAPTURE & HARDWARE STATE (Managed by Local Hook / Context)     │
│    • `useCaptureSession`: WebRTC stream, MediaPipe landmark coords, lux lux │
│                                                                             │
│ 4. FORM & INPUT STATE (Managed by React Hook Form + Zod)                    │
│    • Form validation, draft persistence, touched fields, dirty states       │
│                                                                             │
│ 5. AUTHENTICATION & SESSION STATE (Managed by Supabase Auth Context)        │
│    • Current user JWT, session expiry timestamp, refresh listeners          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Invariants & State Boundaries

1. **Zero Server State in Zustand:** Server entities (e.g., scan results, user profiles, routines) must **never** be copied into Zustand stores. They reside solely in the TanStack Query cache.
2. **Persistent Preferences:** Only non-sensitive user preferences (e.g., UI theme, language selection, audio enabled) may persist in `localStorage` under keys prefixed with `aayurface_pref_`.
3. **Sensitive Data Dropped on Unmount:** Raw video frames, canvas pixel arrays, and captured facial landmarks are completely released and dereferenced in memory upon component unmount.
