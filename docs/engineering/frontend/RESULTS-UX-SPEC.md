# AayurFace — UX Specification: Assessment Results
## Doshic Balance Presentation, Visual Lakshanas & Editorial Summary

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Domain:** Analysis Results & Insights  
**Status:** `TARGET UX SPECIFICATION (REQUIRES IMPLEMENTATION)`  
**Authority:** Staff UX Engineer, Ayurvedic Domain Analyst  

---

## 1. Information Hierarchy of the Results Screen

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    RESULTS SCREEN INFORMATION HIERARCHY                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. Editorial Header ──► Date, Dominant Dosha Tendency, Calibrated Confidence│
│ 2. Tri-Dosha Balance ─► Segmented visual gauge (Vata %, Pitta %, Kapha %)   │
│ 3. Key Observations ──► 4 Physical Lakshanas (Cheek Warmth, Melanin, Texture)│
│ 4. Transparent Reasoning ─► Brief narrative synthesis connecting observations│
│ 5. Action Bar ───────► "Explore Personalized Routine" (Primary CTA)         │
│                        "View Explainability & Citations" (Secondary CTA)    │
│                        "Download PDF Summary" (Tertiary Action)             │
│ 6. Mandatory Notice ──► Prominent Non-Diagnostic Medical Boundary Box       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Non-Diagnostic Medical Boundary Notice

Every results screen renders an un-dismissible, high-contrast disclaimer panel:

> [!NOTE]
> **Ayurvedic Wellness Notice:** AayurFace provides holistic Ayurvedic constitutional assessments (*Prakriti/Vikriti*) and lifestyle guidance. This assessment is **NOT** a medical diagnosis of skin disease (e.g., rosacea, dermatitis, acne vulgaris). Consult a licensed medical doctor or certified Ayurvedic Vaidya for medical treatments.
