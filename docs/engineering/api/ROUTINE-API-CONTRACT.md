# API Contract: Dinacharya Daily Routines & Tracking
## Active Routine Scheduling, Item Management & Idempotent Habit Logging

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Dinacharya Routine Management  
**Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`  
**Authority:** Principal Backend Architect, UX Architect  

---

## 1. API-ROU-001: Get Active Routine (`GET /api/v1/routines/active`)

* **HTTP Method:** `GET`
* **Path:** `/api/v1/routines/active`
* **Actor:** Authenticated User (`auth.uid()`)
* **Database Query:** Uses partial index `idx_routines_user_active` for sub-2ms loading.

### Success Response (`200 OK`)

```json
{
  "data": {
    "routineId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f8a",
    "title": "Personalized Pitta-Pacifying Dinacharya",
    "isActive": true,
    "items": [
      {
        "id": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f8b",
        "title": "Rose Water Facial Mist",
        "category": "SKINCARE",
        "timeOfDay": "MORNING",
        "targetTime": "07:30",
        "isCompletedToday": true,
        "currentStreakDays": 5
      },
      {
        "id": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f8c",
        "title": "Sandalwood Lepa Application",
        "category": "TREATMENT",
        "timeOfDay": "EVENING",
        "targetTime": "20:00",
        "isCompletedToday": false,
        "currentStreakDays": 4
      }
    ]
  },
  "meta": {
    "requestId": "req_rou_01",
    "timestamp": "2026-09-03T20:30:00.030Z"
  }
}
```

---

## 2. API-ROU-003: Log Daily Ritual Completion (`POST /api/v1/routines/items/:id/track`)

* **HTTP Method:** `POST`
* **Path:** `/api/v1/routines/items/:id/track`
* **Actor:** Authenticated User (`auth.uid()`)
* **Idempotency Guarantee:** Backed by database unique constraint `UNIQUE (user_id, routine_item_id, completed_date)`. Repeated requests for the same date are idempotent.

### Request Body & Zod Schema

```typescript
export const TrackRoutineItemSchema = z.object({
  completedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD (Client local date)
  isCompleted: z.boolean(),
  notes: z.string().max(200).optional()
}).strict();
```

### Success Response (`200 OK`)

```json
{
  "data": {
    "routineItemId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f8b",
    "completedDate": "2026-09-03",
    "isCompleted": true,
    "currentStreakDays": 6,
    "loggedAt": "2026-09-03T20:32:00.000Z"
  },
  "meta": {
    "requestId": "req_rou_track_01",
    "timestamp": "2026-09-03T20:32:00.050Z"
  }
}
```
