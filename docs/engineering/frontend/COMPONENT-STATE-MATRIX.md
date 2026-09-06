# AayurFace — Component Architecture Specification
## Component State Matrix & Visual State Taxonomy

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Date:** 2026-09-03  
**Status:** TARGET COMPONENT SPECIFICATION  
**Authority:** Design Systems Architect, Accessibility Architect  

---

## 1. Comprehensive State Matrix

Every interactive component across the design system supports 9 deterministic visual states:

| Component State | Visual Presentation & Token Styling | Cursor & Interaction | Keyboard & Focus Behavior | Screen Reader / ARIA |
|---|---|---|---|---|
| **Default / Idle** | `bg-brand-primary`, `text-white`, `border-transparent` | `cursor-pointer` | Standard tab order | Accessible name announced |
| **Hover** | `bg-brand-primary-hover` (Darker forest green) | `cursor-pointer` | N/A | N/A |
| **Focus Visible** | High-contrast double ring: `shadow-focus` ($3\text{px}$ offset)| `cursor-pointer` | Highlighted ring via `:focus-visible` | Focused element read |
| **Active / Pressed** | Scale transform `scale-[0.98]`, increased shadow | `cursor-pointer` | Maintained focus | Active state |
| **Disabled** | `bg-background-subtle`, `text-text-tertiary`, `opacity-50` | `cursor-not-allowed`| Removed from tab order or `aria-disabled="true"` | Announced as "Disabled" |
| **Loading** | Children hidden; centered `LoadingSpinner` displayed | `cursor-wait` | Interaction blocked | `aria-busy="true"` |
| **Error / Invalid** | `border-status-error`, `text-status-error`, error icon | `cursor-text` | Focus moves to error on submit | `aria-invalid="true"`, `aria-errormessage` |
| **Selected / Active Tab**| `border-b-2 border-brand-primary`, `font-semibold` | `cursor-default` | Active tab item | `aria-selected="true"` |
| **Skeleton Placeholder**| Shimmer animated gradient matching bounding box | `cursor-wait` | Non-focusable | `aria-hidden="true"` |
