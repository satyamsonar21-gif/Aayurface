# API Contract: User Onboarding State Machine
## Onboarding Step Progression, Resume & Completion Contracts

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Onboarding & User Progression  
**Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`  
**Authority:** Principal Product Engineer, UX Architect, Backend Architect  

---

## 1. The 8-Stage Onboarding Finite State Machine (FSM)

```text
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ NOT_STARTED  │ ──► │ LANGUAGE     │ ──► │ CONSENT      │ ──► │ PROFILE      │
│ User created │     │ Select en/hi │     │ Biometric opt│     │ Age / Gender │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                                       │
┌──────────────┐     ┌──────────────┐     ┌──────────────┐             │
│ COMPLETED    │ ◄── │ READY        │ ◄── │ LIFESTYLE    │ ◄───────────┘
│ Home active  │     │ Summary view │     │ Sleep/Stress │     QUESTIONNAIRE
└──────────────┘     └──────────────┘     └──────────────┘     15 Questions
```

### Valid State Transitions:
1. `NOT_STARTED` $\rightarrow$ `LANGUAGE`
2. `LANGUAGE` $\rightarrow$ `CONSENT`
3. `CONSENT` $\rightarrow$ `PROFILE`
4. `PROFILE` $\rightarrow$ `QUESTIONNAIRE`
5. `QUESTIONNAIRE` $\rightarrow$ `LIFESTYLE`
6. `LIFESTYLE` $\rightarrow$ `READY`
7. `READY` $\rightarrow$ `COMPLETED`

---

## 2. API-ONB-001: Get Onboarding State (`GET /api/v1/onboarding/state`)

* **HTTP Method:** `GET`
* **Path:** `/api/v1/onboarding/state`
* **Actor:** Authenticated User (`auth.uid()`)
* **Purpose:** Enables seamless onboarding resumption if a user drops off mid-flow.

### Success Response (`200 OK`)

```json
{
  "data": {
    "currentState": "QUESTIONNAIRE",
    "completedSteps": ["LANGUAGE", "CONSENT", "PROFILE"],
    "nextStep": "QUESTIONNAIRE",
    "isCompleted": false,
    "stepProgressPercentage": 50,
    "lastUpdated": "2026-09-03T19:45:00.000Z"
  },
  "meta": {
    "requestId": "req_onb_01",
    "timestamp": "2026-09-03T20:30:00.050Z"
  }
}
```

---

## 3. API-ONB-002: Complete Onboarding (`POST /api/v1/onboarding/complete`)

* **HTTP Method:** `POST`
* **Path:** `/api/v1/onboarding/complete`
* **Actor:** Authenticated User (`auth.uid()`)
* **Preconditions:**
  * Active `FACIAL_BIOMETRIC_PROCESSING` and `WELLNESS_DATA_PROCESSING` consents exist in `consents`.
  * Completed `questionnaire_responses` row exists.
  * Valid `lifestyle_contexts` row exists.

### Success Response (`200 OK`)

```json
{
  "data": {
    "onboardingCompleted": true,
    "completedAt": "2026-09-03T20:31:00.000Z",
    "redirectUrl": "/home"
  },
  "meta": {
    "requestId": "req_onb_complete_01",
    "timestamp": "2026-09-03T20:31:00.100Z"
  }
}
```
