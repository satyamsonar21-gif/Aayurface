# API Contract: Ayurvedic Intake Questionnaire
## Questionnaire Definition, Submission & Historical Version Pinning

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Intake & Constitutional Assessment  
**Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`  
**Authority:** Ayurvedic Knowledge Systems Analyst, Principal Backend Architect  

---

## 1. Version Pinning Invariant

To preserve scientific reproducibility and longitudinal comparability:
1. **Immutable Response Rows:** Completed questionnaire responses are stored as immutable records tied directly to `template_version` (e.g., `'v1.0.0'`).
2. **Zero Retroactive Reinterpretation:** If a new questionnaire version (`v1.1.0`) is deployed with modified question weightings, historical responses are never re-evaluated using the new weights.

---

## 2. API-QNR-001: Get Active Questionnaire Template (`GET /api/v1/questionnaires/active`)

* **HTTP Method:** `GET`
* **Path:** `/api/v1/questionnaires/active`
* **Actor:** Authenticated User
* **Database Entity:** `questionnaire_templates`

### Success Response (`200 OK`)

```json
{
  "data": {
    "templateId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f83",
    "version": "v1.0.0",
    "title": "Prakriti Constitutional Intake",
    "questions": [
      {
        "id": "q1_skin_texture",
        "category": "PHYSICAL_SKIN",
        "questionText": "How would you describe your natural skin texture throughout the year?",
        "options": [
          { "value": "DRY_ROUGH", "label": "Dry, rough, thin, or prone to flaking", "doshicWeights": { "vata": 1.0, "pitta": 0.0, "kapha": 0.0 } },
          { "value": "WARM_SENSITIVE", "label": "Warm, sensitive, prone to redness or breakouts", "doshicWeights": { "vata": 0.0, "pitta": 1.0, "kapha": 0.0 } },
          { "value": "OILY_SMOOTH", "label": "Thick, smooth, oily, well-hydrated", "doshicWeights": { "vata": 0.0, "pitta": 0.0, "kapha": 1.0 } }
        ]
      }
    ]
  },
  "meta": {
    "requestId": "req_qnr_01",
    "timestamp": "2026-09-03T20:30:00.040Z"
  }
}
```

---

## 3. API-QNR-002: Submit Intake Responses (`POST /api/v1/questionnaires/responses`)

* **HTTP Method:** `POST`
* **Path:** `/api/v1/questionnaires/responses`
* **Actor:** Authenticated User (`auth.uid()`)
* **Execution:** Calculates dosha sub-scores ($V_{\text{quiz}}, P_{\text{quiz}}, K_{\text{quiz}}$) and stores immutable row in `questionnaire_responses`.

### Request Body & Zod Schema

```typescript
export const QuestionnaireSubmissionSchema = z.object({
  templateVersion: z.string().regex(/^v\d+\.\d+\.\d+$/),
  answers: z.record(z.string(), z.string()).refine((obj) => Object.keys(obj).length === 15, {
    message: "All 15 constitutional intake questions must be answered."
  })
}).strict();
```

### Success Response (`201 Created`)

```json
{
  "data": {
    "responseId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f84",
    "templateVersion": "v1.0.0",
    "calculatedTendency": {
      "vataPercentage": 25.0,
      "pittaPercentage": 60.0,
      "kaphaPercentage": 15.0,
      "dominantTendency": "PITTA"
    },
    "submittedAt": "2026-09-03T20:31:00.000Z"
  },
  "meta": {
    "requestId": "req_qnr_submit_01",
    "timestamp": "2026-09-03T20:31:00.090Z"
  }
}
```
