# AayurFace — Design System Specification
## Typography System, Font Families & Scale Hierarchy

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Date:** 2026-09-03  
**Status:** TARGET TYPOGRAPHY SPECIFICATION  
**Authority:** Design Systems Architect, Staff UX Engineer  

---

## 1. Dual Font Family Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       DUAL FONT FAMILY STRATEGY                             │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ 1. Editorial Display Serif           │ Cormorant Garamond                   │
│    Usage: Hero headings, section     │ Fallback: `Georgia, serif`           │
│    titles, quote cards, shlokas      │ Weights: 400 (Regular), 600 (Semi)   │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ 2. Modern Application Sans           │ Manrope                              │
│    Usage: Body text, UI labels,      │ Fallback: `system-ui, sans-serif`    │
│    buttons, forms, metadata, tables  │ Weights: 400, 500 (Medium), 600, 700 │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 2. Type Scale & Hierarchical Roles

| Role / Token Name | Font Family | Size (px / rem) | Line Height | Letter Spacing | Target Usage |
|---|---|---|---|---|---|
| `type.display.hero` | Cormorant Garamond | `40px` (`2.5rem`) | `1.15` | `-0.02em` | Landing Hero, Assessment Result Title |
| `type.heading.1` | Cormorant Garamond | `32px` (`2.0rem`) | `1.20` | `-0.01em` | Major Section Headings, Screen Titles |
| `type.heading.2` | Cormorant Garamond | `24px` (`1.5rem`) | `1.30` | `0.0em` | Card Group Headings, Dialog Headers |
| `type.heading.3` | Manrope | `18px` (`1.125rem`)| `1.40` | `0.0em` | Sub-card Titles, Routine Headers |
| `type.body.lg` | Manrope | `16px` (`1.0rem`) | `1.60` | `0.0em` | Primary Body Text, Long Explanations |
| `type.body.md` | Manrope | `14px` (`0.875rem`)| `1.50` | `0.01em` | Standard UI Body, Table Cells |
| `type.caption` | Manrope | `12px` (`0.75rem`) | `1.40` | `0.02em` | Timestamps, Metadata, Tooltips |
| `type.label.button` | Manrope (Medium) | `14px` (`0.875rem`)| `1.00` | `0.02em` | Button CTAs, Tab Labels |
| `type.sanskrit.verse`| Cormorant Garamond | `16px` (`1.0rem`) | `1.80` | `0.01em` | Classical Devanagari & IAST Shlokas |
