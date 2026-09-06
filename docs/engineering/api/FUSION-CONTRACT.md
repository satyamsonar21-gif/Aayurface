# Internal Contract: Multimodal Fusion Engine
## Mathematical Vector Fusion, Harmonic Agreement & Low-Agreement Protocols

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Multimodal Fusion & Decision Intelligence  
**Status:** `HYPOTHESIS / PROPOSED (REQUIRES EMPIRICAL VALIDATION)`  
**Authority:** AI Platform Architect, Principal Backend Architect, Research Systems Analyst  

---

## 1. Mathematical Fusion Formulation

The multimodal fusion engine calculates the composite dosha vector $\vec{D}_{\text{fused}} = \begin{pmatrix} V_{\text{fused}} \\ P_{\text{fused}} \\ K_{\text{fused}} \end{pmatrix}$ via a convex linear combination of three normalized modality vectors:

$$\vec{D}_{\text{fused}} = w_1 \vec{D}_{\text{visual}} + w_2 \vec{D}_{\text{quiz}} + w_3 \vec{D}_{\text{lifestyle}}$$

### Initial Proposed Weight Configuration:
* $w_1 = 0.40$ (Computer Vision Facial Lakshana Vector)
* $w_2 = 0.35$ (Constitutional Intake Questionnaire Vector)
* $w_3 = 0.25$ (Dynamic Lifestyle & Environmental Context Vector)
* **Invariant:** $w_1 + w_2 + w_3 = 1.00$
* **Status Classification:** **`HYPOTHESIS / PROPOSED INITIAL CONFIGURATION (REQUIRES VALIDATION)`**

---

## 2. Harmonic Agreement Index ($A$) Calculation

To quantify cross-modality consensus without fabricating artificial certainty:

$$A = 1 - \frac{1}{\sqrt{2}} \cdot \frac{\|\vec{D}_{\text{visual}} - \vec{D}_{\text{quiz}}\| + \|\vec{D}_{\text{visual}} - \vec{D}_{\text{lifestyle}}\| + \|\vec{D}_{\text{quiz}} - \vec{D}_{\text{lifestyle}}\|}{3}$$

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HARMONIC AGREEMENT INDEX GATING                          │
├───────────────────────┬─────────────────────────────────────────────────────┤
│ High Agreement        │ A >= 0.80  ──► High Calibrated Confidence (80–95%)  │
│ Moderate Agreement    │ 0.60 <= A < 0.80 ──► Moderate Confidence (60–79%)   │
│ Low Agreement / Clash │ A < 0.60   ──► LOW_AGREEMENT State (Confidence <60%)│
└───────────────────────┴─────────────────────────────────────────────────────┘
```

---

## 3. The Low-Agreement Contract & Safeguards

When modality inputs severely diverge ($A < 0.60$):

```typescript
export const LowAgreementResolutionSchema = z.object({
  agreementIndex: z.number().min(0.0).max(0.599),
  agreementState: z.literal('LOW_AGREEMENT'),
  calibratedConfidence: z.number().min(30.0).max(59.9), // Bounded below 60%
  userGuidanceMessage: z.string(),
  recommendationPolicy: z.literal('RESTRICTED_SAFE_LIFESTYLE_ONLY'),
  suggestRetake: z.boolean(),
  disagreementAnalysis: z.object({
    visualPrimary: z.enum(['VATA', 'PITTA', 'KAPHA']),
    quizPrimary: z.enum(['VATA', 'PITTA', 'KAPHA']),
    divergenceExplanation: z.string()
  })
}).strict();
```

### Mandatory Low-Agreement Operational Rules:
1. **Confidence Capped Below 60%:** The system must never return High or Moderate confidence when modalities clash.
2. **Generative Herbal Suppression:** Generative specific herbal recipes are suppressed; only verified standard lifestyle and dietary habits are recommended.
3. **Transparent User Communication:** The UI highlights the divergence (e.g., *"Your facial scan observed Pitta warmth, but your constitutional questionnaire reflects Vata dryness. We have tailored a gentle, dual-balancing routine."*).
