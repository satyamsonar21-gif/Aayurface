# AayurFace — Design System Specification
## Spacing System, Grid Foundations & Breakpoints

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Date:** 2026-09-03  
**Status:** TARGET SPACING SPECIFICATION  
**Authority:** Design Systems Architect, Staff UX Engineer  

---

## 1. Grid & Breakpoint Foundations

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    RESPONSIVE BREAKPOINTS & CONTAINERS                      │
├───────────────┬───────────────────┬───────────────────┬─────────────────────┤
│ Breakpoint    │ Min Width         │ Max Container W   │ Layout Columns      │
├───────────────┼───────────────────┼───────────────────┼─────────────────────┤
│ `sm` (Mobile) │ `375px`           │ `100%` (16px pad) │ 1 Column Stream     │
│ `md` (Tablet) │ `768px`           │ `720px`           │ 2 Columns (Balanced)│
│ `lg` (Desktop)│ `1024px`          │ `960px`           │ 3 Columns / Sidebar │
│ `xl` (Wide)   │ `1280px`          │ `1200px`          │ 3 Columns (Spacious)│
│ `2xl` (Max)   │ `1440px`          │ `1360px`          │ Max Centered Canvas │
└───────────────┴───────────────────┴───────────────────┴─────────────────────┘
```

---

## 2. Density Rules & Proportions

* **High Editorial Density:** Dashboard cards maintain generous internal padding (`space.6` / `24px` on desktop, `space.4` / `16px` on mobile).
* **Touch Target Invariant:** All interactive buttons, checkboxes, tabs, and habit items enforce a minimum touch target of **$48 \times 48\text{px}$** on mobile devices.
