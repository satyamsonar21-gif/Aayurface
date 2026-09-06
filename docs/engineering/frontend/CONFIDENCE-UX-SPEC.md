# AayurFace — UX Specification: Confidence & Uncertainty Communication
## Honest Uncertainty Presentation, Agreement Badges & Low-Agreement Protocols

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Domain:** AI Transparency & Uncertainty UX  
**Status:** `TARGET UX SPECIFICATION (REQUIRES IMPLEMENTATION)`  
**Authority:** Staff UX Engineer, AI Platform Architect  

---

## 1. Confidence Visual Hierarchy & Copy Standard

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONFIDENCE LEVEL PRESENTATION MATRIX                     │
├────────────────────┬─────────────────────────────┬──────────────────────────┤
│ Confidence Level   │ Visual Badge & Palette      │ User-Facing Copy         │
├────────────────────┼─────────────────────────────┼──────────────────────────┤
│ **HIGH**           │ Pill Badge (Forest Green)   │ "High Confidence"        │
│ (80.0% – 95.0%)    │ `bg-brand-primary`          │ "Your visual scan and    │
│                    │ `text-white`                │ questionnaire strongly   │
│                    │                             │ align."                  │
├────────────────────┼─────────────────────────────┼──────────────────────────┤
│ **MODERATE**       │ Pill Badge (Warm Amber)     │ "Moderate Confidence"    │
│ (60.0% – 79.9%)    │ `bg-status-warning/20`      │ "Clear signals observed, │
│                    │ `text-status-warning`       │ with minor variations    │
│                    │                             │ across lifestyle factors"│
├────────────────────┼─────────────────────────────┼──────────────────────────┤
│ **LOW / DIVERGENT**│ Pill Badge (Subtle Neutral) │ "Mixed Signals Observed" │
│ (30.0% – 59.9%)    │ `bg-background-subtle`      │ "Your scan and quiz      │
│                    │ `text-text-secondary`       │ reflect different doshas;│
│                    │                             │ dual balancing routine." │
└────────────────────┴─────────────────────────────┴──────────────────────────┘
```

---

## 2. Low-Agreement UX Protocol

When the multimodal fusion engine detects conflicting signals ($A < 0.60$):
1. **Zero False Certainty:** The UI explicitly highlights the divergence:
   > *"Your facial scan indicated warmth (Pitta), but your constitutional responses reflect dryness (Vata). We've created a gentle, dual-balancing protocol."*
2. **Generative Herb Suppression:** Specific potent herbal formulations are hidden; only verified, safe standard lifestyle and dietary habits are presented.
3. **Optional Retake CTA:** A non-intrusive action offers: *"Would you like to retake your scan under different lighting?"*
