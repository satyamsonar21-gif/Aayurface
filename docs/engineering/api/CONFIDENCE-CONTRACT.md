# Internal Contract: Confidence & Uncertainty Engine
## Standardized Confidence Object, Harmonic Agreement Bounds & Limitations

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Confidence & Uncertainty Quantification  
**Status:** `TARGET ARCHITECTURE / PROPOSED (REQUIRES CALIBRATION)`  
**Authority:** AI Platform Architect, Research Systems Analyst  

---

## 1. Universal Confidence Structure

To prevent overconfident hallucinations and maintain scientific honesty across all visual and Ayurvedic outputs, every analysis payload must contain a standardized confidence object:

```typescript
export const ConfidenceObjectSchema = z.object({
  score: z.number().min(0.0).max(100.0), // Continuous percentage
  level: z.enum(['HIGH', 'MODERATE', 'LOW', 'INDETERMINATE']),
  harmonicAgreement: z.number().min(0.0).max(1.0),
  supportingEvidenceCount: z.number().int().min(0),
  modalityAgreementState: z.enum(['HIGH_AGREEMENT', 'MODERATE_AGREEMENT', 'LOW_AGREEMENT']),
  isConfidenceBounded: z.boolean(), // True if capped due to modality clash or low light
  boundingReason: z.string().optional(),
  limitations: z.array(z.string()).min(1),
  calibrationMethodVersion: z.string().default('v1.0.0')
}).strict();

export type ConfidenceObject = z.infer<typeof ConfidenceObjectSchema>;
```

---

## 2. Confidence Level Mapping Matrix

| Level | Score Range | Minimum Harmonic Agreement $A$ | Minimum Classical Citations | User Display Presentation |
|---|---|---|---|---|
| **HIGH** | $80.0\% - 95.0\%$ | $A \ge 0.80$ | $\ge 2$ Classical Chunks | High Confidence indicator (Green badge) |
| **MODERATE** | $60.0\% - 79.9\%$ | $0.60 \le A < 0.80$ | $\ge 1$ Classical Chunk | Moderate Confidence indicator (Amber badge) |
| **LOW** | $30.0\% - 59.9\%$ | $A < 0.60$ OR Low Lighting | $0$ (Fallback Active) | Low Confidence / Dual Imbalance Notice |
| **INDETERMINATE** | $< 30.0\%$ | Quality Gateway Failure | $0$ | Scan Inconclusive; Prompt Retake |

---

## 3. Truth-Status Classification
* **Confidence Structure & Types:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`
* **Score Ranges & Cutoff Points:** `HYPOTHESIS / PROPOSED (REQUIRES EMPIRICAL CALIBRATION)`
