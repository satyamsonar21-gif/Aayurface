# API Contract: Ayurvedic Recommendations
## Grounded Ritual Recommendations, Classical Citations & Routine Adoption

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Recommendations  
**Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`  
**Authority:** Ayurvedic Knowledge Systems Analyst, Principal Backend Architect  

---

## 1. API-REC-001: Get Recommendations for Analysis (`GET /api/v1/analyses/:id/recommendations`)

* **HTTP Method:** `GET`
* **Path:** `/api/v1/analyses/:id/recommendations`
* **Actor:** Authenticated User (`auth.uid()`)
* **Integrity Rule:** Every generative recommendation is strictly foreign-key bound to a verified `knowledge_chunk_id`.

### Success Response (`200 OK`)

```json
{
  "data": {
    "analysisId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f87",
    "recommendations": [
      {
        "id": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f89",
        "category": "SKINCARE_LEPA",
        "title": "Sandalwood & Rose Hydrating Lepa",
        "instructions": "Mix pure Chandana (sandalwood) paste with organic rose water. Apply evenly to cleansed cheeks and forehead for 10 minutes before rinsing with cool water.",
        "frequency": "TWICE_WEEKLY",
        "timeOfDay": "EVENING",
        "contraindications": "Discontinue if sensation of burning occurs. Do not use on broken or infected skin.",
        "classicalCitation": {
          "sourceWork": "Charaka Samhita",
          "sectionReference": "Sutrasthana Adhyaya 5",
          "verseNumbers": "Shloka 18-20",
          "contentSanskrit": "चन्दनं शीतलं हृद्यं दाहपित्तविनाशनम्...",
          "contentEnglish": "Sandalwood is cooling, pleasing to the senses, and pacifies burning sensation and elevated Pitta."
        }
      }
    ]
  },
  "meta": {
    "requestId": "req_rec_01",
    "timestamp": "2026-09-03T20:30:10.100Z"
  }
}
```

---

## 2. API-REC-002: Adopt Recommendations into Active Dinacharya (`POST /api/v1/recommendations/adopt`)

* **HTTP Method:** `POST`
* **Path:** `/api/v1/recommendations/adopt`
* **Actor:** Authenticated User (`auth.uid()`)
* **Execution:** Replaces or updates the user's active `routines` record with the selected ritual items.

### Request Body & Zod Schema

```typescript
export const AdoptRecommendationsSchema = z.object({
  analysisId: z.string().uuid(),
  recommendationItemIds: z.array(z.string().uuid()).min(1),
  routineTitle: z.string().min(1).max(100).default("Personalized Pitta-Pacifying Dinacharya")
}).strict();
```

### Success Response (`201 Created`)

```json
{
  "data": {
    "routineId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f8a",
    "title": "Personalized Pitta-Pacifying Dinacharya",
    "activeItemsCount": 3,
    "isActive": true,
    "adoptedAt": "2026-09-03T20:31:00.000Z"
  },
  "meta": {
    "requestId": "req_rec_adopt_01",
    "timestamp": "2026-09-03T20:31:00.120Z"
  }
}
```
