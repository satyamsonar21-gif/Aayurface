# AayurFace — Frontend Architecture Specification
## Target Modular Frontend Architecture & Layering Model

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Date:** 2026-09-03  
**Status:** TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)  
**Authority:** Principal Frontend Architect, Staff Software Architect  

---

## 1. Multi-Tier Layering Architecture

The AayurFace frontend is organized into 5 unidirectional dependency layers:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    5-TIER FRONTEND LAYERING MODEL                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. ROUTE & LAYOUT SHELL LAYER (`src/routes/`, `src/layouts/`)               │
│    • Route definitions, lazy-loading suspense boundaries, auth guards       │
│                                                                             │
│ 2. DOMAIN FEATURE LAYER (`src/features/*`)                                  │
│    • Self-contained feature slices (auth, capture, analysis, routines, etc.)│
│    • Domain components, custom React Query hooks, and feature UI state      │
│                                                                             │
│ 3. REUSABLE UI COMPONENT LAYER (`src/components/ui/`, `components/feedback/`)│
│    • Primitive and composite design system components (Button, Modal, Card) │
│                                                                             │
│ 4. CORE SERVICES & API LAYER (`src/api/`, `src/services/`, `src/lib/`)       │
│    • Fetch client with RS256 JWT injection, error mapping, Supabase SDK     │
│                                                                             │
│ 5. SHARED FOUNDATIONS (`src/tokens/`, `src/types/`, `src/utils/`)           │
│    • Design tokens, TypeScript interfaces, Zod schemas, helper functions    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Invariants & Architecture Rules

1. **Unidirectional Dependency Flow:** Higher layers may import from lower layers; lower layers must **never** import from higher layers (e.g., `src/components/ui/Button.tsx` cannot import from `src/features/capture/`).
2. **Feature Encapsulation:** Features must communicate across domain boundaries via explicit exported public APIs (`src/features/*/index.ts`) or URL query parameters rather than reaching into private feature internals.
3. **No Direct Fetch in UI:** React components are strictly forbidden from issuing raw `fetch()` or `axios` calls. All network requests must flow through typed TanStack Query hooks in `src/features/*/api/`.
4. **React 19 Hooks & Compiler Readiness:** All state hooks adhere to pure React 19 standards, avoiding manual unnecessary `useMemo` / `useCallback` where React 19 compiler optimizations apply, while preserving strict dependency arrays.
