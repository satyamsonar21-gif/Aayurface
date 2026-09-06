# Internal Contract: Computer Vision Feature Extraction
## Structured Visual Observables, Feature Scales & Non-Diagnostic Constraints

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Computer Vision  
**Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`  
**Authority:** Computer Vision Architect, AI Platform Architect  

---

## 1. Input Contract: Computer Vision Extractor

```typescript
export const CVExtractorInputSchema = z.object({
  analysisId: z.string().uuid(),
  imageStoragePath: z.string().regex(/^facial-captures\/[a-f0-9-]+\/[a-f0-9-]+\.jpg$/),
  captureMetadata: z.object({
    deviceType: z.enum(['MOBILE', 'DESKTOP', 'TABLET']),
    cameraResolution: z.string()
  }),
  qualityMetrics: z.object({
    lightingScore: z.number().min(0).max(100),
    blurVariance: z.number().min(0),
    meshConfidence: z.number().min(0).max(1.0)
  }),
  modelVersion: z.string().default('v1.2.0')
}).strict();

export type CVExtractorInput = z.infer<typeof CVExtractorInputSchema>;
```

---

## 2. Output Contract: Structured Visual Observables

```typescript
export const VisualObservableItemSchema = z.object({
  featureKey: z.enum([
    'ERYTHEMA_WARMTH_INDEX',
    'MELANIN_EVENNESS_INDEX',
    'SURFACE_TEXTURE_ROUGHNESS',
    'VISIBLE_DRYNESS_SCORE',
    'SEBUM_LUSTER_SCORE'
  ]),
  scalarValue: z.number().min(0.0).max(1.0),
  unitScale: z.string(), // e.g. "Normalized [0, 1] derived from CIELAB a* / GLCM"
  confidenceScore: z.number().min(0.0).max(100.0),
  extractedFromRoi: z.enum(['FOREHEAD', 'LEFT_CHEEK', 'RIGHT_CHEEK', 'NASAL_BRIDGE', 'FULL_FACE']),
  ayurvedicCorrelation: z.enum(['PITTA_HEAT', 'VATA_ROUGHNESS_DRYNESS', 'KAPHA_MOISTURE_OILINESS', 'BALANCED']),
  limitations: z.string()
});

export const CVExtractorOutputSchema = z.object({
  analysisId: z.string().uuid(),
  visionModelVersion: z.string(),
  extractedObservables: z.array(VisualObservableItemSchema).min(3),
  doshicVisualTendency: z.object({
    vataTendency: z.number().min(0.0).max(100.0),
    pittaTendency: z.number().min(0.0).max(100.0),
    kaphaTendency: z.number().min(0.0).max(100.0)
  }).refine(d => Math.abs((d.vataTendency + d.pittaTendency + d.kaphaTendency) - 100.0) < 0.01, {
    message: "Visual dosha tendencies must sum to 100.0%"
  }),
  extractionDurationMs: z.number().int().min(1)
}).strict();

export type CVExtractorOutput = z.infer<typeof CVExtractorOutputSchema>;
```

---

## 3. Non-Diagnostic Invariants

1. **Zero Medical Pathology Labels:** The computer vision engine is strictly prohibited from emitting diagnostic dermatology terms (`rosacea`, `acne vulgaris`, `melasma`, `eczema`, `seborrheic dermatitis`).
2. **Observable Signal Representation:** All outputs represent observable surface physical characteristics (Lakshanas) mapped to classical Ayurvedic qualities (*Ruksha* / rough, *Snigdha* / unctuous, *Ushna* / warm).
