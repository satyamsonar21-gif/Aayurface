# AayurFace — Frontend Architecture Specification
## Frontend Module Boundaries, Directory Structure & Import Rules

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Date:** 2026-09-03  
**Status:** AUTHORITATIVE ARCHITECTURAL STANDARD  
**Authority:** Principal Frontend Architect, QA Architect  

---

## 1. Target Directory Structure

```text
src/
├── app/                           # Application entry point, global providers, React query client
│   ├── App.tsx
│   ├── Providers.tsx
│   └── main.tsx
├── routes/                        # Route configurations, guards, and lazy page wrappers
│   ├── index.tsx
│   └── guards/
│       ├── AuthGuard.tsx
│       └── OnboardingGuard.tsx
├── layouts/                       # Reusable application layout shells
│   ├── PublicLayout.tsx
│   ├── OnboardingLayout.tsx
│   ├── AppLayout.tsx              # Shell with TopBar, Sidebar (Desktop), BottomNav (Mobile)
│   └── FullscreenLayout.tsx       # Distraction-free capture & analysis viewport
├── features/                      # Domain-driven feature slices
│   ├── auth/                      # Login, signup, password recovery, session state
│   ├── onboarding/                # 8-stage onboarding wizard, resume flow
│   ├── consent/                   # Granular consent dialogs and audit ledger UI
│   ├── questionnaire/             # 15-question Prakriti intake wizard
│   ├── lifestyle/                 # Sleep, stress, climate, digestion inputs
│   ├── capture/                   # Wasm camera feed, quality gate, EXIF stripping
│   ├── analysis/                  # 12-stage analysis polling, progress bar, timeouts
│   ├── results/                   # Normalized dosha breakdown, visual observables
│   ├── recommendations/           # Grounded lepa/diet ritual cards, routine adoption
│   ├── routine/                   # Dinacharya daily habit schedule, tracking checks
│   ├── history/                   # Keyset cursor paginated scan feed
│   ├── progress/                  # Longitudinal 30/60/90-day progress deltas
│   ├── voice/                     # Conversational voice/chat assistant
│   ├── reports/                   # PDF compilation trigger and ephemeral download
│   └── sharing/                   # 256-bit token capability sharing and revocation
├── components/                    # Reusable Design System UI primitives & composites
│   ├── ui/                        # Buttons, Inputs, Cards, Badges, Modals, Tabs
│   ├── feedback/                  # Toasts, Alert banners, Loading spinners, Skeletons
│   └── layout/                    # TopBar, BottomNav, Sidebar, PageContainer
├── hooks/                         # Cross-cutting custom React hooks (media queries, a11y)
├── api/                           # Core fetch client, interceptors, error parsers
├── state/                         # Global Zustand stores (Auth, UI, Audio)
├── tokens/                        # Design token constants (Colors, Spacing, Typography)
├── types/                         # Shared TypeScript interfaces & API contract DTOs
└── utils/                         # Pure utility functions (formatting, date, math)
```

---

## 2. Strict Import & Boundary Rules

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       IMPORT RULE ENFORCEMENT MATRIX                        │
├───────────────────┬──────────────────────────────────┬──────────────────────┤
│ Importing Module  │ Allowed Imports                  │ Forbidden Imports    │
├───────────────────┼──────────────────────────────────┼──────────────────────┤
│ `components/ui/*` │ `tokens/`, `types/`, `utils/`    │ `features/*`, `api/` │
│ `features/A/*`    │ `components/`, `api/`, `types/`  │ `features/B/private` │
│ `api/*`           │ `types/`, `utils/`               │ `components/`, `ui/` │
│ `state/*`         │ `types/`, `api/`                 │ `components/ui/*`    │
│ `routes/*`        │ `layouts/`, `features/*/index.ts`│ Private feature code │
└───────────────────┴──────────────────────────────────┴──────────────────────┘
```
