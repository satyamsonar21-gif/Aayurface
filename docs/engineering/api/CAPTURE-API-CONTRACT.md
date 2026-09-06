# API Contract: Biometric Facial Capture Session
## Ephemeral Capture Lifecycle, Quality Gateway & Landmark Privacy

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Biometric Capture  
**Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`  
**Authority:** Computer Vision Architect, Security Architect, Privacy Officer  

---

## 1. The Capture Session State Machine

```text
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ CREATED      │ ──► │ QUALITY_CHECKING │ ──► │ QUALITY_APPROVED │
│ Session init │     │ Wasm landmark run│     │ Pass thresholds  │
└──────────────┘     └──────────────────┘     └──────────────────┘
                               │                        │
                               ▼                        ▼
                     ┌──────────────────┐     ┌──────────────────┐
                     │ QUALITY_FAILED   │     │ UPLOADED         │
                     │ Low light/blur   │     │ Image in S3      │
                     └──────────────────┘     └──────────────────┘
```

---

## 2. API-CAP-001: Initialize Capture Session (`POST /api/v1/captures/sessions`)

* **HTTP Method:** `POST`
* **Path:** `/api/v1/captures/sessions`
* **Actor:** Authenticated User (`auth.uid()`)
* **Precondition:** Active `FACIAL_BIOMETRIC_PROCESSING` consent exists.

### Success Response (`201 Created`)

```json
{
  "data": {
    "captureSessionId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f86",
    "status": "CREATED",
    "qualityRequirements": {
      "minFaceConfidence": 0.85,
      "maxPitchDegrees": 15.0,
      "maxYawDegrees": 15.0,
      "minLightingLux": 250,
      "minBlurLaplacianVariance": 100.0
    },
    "expiresAt": "2026-09-03T20:45:00.000Z"
  },
  "meta": {
    "requestId": "req_cap_init_01",
    "timestamp": "2026-09-03T20:30:00.040Z"
  }
}
```

---

## 3. API-CAP-003: Submit Quality Gateway Metrics (`POST /api/v1/captures/:id/quality`)

* **HTTP Method:** `POST`
* **Path:** `/api/v1/captures/:id/quality`
* **Actor:** Authenticated User (`auth.uid()`)
* **Ownership Invariant:** Server checks `captures.user_id = auth.uid()`.

### Request Body & Zod Schema

```typescript
export const CaptureQualitySchema = z.object({
  lightingScore: z.number().min(0).max(100),
  blurVariance: z.number().min(0),
  faceCentered: z.boolean(),
  facePitchAngle: z.number().min(-90).max(90),
  faceYawAngle: z.number().min(-90).max(90),
  meshConfidence: z.number().min(0).max(1.0),
  exifStripped: z.literal(true) // Asserted by client canvas redraw
}).strict();
```

### Success Response (`200 OK`)

```json
{
  "data": {
    "captureSessionId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f86",
    "qualityStatus": "QUALITY_APPROVED",
    "isEligibleForUpload": true
  },
  "meta": {
    "requestId": "req_cap_qual_01",
    "timestamp": "2026-09-03T20:31:00.050Z"
  }
}
```
