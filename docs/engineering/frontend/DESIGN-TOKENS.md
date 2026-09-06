# AayurFace — Design System Specification
## Semantic Design Tokens & Theme Specification

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Date:** 2026-09-03  
**Status:** TARGET DESIGN TOKENS (PROPOSED / REQUIRES DESIGN VALIDATION)  
**Authority:** Design Systems Architect, Staff UX Engineer  

---

## 1. Semantic Color Tokens (Light Theme Invariant)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SEMANTIC COLOR TOKEN SPECIFICATION                       │
├───────────────────────────────┬───────────┬─────────────────────────────────┤
│ Semantic Token Name           │ Value     │ Purpose & Usage                 │
├───────────────────────────────┼───────────┼─────────────────────────────────┤
│ `color.background.primary`    │ `#FAF8F5` │ Warm ivory cream page canvas    │
│ `color.background.surface`    │ `#FFFFFF` │ Elevated cards, dialogs, sheets │
│ `color.background.subtle`     │ `#F3EFEA` │ Inset panels, table headers     │
│ `color.brand.primary`         │ `#1E3A2F` │ Deep Forest Green (Primary CTA) │
│ `color.brand.primary.hover`   │ `#152B23` │ Darker Forest Green hover state │
│ `color.brand.secondary`       │ `#6B8E7D` │ Muted Botanical Sage (Accents)  │
│ `color.brand.accent`          │ `#C5A059` │ Restrained Antique Gold (Badges)│
│ `color.text.primary`          │ `#1A1F1C` │ Dark Charcoal (Headings & Body) │
│ `color.text.secondary`        │ `#5C6660` │ Warm Muted Taupe (Subtitles)    │
│ `color.text.tertiary`         │ `#8A948E` │ Captions, metadata, placeholders│
│ `color.border.default`        │ `#E6DFD5` │ Subtle neutral card borders     │
│ `color.border.focus`          │ `#1E3A2F` │ High-visibility focus rings     │
│ `color.status.success`        │ `#2E7D32` │ High agreement, routine complete│
│ `color.status.warning`        │ `#D97706` │ Moderate agreement, retake tip  │
│ `color.status.error`          │ `#C62828` │ Quality failure, validation err │
│ `color.status.info`           │ `#1565C0` │ Educational tooltip notice      │
└───────────────────────────────┴───────────┴─────────────────────────────────┘
```

---

## 2. Spacing & Elevation Tokens

### Spacing Scale (4px / 8px Base Grid):
* `space.1`: `4px`
* `space.2`: `8px`
* `space.3`: `12px`
* `space.4`: `16px`
* `space.6`: `24px`
* `space.8`: `32px`
* `space.12`: `48px`
* `space.16`: `64px`

### Border Radius Scale:
* `radius.sm`: `6px` (Badges, small tags)
* `radius.md`: `10px` (Inputs, buttons)
* `radius.lg`: `16px` (Cards, dialogs)
* `radius.pill`: `9999px` (Status badges, pill buttons)

### Elevation & Box Shadows (Soft Natural Diffusion):
* `shadow.sm`: `0 1px 3px rgba(30, 58, 47, 0.04)`
* `shadow.md`: `0 4px 16px rgba(30, 58, 47, 0.06)`
* `shadow.lg`: `0 8px 30px rgba(30, 58, 47, 0.08)`
* `shadow.focus`: `0 0 0 3px rgba(30, 58, 47, 0.25)`
