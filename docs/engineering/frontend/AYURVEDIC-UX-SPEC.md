# AayurFace — UX Specification: Ayurvedic Knowledge Presentation
## Prakriti vs Vikriti Visualization, Gunas & Authentic Terminology

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Domain:** Ayurvedic Domain Presentation  
**Status:** `TARGET UX SPECIFICATION (REQUIRES IMPLEMENTATION)`  
**Authority:** Ayurvedic Knowledge Systems Analyst, Staff UX Engineer  

---

## 1. Prakriti vs Vikriti Conceptual Separation

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PRAKRITI VS VIKRITI PRESENTATION                         │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ Prakriti (Your Inherent Baseline)    │ Vikriti (Your Current Dynamic State) │
│ • Derived from Constitutional Quiz   │ • Derived from Facial Scan & Weather │
│ • Lifelong constitutional blueprint  │ • Temporary seasonal/lifestyle shift │
│ • Displayed as steady baseline ring  │ • Displayed as current active marker │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 2. Guna (Qualitative Attributes) Chips

Instead of abstract scores, the UI surfaces classical *Gunas* (qualities) to explain skin conditions:
* **Ushna (Warm/Hot):** Indicated by cheek redness $\rightarrow$ Pacified by cooling Chandana (sandalwood).
* **Ruksha (Dry/Rough):** Indicated by micro-texture $\rightarrow$ Pacified by nourishing Ghrita or Sesame oil.
* **Snigdha (Oily/Unctuous):** Indicated by sebum shine $\rightarrow$ Balanced by astringent Triphala lepa.
