# AayurFace — Data Fetching Specification
## Server-State Management, Query Key Factory & Cache Policies

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Date:** 2026-09-03  
**Status:** TARGET DATA FETCHING ARCHITECTURE (REQUIRES IMPLEMENTATION)  
**Authority:** API Integration Architect, Principal Frontend Architect  

---

## 1. Authoritative Query Key Factory

To eliminate typos and guarantee predictable cache invalidation across feature slices:

```typescript
export const queryKeys = {
  profile: {
    root: ['profile'] as const,
    current: () => [...queryKeys.profile.root, 'current'] as const,
    preferences: () => [...queryKeys.profile.root, 'preferences'] as const
  },
  consents: {
    root: ['consents'] as const,
    active: () => [...queryKeys.consents.root, 'active'] as const
  },
  onboarding: {
    root: ['onboarding'] as const,
    state: () => [...queryKeys.onboarding.root, 'state'] as const
  },
  routines: {
    root: ['routines'] as const,
    active: () => [...queryKeys.routines.root, 'active'] as const
  },
  analyses: {
    root: ['analyses'] as const,
    detail: (id: string) => [...queryKeys.analyses.root, 'detail', id] as const,
    status: (id: string) => [...queryKeys.analyses.root, 'status', id] as const,
    explainability: (id: string) => [...queryKeys.analyses.root, 'explain', id] as const,
    recommendations: (id: string) => [...queryKeys.analyses.root, 'recs', id] as const
  },
  history: {
    root: ['history'] as const,
    infinite: (filters?: Record<string, unknown>) => [...queryKeys.history.root, 'infinite', filters] as const
  },
  progress: {
    root: ['progress'] as const,
    checkpoints: () => [...queryKeys.progress.root, 'checkpoints'] as const
  }
};
```

---

## 2. Stale Time & Cache Strategy Matrix

| Query Scope | Stale Time | Cache Time (gcTime) | Refetch on Window Focus | Polling Strategy |
|---|---|---|---|---|
| **User Profile & Preferences** | `5 minutes` | `30 minutes` | Yes | None |
| **Active Consents** | `10 minutes` | `30 minutes` | Yes | None |
| **Active Dinacharya Routine** | `1 minute` | `15 minutes` | Yes | None (Optimistic Mutations) |
| **Analysis Status (`/status`)**| `0 seconds` | `5 minutes` | Yes | **Polling every 1.5s** while `!isTerminal` |
| **Completed Analysis Result** | `Infinity` (Immutable)| `60 minutes` | No (Cached permanently) | None |
| **Scan History Feed** | `2 minutes` | `20 minutes` | Yes | None |
| **Longitudinal Checkpoints** | `15 minutes` | `60 minutes` | No | None |
