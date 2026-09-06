# AayurFace — Component Architecture Specification
## Component Hierarchy, Composition Model & Props Standards

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Date:** 2026-09-03  
**Status:** TARGET COMPONENT ARCHITECTURE (REQUIRES IMPLEMENTATION)  
**Authority:** Principal Frontend Architect, Design Systems Architect  

---

## 1. The 5-Level Component Hierarchy

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       5-LEVEL COMPONENT HIERARCHY                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. PRIMITIVES (`src/components/ui/`)                                        │
│    • Button, Input, Checkbox, Badge, Avatar, Skeleton, Tooltip              │
│                                                                             │
│ 2. COMPOSITES (`src/components/ui/`, `src/components/feedback/`)           │
│    • ModalDialog, Accordion, TabGroup, Toast, EmptyState, ErrorAlert        │
│                                                                             │
│ 3. DOMAIN PATTERNS (`src/features/*/components/`)                          │
│    • DoshaGauge, ObservationCard, ConfidenceBadge, ClassicalVerseCitation   │
│                                                                             │
│ 4. FEATURE CONTAINERS (`src/features/*/containers/`)                        │
│    • CaptureWorkflow, AnalysisProgressView, DinacharyaRoutineList           │
│                                                                             │
│ 5. SCREEN VIEWS (`src/features/*/pages/`)                                   │
│    • DashboardScreen, ScanScreen, ResultsScreen, HistoryScreen              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Universal Props Contract Standard

All components conform to strict TypeScript interfaces:
1. **Explicit Polymorphism:** Primitive components accept standard HTML attributes via `React.ComponentPropsWithoutRef<'button'>`.
2. **Accessible Labeling:** Interactive components require explicit `aria-label` or visible text children.
3. **Compound Component Pattern:** Complex components (Tabs, Accordions, Modals) use compound sub-components with React Context to provide flexible layouts.
