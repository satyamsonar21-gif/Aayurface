# Internal Contract: Ayurvedic Intelligence Engine
## Classical Doshic Heuristics, Prakriti/Vikriti Mapping & Boundary Constraints

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Ayurvedic Domain Intelligence  
**Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`  
**Authority:** Ayurvedic Knowledge Systems Analyst, AI Platform Architect  

---

## 1. Subsystem Purpose & Theoretical Mapping

The Ayurvedic Intelligence Engine transforms raw multimodal input vectors into coherent Ayurvedic constitutional and state assessments (*Prakriti* / Baseline Constitution and *Vikriti* / Current State of Imbalance):

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                 AYURVEDIC INTELLIGENCE ENGINE MAPPING                       │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ 1. Questionnaire Inputs              │ Maps to Prakriti (Inherent baseline) │
│ 2. Visual Facial Lakshanas           │ Maps to Vikriti (Current skin state) │
│ 3. Lifestyle & Environmental Inputs  │ Maps to Hetu (Causative influences)  │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 2. Input & Output Contract Specification

```typescript
export const AyurvedicIntelligenceInputSchema = z.object({
  analysisId: z.string().uuid(),
  visualTendencyVector: z.object({
    vata: z.number().min(0).max(100),
    pitta: z.number().min(0).max(100),
    kapha: z.number().min(0).max(100)
  }),
  intakeTendencyVector: z.object({
    vata: z.number().min(0).max(100),
    pitta: z.number().min(0).max(100),
    kapha: z.number().min(0).max(100)
  }),
  lifestyleContext: z.object({
    sleepHours: z.number(),
    stressLevel: z.string(),
    currentSeason: z.string(),
    currentClimate: z.string(),
    digestionRegularity: z.string()
  })
}).strict();

export const AyurvedicIntelligenceOutputSchema = z.object({
  analysisId: z.string().uuid(),
  prakritiBaseline: z.object({
    primaryDosha: z.enum(['VATA', 'PITTA', 'KAPHA']),
    secondaryDosha: z.enum(['VATA', 'PITTA', 'KAPHA']).optional(),
    constitutionType: z.enum(['MONO_DOSHIC', 'DUAL_DOSHIC', 'TRIDOSHIC'])
  }),
  vikritiCurrentImbalance: z.object({
    elevatedDosha: z.enum(['VATA', 'PITTA', 'KAPHA']),
    severityLevel: z.enum(['MILD', 'MODERATE', 'PRONOUNCED']),
    dominantGunas: z.array(z.string()).min(1) // e.g. ['Ushna / Hot', 'Tikshna / Sharp']
  }),
  classicalReasoningSummary: z.string().min(20),
  contraindicationWarnings: z.array(z.string()),
  limitations: z.string()
}).strict();
```
