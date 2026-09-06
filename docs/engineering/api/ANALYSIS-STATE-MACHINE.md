# Operational Contract: Analysis Finite State Machine
## 12-Stage Analysis Lifecycle, Valid Transitions & Error Branches

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** State Machines & Execution Lifecycle  
**Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`  
**Authority:** Principal Backend Architect, AI Platform Architect  

---

## 1. The 12-Stage Analysis State Machine

```text
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 1. QUEUED    │ ──► │ 2. VALIDATING│ ──► │ 3. PREPROCESS│ ──► │ 4. CV_PROCESS│
│ Job in queue │     │ Consent/Auth │     │ S3 download  │     │ Feature run  │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                                       │
┌──────────────┐     ┌──────────────┐     ┌──────────────┐             │
│ 8. RAG_RETRIV│ ◄── │ 7. CONFIDENCE│ ◄── │ 6. FUSION    │ ◄───────────┘
│ pgvector hit │     │ Harmonic A   │     │ 40/35/25 calc│     5. AYURVEDIC
└──────┬───────┘     └──────────────┘     └──────────────┘     Prakriti/Vikriti
       │
       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 9. EXPLANATN │ ──► │ 10. SAFETY   │ ──► │ 11. BUILD    │ ──► │ 12. COMPLETED│
│ LLM reasoning│     │ Zod & Regex  │     │ 3NF Relational│    │ Terminal OK  │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

---

## 2. Transition Rules & Validity Matrix

| From State | To State | Trigger Condition | Valid? | Error on Illegal Attempt |
|---|---|---|---|---|
| `QUEUED` | `VALIDATING` | Worker acquires lock (`SKIP LOCKED`) | **YES** | N/A |
| `VALIDATING` | `PREPROCESSING` | Consents and capture verified | **YES** | N/A |
| `VALIDATING` | `FAILED_TERMINAL` | Consent missing or capture missing | **YES** | Emits `CONSENT_REVOKED_ERROR` |
| `PREPROCESSING` | `CV_PROCESSING` | Image bytes loaded into RAM | **YES** | N/A |
| `CV_PROCESSING` | `AYURVEDIC_PROCESSING`| Observables successfully extracted | **YES** | N/A |
| `CV_PROCESSING` | `FAILED_RETRYABLE` | Transient CV model timeout | **YES** | Requeues job (max 2 retries) |
| `AYURVEDIC_PROCESSING`| `FUSION_PROCESSING` | Doshic tendencies derived | **YES** | N/A |
| `FUSION_PROCESSING` | `CONFIDENCE_EVALUATION`| Fused vector & Agreement $A$ computed | **YES** | N/A |
| `CONFIDENCE_EVALUATION`| `RAG_RETRIEVAL` | Calibrated confidence assigned | **YES** | N/A |
| `RAG_RETRIEVAL` | `EXPLANATION` | Classical chunks retrieved | **YES** | N/A |
| `EXPLANATION` | `SAFETY_VALIDATION` | LLM JSON payload generated | **YES** | N/A |
| `SAFETY_VALIDATION` | `RESULT_BUILD` | Output passes Zod and regex filters | **YES** | N/A |
| `SAFETY_VALIDATION` | `FAILED_RETRYABLE` | LLM emitted prohibited term (Attempt 1)| **YES** | Triggers retry prompt |
| `RESULT_BUILD` | `COMPLETED` | ACID transaction committed | **YES** | N/A |
| `QUEUED` | `COMPLETED` | Direct bypass without pipeline | **ILLEGAL** | `409 Conflict: ILLEGAL_STATE_TRANSITION` |
| `COMPLETED` | `QUEUED` | Mutating finished immutable result | **ILLEGAL** | `409 Conflict: IMMUTABLE_STATE_FINALIZED` |
