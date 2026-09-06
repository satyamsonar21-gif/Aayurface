# AayurFace — Frontend Architecture & Design Systems (Phase 06)
## Master Documentation & Design System Registry Index

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Date:** 2026-09-03  
**Status:** FULLY CERTIFIED ARCHITECTURAL BASELINE (`PASS`)  
**Authority:** Principal Frontend Architect, Staff UX Engineer, Design Systems Architect  

---

## 1. Executive Summary & Architectural Scope

Phase 06 establishes the complete, production-grade, authoritative frontend architecture, UX interaction specifications, and design system for **AayurFace** (*Evidence-Aware Multimodal Ayurvedic Skin & Wellness Intelligence Platform*).

This directory houses the complete set of **52 technical specifications, architectural decision records (ADRs), UX journey specs, component taxonomies, and Mermaid diagrams**.

---

## 2. Master Documentation Sitemap

### Core Architecture & Strategy
* [**CURRENT-FRONTEND-AUDIT.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/CURRENT-FRONTEND-AUDIT.md) — Comprehensive audit of existing prototype code, mock auth, and interface disposition matrix.
* [**FRONTEND-ARCHITECTURE-DECISION.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/FRONTEND-ARCHITECTURE-DECISION.md) — Evaluation of React 19 SPA + Vite 8 stack vs Next.js SSR.
* [**FRONTEND-ARCHITECTURE.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/FRONTEND-ARCHITECTURE.md) — 5-tier modular frontend architecture and unidirectional layering rules.
* [**FRONTEND-MODULE-BOUNDARIES.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/FRONTEND-MODULE-BOUNDARIES.md) — Directory structure and strict import boundary rules.
* [**ROUTE-ARCHITECTURE.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/ROUTE-ARCHITECTURE.md) — Complete 24-route catalog across public, auth, onboarding, and app shells.
* [**SCREEN-INVENTORY.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/SCREEN-INVENTORY.md) — Master inventory of all 24 screens with user goals, APIs, and responsive behavior.
* [**NAVIGATION-ARCHITECTURE.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/NAVIGATION-ARCHITECTURE.md) — Responsive layout shells, desktop sidebar, and mobile 5-tab bottom navigation.

### Design System & Theming
* [**DESIGN-TOKENS.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/DESIGN-TOKENS.md) — Complete semantic token constants for colors, spacing, radius, and shadows.
* [**DESIGN-SYSTEM.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/DESIGN-SYSTEM.md) — 50/30/20 luxury/Ayurveda/tech aesthetic formulation and prohibited styles.
* [**DESIGN-SYSTEM-GOVERNANCE.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/DESIGN-SYSTEM-GOVERNANCE.md) — Anti-AI-generated-look rules and token linting enforcement.
* [**TYPOGRAPHY-SYSTEM.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/TYPOGRAPHY-SYSTEM.md) — Cormorant Garamond + Manrope dual font scale hierarchy.
* [**COLOR-SYSTEM.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/COLOR-SYSTEM.md) — Warm ivory cream, deep forest green, sage, antique gold, and dosha palettes.
* [**SPACING-SYSTEM.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/SPACING-SYSTEM.md) — 4px/8px base grid, responsive breakpoints, and container max-widths.
* [**MOTION-SYSTEM.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/MOTION-SYSTEM.md) — Serene motion tokens, easing curves, and `prefers-reduced-motion` compliance.

### Component Architecture & State
* [**COMPONENT-ARCHITECTURE.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/COMPONENT-ARCHITECTURE.md) — 5-level component hierarchy and universal props contract standard.
* [**COMPONENT-INVENTORY.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/COMPONENT-INVENTORY.md) — Exhaustive catalog of 48 primitives, composites, and domain patterns.
* [**COMPONENT-STATE-MATRIX.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/COMPONENT-STATE-MATRIX.md) — Visual and accessible states across all interactive components.
* [**FRONTEND-STATE-ARCHITECTURE.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/FRONTEND-STATE-ARCHITECTURE.md) — 5-tier state separation (Server, UI, Capture, Form, Auth).
* [**DATA-FETCHING-ARCHITECTURE.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/DATA-FETCHING-ARCHITECTURE.md) — TanStack Query v5 query keys, cache times, and 1.5s polling rules.
* [**FORM-ARCHITECTURE.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/FORM-ARCHITECTURE.md) — React Hook Form + Zod, draft persistence, and server error mapping.

### Domain UX Specifications
* [**CAPTURE-UX-SPEC.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/CAPTURE-UX-SPEC.md) — Standardized camera capture, Wasm quality guidance, and EXIF stripping.
* [**ANALYSIS-UX-SPEC.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/ANALYSIS-UX-SPEC.md) — Honest stage-based progress, polling, and timeout resilience.
* [**RESULTS-UX-SPEC.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/RESULTS-UX-SPEC.md) — Doshic balance gauge, visual Lakshanas, and non-diagnostic boundaries.
* [**CONFIDENCE-UX-SPEC.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/CONFIDENCE-UX-SPEC.md) — Transparent uncertainty presentation and low-agreement protocols.
* [**EXPLAINABILITY-UX-SPEC.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/EXPLAINABILITY-UX-SPEC.md) — 7-pillar reasoning transparency and classical verse citations.
* [**AYURVEDIC-UX-SPEC.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/AYURVEDIC-UX-SPEC.md) — Prakriti vs Vikriti separation, Guna chips, and respectful terminology.
* [**PERSONALIZATION-UX-SPEC.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/PERSONALIZATION-UX-SPEC.md) — "Why am I seeing this?" multi-factor attribution panel.
* [**ROUTINE-UX-SPEC.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/ROUTINE-UX-SPEC.md) — Dinacharya timeline, optimistic habit checking, and consistency UX.
* [**HISTORY-PROGRESS-UX-SPEC.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/HISTORY-PROGRESS-UX-SPEC.md) — Keyset scan history feed, 30/60/90-day progress delta vectors.
* [**VOICE-UX-SPEC.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/VOICE-UX-SPEC.md) — Ephemeral speech processing, text-only chat turns, and AI safety boundaries.
* [**MULTILINGUAL-UX-SPEC.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/MULTILINGUAL-UX-SPEC.md) — Multilingual language tiers, Devanagari font rendering, and localization.
* [**REPORT-SHARE-UX-SPEC.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/REPORT-SHARE-UX-SPEC.md) — Asynchronous PDF compilation modal, signed download, and capability sharing.

### Quality, Security, Reliability & Traceability
* [**UX-STATE-TAXONOMY.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/UX-STATE-TAXONOMY.md) — Universal 28-state UX taxonomy and screen coverage matrix.
* [**ERROR-UX-ARCHITECTURE.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/ERROR-UX-ARCHITECTURE.md) — Phase 05 error code mapping, user messages, and zero-leakage rules.
* [**FRONTEND-API-INTEGRATION-MAP.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/FRONTEND-API-INTEGRATION-MAP.md) — Mapping from UI actions to Phase 05 API contracts.
* [**SCREEN-API-DATA-MATRIX.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/SCREEN-API-DATA-MATRIX.md) — Full Screen $\rightarrow$ API $\rightarrow$ DB Entity $\rightarrow$ AI Subsystem traceability.
* [**FRONTEND-SECURITY-ARCHITECTURE.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/FRONTEND-SECURITY-ARCHITECTURE.md) — Zero-secret client invariants, DOMPurify, and CSP header policy.
* [**FRONTEND-PRIVACY-ARCHITECTURE.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/FRONTEND-PRIVACY-ARCHITECTURE.md) — Unbundled consent UX, biometric privacy, and account erasure.
* [**ACCESSIBILITY-ARCHITECTURE.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/ACCESSIBILITY-ARCHITECTURE.md) — WCAG 2.2 AA targets, focus rings, and ARIA live regions.
* [**RESPONSIVE-BEHAVIOR-SPEC.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/RESPONSIVE-BEHAVIOR-SPEC.md) — Mobile, tablet, and desktop viewport transformations.
* [**FRONTEND-PERFORMANCE-ARCHITECTURE.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/FRONTEND-PERFORMANCE-ARCHITECTURE.md) — Core Web Vitals targets, code splitting, and Web Worker offloading.
* [**FRONTEND-OBSERVABILITY.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/FRONTEND-OBSERVABILITY.md) — Privacy-safe telemetry events and before-send scrubber rules.
* [**FRONTEND-TESTING-STRATEGY.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/FRONTEND-TESTING-STRATEGY.md) — Multi-tier test pyramid and the 17 critical E2E user journeys.
* [**FRONTEND-REQUIREMENT-TRACEABILITY.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/FRONTEND-REQUIREMENT-TRACEABILITY.md) — Full requirement traceability from PRD to UI components and tests.
* [**PHASE-06-OPEN-DECISIONS.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/PHASE-06-OPEN-DECISIONS.md) — Active open decisions registry (DEC-004, DEC-010, DEC-014–016).
* [**PHASE-06-CONTRADICTION-AUDIT.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/PHASE-06-CONTRADICTION-AUDIT.md) — Cross-phase contradiction audit across all baseline documents.
* [**PHASE-06-RISK-REGISTER.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/PHASE-06-RISK-REGISTER.md) — Quantified frontend risk register with pre/post mitigation scores.
* [**PHASE-06-IMPLEMENTATION-READINESS.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/PHASE-06-IMPLEMENTATION-READINESS.md) — Engineering handoff readiness assessment and checklists.
* [**PHASE-06-TRUTH-AUDIT.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/PHASE-06-TRUTH-AUDIT.md) — Truth status classifications across all frontend specifications.
* [**PHASE-06-FINAL-REPORT.md**](file:///D:/Project%20Aayurface/docs/engineering/frontend/PHASE-06-FINAL-REPORT.md) — Phase 06 Final Gate Report & 42-section self-audit certification.

### Architecture Decision Records (`adr/`)
1. [`ADR-FE-001-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/frontend/adr/ADR-FE-001-architecture.md)
2. [`ADR-FE-002-routing.md`](file:///D:/Project%20Aayurface/docs/engineering/frontend/adr/ADR-FE-002-routing.md)
3. [`ADR-FE-003-state-management.md`](file:///D:/Project%20Aayurface/docs/engineering/frontend/adr/ADR-FE-003-state-management.md)
4. [`ADR-FE-004-server-state-management.md`](file:///D:/Project%20Aayurface/docs/engineering/frontend/adr/ADR-FE-004-server-state-management.md)
5. [`ADR-FE-005-design-system.md`](file:///D:/Project%20Aayurface/docs/engineering/frontend/adr/ADR-FE-005-design-system.md)
6. [`ADR-FE-006-typography.md`](file:///D:/Project%20Aayurface/docs/engineering/frontend/adr/ADR-FE-006-typography.md)
7. [`ADR-FE-007-responsive-strategy.md`](file:///D:/Project%20Aayurface/docs/engineering/frontend/adr/ADR-FE-007-responsive-strategy.md)
8. [`ADR-FE-008-accessibility.md`](file:///D:/Project%20Aayurface/docs/engineering/frontend/adr/ADR-FE-008-accessibility.md)
9. [`ADR-FE-009-camera-ux.md`](file:///D:/Project%20Aayurface/docs/engineering/frontend/adr/ADR-FE-009-camera-ux.md)
10. [`ADR-FE-010-analysis-progress-ux.md`](file:///D:/Project%20Aayurface/docs/engineering/frontend/adr/ADR-FE-010-analysis-progress-ux.md)
11. [`ADR-FE-011-confidence-ux.md`](file:///D:/Project%20Aayurface/docs/engineering/frontend/adr/ADR-FE-011-confidence-ux.md)
12. [`ADR-FE-012-explainability-ux.md`](file:///D:/Project%20Aayurface/docs/engineering/frontend/adr/ADR-FE-012-explainability-ux.md)
13. [`ADR-FE-013-multilingual-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/frontend/adr/ADR-FE-013-multilingual-architecture.md)
14. [`ADR-FE-014-frontend-security-boundary.md`](file:///D:/Project%20Aayurface/docs/engineering/frontend/adr/ADR-FE-014-frontend-security-boundary.md)
15. [`ADR-FE-015-performance-strategy.md`](file:///D:/Project%20Aayurface/docs/engineering/frontend/adr/ADR-FE-015-performance-strategy.md)

### Architectural Mermaid Diagrams (`diagrams/`)
* [`01-frontend-system-context.mmd`](file:///D:/Project%20Aayurface/docs/engineering/frontend/diagrams/01-frontend-system-context.mmd)
* [`02-frontend-module-architecture.mmd`](file:///D:/Project%20Aayurface/docs/engineering/frontend/diagrams/02-frontend-module-architecture.mmd)
* [`03-route-architecture.mmd`](file:///D:/Project%20Aayurface/docs/engineering/frontend/diagrams/03-route-architecture.mmd)
* [`04-screen-navigation-flow.mmd`](file:///D:/Project%20Aayurface/docs/engineering/frontend/diagrams/04-screen-navigation-flow.mmd)
* [`05-authenticated-app-shell.mmd`](file:///D:/Project%20Aayurface/docs/engineering/frontend/diagrams/05-authenticated-app-shell.mmd)
* [`06-onboarding-flow.mmd`](file:///D:/Project%20Aayurface/docs/engineering/frontend/diagrams/06-onboarding-flow.mmd)
* [`07-consent-flow.mmd`](file:///D:/Project%20Aayurface/docs/engineering/frontend/diagrams/07-consent-flow.mmd)
* [`08-capture-ux-flow.mmd`](file:///D:/Project%20Aayurface/docs/engineering/frontend/diagrams/08-capture-ux-flow.mmd)
* [`09-analysis-ux-flow.mmd`](file:///D:/Project%20Aayurface/docs/engineering/frontend/diagrams/09-analysis-ux-flow.mmd)
* [`10-results-explainability-flow.mmd`](file:///D:/Project%20Aayurface/docs/engineering/frontend/diagrams/10-results-explainability-flow.mmd)
* [`11-state-management-flow.mmd`](file:///D:/Project%20Aayurface/docs/engineering/frontend/diagrams/11-state-management-flow.mmd)
* [`12-api-integration-flow.mmd`](file:///D:/Project%20Aayurface/docs/engineering/frontend/diagrams/12-api-integration-flow.mmd)
* [`13-error-recovery-flow.mmd`](file:///D:/Project%20Aayurface/docs/engineering/frontend/diagrams/13-error-recovery-flow.mmd)
* [`14-responsive-layout-flow.mmd`](file:///D:/Project%20Aayurface/docs/engineering/frontend/diagrams/14-responsive-layout-flow.mmd)
* [`15-voice-flow.mmd`](file:///D:/Project%20Aayurface/docs/engineering/frontend/diagrams/15-voice-flow.mmd)
* [`16-history-progress-flow.mmd`](file:///D:/Project%20Aayurface/docs/engineering/frontend/diagrams/16-history-progress-flow.mmd)
* [`17-report-share-flow.mmd`](file:///D:/Project%20Aayurface/docs/engineering/frontend/diagrams/17-report-share-flow.mmd)
* [`18-frontend-security-boundary.mmd`](file:///D:/Project%20Aayurface/docs/engineering/frontend/diagrams/18-frontend-security-boundary.mmd)
