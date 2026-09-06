# AayurFace — Frontend Architecture Specification
## Target Navigation Architecture & Shell Hierarchy

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Date:** 2026-09-03  
**Status:** TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)  
**Authority:** Staff UX Engineer, Interaction Designer  

---

## 1. Responsive Navigation Topology

The application dynamically adapts its navigation shell across viewport breakpoints:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      NAVIGATION SHELL BY BREAKPOINT                         │
├───────────────────────┬─────────────────────────────────────────────────────┤
│ Mobile (< 768px)      │ TopBar (Brand + Profile) + BottomNav (5 Core Tabs)  │
│ Tablet (768px–1023px) │ TopBar (Brand + Actions) + Collapsible Rail Nav     │
│ Desktop (>= 1024px)   │ Persistent Left Sidebar (260px) + Header Bar        │
└───────────────────────┴─────────────────────────────────────────────────────┘
```

---

## 2. Core Navigation Items & Tab Mapping

| Navigation Item | Target Path | Desktop Sidebar Icon | Mobile BottomNav Position | Required Role / State |
|---|---|---|---|---|
| **Dashboard / Home** | `/dashboard` | `LayoutDashboard` | Tab 1 (Leftmost) | Authenticated + Onboarded |
| **Daily Routine** | `/routine` | `CalendarCheck` | Tab 2 | Authenticated + Onboarded |
| **New Facial Scan** | `/analyze/capture` | `Camera` (Prominent Pill)| Tab 3 (Center Action) | Authenticated + Biometric Consent |
| **Scan History** | `/history` | `History` | Tab 4 | Authenticated + Onboarded |
| **Longitudinal Progress**| `/progress`| `TrendingUp` | Desktop Sidebar Only | Authenticated + Onboarded |
| **Ayurvedic Voice Guide**| `/voice` | `Sparkles` / `Mic` | Tab 5 (Rightmost) | Authenticated + Onboarded |
| **Profile & Privacy** | `/profile` | `User` | Header Avatar Menu | Authenticated |
