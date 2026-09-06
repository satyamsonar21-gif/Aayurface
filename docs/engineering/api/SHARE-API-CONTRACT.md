# API Contract: Cryptographic Public Report Sharing
## High-Entropy Share Tokens, Granular Redaction & Instant Revocation

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Public Sharing & Collaboration  
**Status:** `TARGET ARCHITECTURE / PROPOSED (REQUIRES IMPLEMENTATION & SECURITY VALIDATION)`  
**Authority:** Security Architect, Privacy Officer, Principal Backend Architect  

---

## 1. Architectural Share Model & Privacy Boundaries

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PUBLIC REPORT SHARING BOUNDARY                        │
├─────────────────────────────────────────────────────────────────────────────┤
│   [ Authenticated User ]                                                    │
│   • Selects specific analysisId                                             │
│   • Issues POST /api/v1/shares (Generates 256-bit entropy token)            │
│                     │                                                       │
│                     ▼                                                       │
│   [ Public Anonymous Recipient (Family / Practitioner) ]                    │
│   • Resolves GET /api/v1/shares/:token                                      │
│   • Strict PII Exclusion: Name, Email, Phone, and Face Images EXCLUDED      │
│   • Accesses Redacted Doshic Breakdown & Recommendations ONLY               │
│   • Owner can permanently revoke share via DELETE /api/v1/shares/:id        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. API-SHR-001: Generate Public Share Link (`POST /api/v1/shares`)

* **HTTP Method:** `POST`
* **Path:** `/api/v1/shares`
* **Actor:** Authenticated User (`auth.uid()`)
* **Security:** Generates 256-bit cryptographically secure token; stores SHA-256 hash in `shared_reports(token_hash)`.

### Request Body & Zod Schema

```typescript
export const CreateShareSchema = z.object({
  analysisId: z.string().uuid(),
  expiresInDays: z.enum(['1', '7', '30', '90', 'NEVER']).default('30'),
  includeRecommendations: z.boolean().default(true)
}).strict();
```

### Success Response (`201 Created`)

```json
{
  "data": {
    "shareId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f8f",
    "publicToken": "shr_9f8b2c4e1a7d6e5c8b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c",
    "shareUrl": "https://aayurface.com/share/shr_9f8b2c4e1a7d6e5c...",
    "expiresAt": "2026-10-03T20:30:00.000Z"
  },
  "meta": {
    "requestId": "req_shr_create_01",
    "timestamp": "2026-09-03T20:30:00.060Z"
  }
}
```

---

## 3. API-SHR-002: Resolve Public Share Token (`GET /api/v1/shares/:token`)

* **HTTP Method:** `GET`
* **Path:** `/api/v1/shares/:token`
* **Actor:** Anonymous Public Recipient
* **Security Checks:**
  1. Computes `SHA256(token)`.
  2. Queries `shared_reports WHERE token_hash = :hash AND is_revoked = FALSE AND expires_at > NOW()`.
  3. Increments `view_count`.
  4. Returns **Redacted View** (zero PII, zero facial pixels).

### Success Response (`200 OK`)

```json
{
  "data": {
    "dominantDosha": "PITTA",
    "calibratedConfidence": 84.5,
    "confidenceLevel": "HIGH",
    "doshaPercentages": { "vata": 28.0, "pitta": 58.0, "kapha": 14.0 },
    "analysisDate": "2026-09-03T20:30:05.420Z",
    "sharedRecommendations": [
      {
        "title": "Sandalwood & Rose Hydrating Lepa",
        "category": "SKINCARE_LEPA"
      }
    ],
    "disclaimer": "This shared report contains non-diagnostic Ayurvedic wellness assessments."
  },
  "meta": {
    "requestId": "req_shr_view_01",
    "timestamp": "2026-09-03T21:00:00.000Z"
  }
}
```
