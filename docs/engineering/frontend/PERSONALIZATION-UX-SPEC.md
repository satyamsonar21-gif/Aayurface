# AayurFace — UX Specification: Transparent Personalization
## "Why Am I Seeing This?", Multi-Factor Attribution & Safety Guidance

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Domain:** Personalization & Recommendation UX  
**Status:** `TARGET UX SPECIFICATION (REQUIRES IMPLEMENTATION)`  
**Authority:** Staff UX Engineer, Principal Frontend Architect  

---

## 1. The "Why Am I Seeing This?" Attribution Panel

Every ritual, diet, and skincare card includes a transparent disclosure trigger:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🍃 Sandalwood & Rose Hydrating Lepa                                         │
│ Category: Skincare Ritual | Time: Evening (Twice Weekly)                    │
│                                                                             │
│ [ ? Why am I seeing this recommendation? ] (Click to open disclosure sheet) │
├─────────────────────────────────────────────────────────────────────────────┤
│ Attribution Breakdown:                                                      │
│ • 40% Visual Scan: Cheek warmth (CIELAB a* elevation)                       │
│ • 35% Constitutional Intake: Self-reported sensitivity to sun exposure      │
│ • 25% Environmental Context: High summer ambient temperature (Grishma Ritu) │
│                                                                             │
│ Safety & Contraindications:                                                 │
│ ⚠️ Patch test on inner forearm for 15 minutes prior to first facial use.    │
│ ⚠️ Discontinue immediately if stinging or burning sensation occurs.         │
└─────────────────────────────────────────────────────────────────────────────┘
```
