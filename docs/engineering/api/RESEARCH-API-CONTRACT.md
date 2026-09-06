# API Contract: Expert Research & Evaluation Enclave (Post-MVP)
## Double-Blind Annotations, Inter-Rater Reliability & Expert Reference Labels

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Research & Algorithmic Evaluation  
**Status:** `TARGET ARCHITECTURE / POST-MVP (REQUIRES VALIDATION)`  
**Authority:** Research Data Architect, Principal Backend Architect  
**Scope Notice:** Research dataset infrastructure is deferred to **POST-MVP (Milestone 18)** per DEC-010.  

---

## 1. Architectural Research Isolation

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       EXPERT RESEARCH PIPELINE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│   [ Certified Ayurvedic Practitioner Worklist ]                             │
│   • Views De-Identified Masked ROIs (Cheeks/Forehead) via Isolated Schema   │
│   • Submits Independent Doshic Assessment (Vata%, Pitta%, Kapha%)           │
│   • Submission Locks Immediately (is_locked = TRUE)                         │
│                     │                                                       │
│                     ▼ POST /api/v1/research/annotations                     │
│   [ Statistical Agreement & Consensus Adjudication Engine ]                │
│   • Calculates Inter-Rater Reliability (Fleiss' Kappa κ)                    │
│   • κ >= 0.70 ──► Computes Mean Vector ──► Derives Expert Reference Label  │
│   • κ < 0.70  ──► Escalates to Senior Ayurvedic Adjudicator                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. API-RES-003: Submit Expert Annotation (`POST /api/v1/research/annotations`)

* **HTTP Method:** `POST`
* **Path:** `/api/v1/research/annotations`
* **Actor:** Certified Ayurvedic Practitioner (`practitioner_id`)
* **Auth Requirement:** Dedicated Practitioner Credential (Role: `practitioner`)
* **Database Entity:** `research.expert_annotations`

### Request Body & Zod Schema

```typescript
export const ExpertAnnotationSchema = z.object({
  subjectId: z.string().uuid(),
  vataPercentage: z.number().min(0).max(100),
  pittaPercentage: z.number().min(0).max(100),
  kaphaPercentage: z.number().min(0).max(100),
  primaryImbalance: z.enum(['VATA', 'PITTA', 'KAPHA', 'VATA_PITTA', 'PITTA_KAPHA', 'VATA_KAPHA', 'TRIDOSHIC']),
  surfaceQualities: z.array(z.string()).min(1),
  confidenceLevel: z.enum(['HIGH', 'MEDIUM', 'LOW'])
}).refine((data) => Math.abs((data.vataPercentage + data.pittaPercentage + data.kaphaPercentage) - 100.0) < 0.01, {
  message: "Doshic percentages must sum to 100.0%"
}).strict();
```

### Success Response (`201 Created`)

```json
{
  "data": {
    "annotationId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f90",
    "subjectId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f91",
    "isLocked": true,
    "submittedAt": "2026-09-03T20:31:00.000Z"
  },
  "meta": {
    "requestId": "req_res_ann_01",
    "timestamp": "2026-09-03T20:31:00.050Z"
  }
}
```
