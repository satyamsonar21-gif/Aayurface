# AayurFace — Component Architecture Specification
## Reusable Component Inventory & Domain Pattern Catalog

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Date:** 2026-09-03  
**Status:** TARGET COMPONENT INVENTORY (48 Components)  
**Authority:** Design Systems Architect, Staff UX Engineer  

---

## 1. Design System Primitives & Composites

| Component Name | Category | Primary Props & Contract | Key Visual & Accessibility Behaviors |
|---|---|---|---|
| `Button` | Primitive | `variant: 'primary' | 'secondary' | 'outline' | 'ghost'`, `size: 'sm' | 'md' | 'lg'`, `isLoading?: boolean` | Full keyboard focus ring, $48\text{px}$ touch target on mobile, disabled spinner state. |
| `Input` | Primitive | `label: string`, `error?: string`, `hint?: string`, `icon?: LucideIcon` | Floating or top label, inline error message with `aria-describedby`, error border. |
| `Badge` | Primitive | `variant: 'neutral' | 'dosha' | 'status' | 'gold'`, `size: 'sm' | 'md'` | Pill-shaped status indicator, high-contrast text. |
| `ModalDialog` | Composite | `isOpen: boolean`, `onClose: () => void`, `title: string` | Focus trap (FocusLock), escape key listener, backdrop click dismiss, ARIA modal. |
| `DrawerSheet` | Composite | `isOpen: boolean`, `onClose: () => void`, `position: 'bottom' | 'right'` | Mobile bottom sheet with drag-to-dismiss handle and spring physics. |
| `ToastAlert` | Feedback | `type: 'success' | 'warning' | 'error' | 'info'`, `message: string` | Auto-dismissing floating alert, ARIA live region `role="status"`. |
| `SkeletonCard` | Feedback | `lines?: number`, `hasImage?: boolean` | Shimmer gradient placeholder matching target card layout. |

---

## 2. AayurFace Domain-Specific Pattern Components

| Component Name | Feature Domain | Stated Role & Props Contract | Key Domain Behavior |
|---|---|---|---|
| `FaceCaptureFrame` | Capture | `videoRef: RefObject<HTMLVideoElement>`, `qualityStatus: QualityGateState` | Renders dashed circular boundary, animated color shift (amber $\rightarrow$ forest green upon alignment). |
| `QualityGuidanceBar`| Capture | `metrics: { lighting: number, blur: number, centered: boolean }` | Real-time textual instructions: *"Move closer"*, *"More light needed"*. |
| `DoshaTriGauge` | Results | `scores: { vata: number, pitta: number, kapha: number }` | Segmented tri-color circular gauge displaying Vata, Pitta, and Kapha balance. |
| `ConfidenceBadge` | Results | `level: 'HIGH' | 'MODERATE' | 'LOW'`, `harmonicAgreement: number` | Transparent confidence indicator with popover explaining agreement. |
| `ExplainabilityCard`| Results | `observation: string`, `influence: string`, `evidence: ClassicalVerse` | 7-point transparent breakdown card. |
| `RoutineHabitCard` | Routine | `item: RoutineItem`, `onToggle: (id: string) => void` | Daily ritual checkbox with animated checkmark and streak indicator. |
| `TrendDeltaChart` | Progress | `baseline: number`, `current: number`, `metricName: string` | Clean sparkline chart illustrating 30/60/90-day trajectory. |
| `ClassicalVerseCard`| Knowledge | `sanskrit: string`, `english: string`, `sourceWork: string` | Editorial typography card with authentic Devanagari script and translation. |
