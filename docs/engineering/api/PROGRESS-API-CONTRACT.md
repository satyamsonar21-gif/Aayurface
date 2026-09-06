# API Contract: Longitudinal Progress & Checkpoints
## Historical Deltas, Habit Adherence & Multi-Day Progress Checkpoints

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Progress & Longitudinal Intelligence  
**Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`  
**Authority:** Principal Backend Architect, Data Architect  

---

## 1. API-PROG-001: Get Longitudinal Checkpoints (`GET /api/v1/progress/checkpoints`)

* **HTTP Method:** `GET`
* **Path:** `/api/v1/progress/checkpoints`
* **Actor:** Authenticated User (`auth.uid()`)
* **Execution:** Reads precomputed snapshots from `progress_checkpoints` to achieve sub-50ms dashboard loading.

### Success Response (`200 OK`)

```json
{
  "data": {
    "userId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f80",
    "baselineScanDate": "2026-08-01T10:00:00.000Z",
    "currentStreakDays": 14,
    "totalCheckpointsAvailable": 2,
    "checkpoints": [
      {
        "checkpointIntervalDays": 30,
        "checkpointDate": "2026-08-31T10:00:00.000Z",
        "adherenceRatePercentage": 86.7,
        "symptomDeltas": {
          "erythemaWarmthChange": -0.18,
          "surfaceTextureSmoothnessChange": +0.22,
          "perceivedHydrationChange": +0.15
        },
        "overallTrend": "BALANCING_PITTA",
        "summaryNarrative": "Your cheek warmth and redness indicators have decreased by 18% following 30 days of consistent Pitta-pacifying lepa application."
      }
    ]
  },
  "meta": {
    "requestId": "req_prog_01",
    "timestamp": "2026-09-03T20:30:00.050Z"
  }
}
```
