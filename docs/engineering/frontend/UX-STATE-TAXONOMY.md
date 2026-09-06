# AayurFace — Frontend Architecture Specification
## Comprehensive 28-State UX Taxonomy & Screen Mapping

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Date:** 2026-09-03  
**Status:** AUTHORITATIVE UX STATE TAXONOMY  
**Authority:** Staff UX Engineer, QA Architect  

---

## 1. Universal 28-State UX Taxonomy

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       28-STATE UX STATE TAXONOMY                            │
├────┬─────────────────────────────┬────┬────────────────────────────────────┤
│ 01 │ `IDLE`                      │ 15 │ `SERVICE_UNAVAILABLE` (503)        │
│ 02 │ `INITIAL_LOADING` (Skeleton)│ 16 │ `DEGRADED_MODE` (Fallback rules)   │
│ 03 │ `SUBMITTING` (Button spin)  │ 17 │ `OFFLINE` (Network lost)           │
│ 04 │ `POLLING_IN_FLIGHT`         │ 18 │ `RETRYABLE_FAILURE`                │
│ 05 │ `SUCCESS`                   │ 19 │ `TERMINAL_FAILURE`                 │
│ 06 │ `PARTIAL_SUCCESS`           │ 20 │ `PERMISSION_DENIED` (Camera/Mic)   │
│ 07 │ `EMPTY_FEED`                │ 21 │ `HARDWARE_UNAVAILABLE`             │
│ 08 │ `VALIDATION_ERROR` (Inline) │ 22 │ `BROWSER_UNSUPPORTED` (No Wasm)    │
│ 09 │ `UNAUTHORIZED` (401)        │ 23 │ `LOW_QUALITY_CAPTURE` (Blur/Dark)  │
│ 10 │ `FORBIDDEN_CONSENT` (403)   │ 24 │ `MODALITY_DISAGREEMENT` (Low Agree)│
│ 11 │ `RESOURCE_NOT_FOUND` (404)  │ 25 │ `AI_SAFETY_REFUSAL` (Medical term) │
│ 12 │ `CONFLICT_STATE` (409)      │ 26 │ `RESOURCE_EXPIRED` (Share/Report)  │
│ 13 │ `RATE_LIMIT_HIT` (429)      │ 27 │ `DELETED_TOMBSTONE`                │
│ 14 │ `NETWORK_TIMEOUT` (504)     │ 28 │ `RESTORED_DRAFT` (Questionnaire)   │
└────┴─────────────────────────────┴────┴────────────────────────────────────┘
```

---

## 2. Core Screen State Coverage Matrix

| Screen Identifier | Primary Happy State | Primary Empty State | Error / Failure Handling States |
|---|---|---|---|
| **Dashboard (`/dashboard`)** | `SUCCESS` (Active habits loaded) | `EMPTY_FEED` (*"Start your first facial scan"*) | `OFFLINE`, `UNAUTHORIZED`, `SERVICE_UNAVAILABLE` |
| **Capture (`/analyze/capture`)** | `SUCCESS` (High-res frame ready) | N/A | `PERMISSION_DENIED`, `HARDWARE_UNAVAILABLE`, `LOW_QUALITY_CAPTURE` |
| **Analysis (`/analyze/processing`)**| `SUCCESS` (Results ready) | N/A | `POLLING_IN_FLIGHT`, `NETWORK_TIMEOUT`, `RETRYABLE_FAILURE` |
| **Results (`/analyze/results/:id`)**| `SUCCESS` (Doshic balance shown) | N/A | `MODALITY_DISAGREEMENT`, `RESOURCE_NOT_FOUND` |
| **Routine (`/routine`)** | `SUCCESS` (Habit timeline) | `EMPTY_FEED` (*"Adopt recommendations to build routine"*) | `VALIDATION_ERROR`, `OFFLINE` (Local optimistic queue) |
| **History (`/history`)** | `SUCCESS` (Keyset card stream) | `EMPTY_FEED` (*"No past scans recorded yet"*) | `UNAUTHORIZED`, `RETRYABLE_FAILURE` |
| **Voice Guide (`/voice`)** | `SUCCESS` (Turn completed) | `IDLE` (*"Ask any Ayurvedic wellness question"*) | `PERMISSION_DENIED`, `AI_SAFETY_REFUSAL`, `OFFLINE` |
