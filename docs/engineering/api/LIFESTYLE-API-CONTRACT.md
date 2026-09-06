# API Contract: Dynamic Lifestyle Context
## Lifestyle, Sleep, Stress & Environmental Context Contracts

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Lifestyle & Environmental Inputs  
**Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`  
**Authority:** Principal Backend Architect, Ayurvedic Domain Analyst  

---

## 1. API-LIFE-001: Record Lifestyle Context (`POST /api/v1/lifestyle/contexts`)

* **HTTP Method:** `POST`
* **Path:** `/api/v1/lifestyle/contexts`
* **Actor:** Authenticated User (`auth.uid()`)
* **Purpose:** Captures dynamic lifestyle variables feeding the multimodal fusion engine.

### Request Body & Zod Schema

```typescript
export const LifestyleContextSchema = z.object({
  sleepHours: z.number().min(0).max(24),
  stressLevel: z.enum(['LOW', 'MODERATE', 'HIGH', 'SEVERE']),
  dietaryHabits: z.enum(['VEGETARIAN', 'VEGAN', 'NON_VEGETARIAN', 'AYURVEDIC_SATTVIC', 'MIXED']),
  waterIntakeLiters: z.number().min(0).max(10).optional(),
  currentClimate: z.enum(['HOT_HUMID', 'HOT_DRY', 'COLD_DRY', 'COLD_WET', 'TEMPERATE']),
  currentSeason: z.enum(['VASANTA_SPRING', 'GRISHMA_SUMMER', 'VARSHA_MONSOON', 'SHARAD_AUTUMN', 'HEMANTA_WINTER', 'SHISHIRA_LATE_WINTER']),
  digestionRegularity: z.enum(['IRREGULAR_VISHAMA', 'INTENSE_TIKSHNA', 'SLOW_MANDA', 'BALANCED_SAMA'])
}).strict();
```

### Success Response (`201 Created`)

```json
{
  "data": {
    "contextId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f85",
    "sleepHours": 7.5,
    "stressLevel": "MODERATE",
    "currentSeason": "VARSHA_MONSOON",
    "recordedAt": "2026-09-03T20:31:00.000Z"
  },
  "meta": {
    "requestId": "req_life_01",
    "timestamp": "2026-09-03T20:31:00.050Z"
  }
}
```

---

## 2. API-LIFE-002: Get Latest Lifestyle Context (`GET /api/v1/lifestyle/contexts/latest`)

* **HTTP Method:** `GET`
* **Path:** `/api/v1/lifestyle/contexts/latest`
* **Actor:** Authenticated User (`auth.uid()`)
* **Database Query:** `SELECT * FROM lifestyle_contexts WHERE user_id = auth.uid() ORDER BY recorded_at DESC LIMIT 1`

### Success Response (`200 OK`)

```json
{
  "data": {
    "contextId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f85",
    "sleepHours": 7.5,
    "stressLevel": "MODERATE",
    "currentClimate": "HOT_HUMID",
    "currentSeason": "VARSHA_MONSOON",
    "digestionRegularity": "INTENSE_TIKSHNA",
    "recordedAt": "2026-09-03T20:31:00.000Z"
  },
  "meta": {
    "requestId": "req_life_latest_01",
    "timestamp": "2026-09-03T20:31:00.060Z"
  }
}
```
