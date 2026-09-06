# API Contract: Analysis History & Keyset Pagination
## Chronological Assessment History, Date Filtering & Keyset Pagination

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** History & Longitudinal Records  
**Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`  
**Authority:** Principal Backend Architect, Database Architect  

---

## 1. API-HIST-001: Get Historical Analyses (`GET /api/v1/history`)

* **HTTP Method:** `GET`
* **Path:** `/api/v1/history`
* **Actor:** Authenticated User (`auth.uid()`)
* **Pagination Scheme:** **Keyset Cursor Pagination** (B-tree index on `(user_id, created_at DESC)`).
* **Ordering:** Strict descending chronological ordering (`ORDER BY created_at DESC, id DESC`).

### Query Parameters

| Parameter | Type | Default | Max | Description |
|---|---|---|---|---|
| `limit` | Integer | `20` | `50` | Maximum items to return per page. |
| `cursor` | Base64 String | None | N/A | Keyset cursor encoding `(created_at, id)` of the last item. |
| `startDate` | ISO Date String | None | N/A | Filter results created on or after this date. |
| `endDate` | ISO Date String | None | N/A | Filter results created on or before this date. |
| `doshaFilter` | Enum | None | N/A | Filter by dominant dosha (`VATA`, `PITTA`, `KAPHA`). |

### Success Response (`200 OK`)

```json
{
  "data": [
    {
      "id": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f87",
      "dominantDosha": "PITTA",
      "calibratedConfidence": 84.5,
      "confidenceLevel": "HIGH",
      "summary": "Pitta dominant tendency with elevated cheek warmth and sensitivity.",
      "createdAt": "2026-09-03T20:30:05.420Z"
    },
    {
      "id": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f70",
      "dominantDosha": "PITTA",
      "calibratedConfidence": 81.0,
      "confidenceLevel": "HIGH",
      "summary": "Pitta-Vata dual tendency with seasonal monsoon sensitivity.",
      "createdAt": "2026-08-15T10:15:00.000Z"
    }
  ],
  "pagination": {
    "limit": 20,
    "hasNextPage": false,
    "nextCursor": null,
    "totalCountEstimate": 2
  },
  "meta": {
    "requestId": "req_hist_01",
    "timestamp": "2026-09-03T20:30:00.050Z"
  }
}
```
