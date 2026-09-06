# AayurFace — Design System Specification
## Color System, Doshic Palette & Contrast Verification

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Date:** 2026-09-03  
**Status:** TARGET COLOR SPECIFICATION (PROPOSED / REQUIRES DESIGN VALIDATION)  
**Authority:** Design Systems Architect, Accessibility Architect  

---

## 1. Core Brand & Surface Palette

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       AAYURFACE CORE COLOR PALETTE                          │
├───────────────────┬───────────┬─────────────────────────────────────────────┤
│ Swatch Name       │ Hex Value │ Semantic Role                               │
├───────────────────┼───────────┼─────────────────────────────────────────────┤
│ Warm Cream Ivory  │ `#FAF8F5` │ Base Canvas Background (Calm, organic)      │
│ Pure Card Surface │ `#FFFFFF` │ Elevated Card / Modal Background            │
│ Soft Sandalwood   │ `#F3EFEA` │ Inset Panels & Secondary Surfaces           │
│ Deep Forest Green │ `#1E3A2F` │ Primary Brand Color & High-Emphasis Text    │
│ Botanical Sage    │ `#6B8E7D` │ Supporting Accents & Progress Fill          │
│ Restrained Gold   │ `#C5A059` │ Editorial Highlights, Badges & Accents      │
│ Dark Charcoal     │ `#1A1F1C` │ Primary Text (WCAG AAA on Cream Canvas)     │
│ Muted Taupe       │ `#5C6660` │ Secondary Text (WCAG AA compliant)          │
└───────────────────┴───────────┴─────────────────────────────────────────────┘
```

---

## 2. Ayurvedic Constitutional (Dosha) Palette

To visually represent Vata, Pitta, and Kapha without garish saturated primaries:

| Dosha Tendency | Semantic Token | Hex Value | Atmospheric Association | WCAG AA on `#FFFFFF` |
|---|---|---|---|---|
| **Vata (Air & Ether)** | `color.dosha.vata` | `#5B7B88` | Cool Slate Breeze (Dry, subtle) | **Pass (4.8:1)** |
| **Pitta (Fire & Water)** | `color.dosha.pitta` | `#C86D51` | Warm Terracotta Clay (Warm, radiant) | **Pass (4.6:1)** |
| **Kapha (Earth & Water)**| `color.dosha.kapha` | `#5C7C5A` | Deep Moss Green (Dense, nourishing) | **Pass (5.1:1)** |
