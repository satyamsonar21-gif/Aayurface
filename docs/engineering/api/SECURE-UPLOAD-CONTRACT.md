# API Contract: Secure Biometric Image Upload
## Private S3 Storage, Ephemeral HMAC Signed URLs & EXIF Stripping

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Storage & Biometric Security  
**Status:** `TARGET ARCHITECTURE / PROPOSED (REQUIRES SECURITY VALIDATION)`  
**Authority:** Security Architect, Principal Backend Architect, Privacy Officer  

---

## 1. Architectural Upload Topology

```text
┌──────────────┐     1. POST /api/v1/captures/upload-url     ┌──────────────────┐
│ Client SPA   │ ──────────────────────────────────────────► │ Edge API Gateway │
│ (EXIF-Free)  │ ◄────────────────────────────────────────── │ Auth & Anti-BOLA │
└──────┬───────┘     2. Returns Signed S3 PUT URL (15m TTL)  └──────────────────┘
       │
       │ 3. Direct Binary PUT (image/jpeg)
       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PRIVATE S3 BUCKET (AES-256 KMS)                          │
│ Key: `facial-captures/{userId}/{captureId}.jpg`                             │
│ Public Access Block: 100% BLOCKED                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. API-CAP-002: Issue Signed Upload URL (`POST /api/v1/captures/upload-url`)

* **HTTP Method:** `POST`
* **Path:** `/api/v1/captures/upload-url`
* **Actor:** Authenticated User (`auth.uid()`)
* **Precondition:** Session `captureSessionId` must be in `QUALITY_APPROVED` state and owned by caller.

### Request Body & Zod Schema

```typescript
export const IssueUploadUrlSchema = z.object({
  captureSessionId: z.string().uuid(),
  fileSizeBytes: z.number().int().min(10000).max(5242880), // 10KB to 5MB
  contentType: z.enum(['image/jpeg', 'image/webp'])
}).strict();
```

### Success Response (`201 Created`)

```json
{
  "data": {
    "captureSessionId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f86",
    "uploadUrl": "https://aayurface-prod-facial-captures.s3.ap-south-1.amazonaws.com/facial-captures/018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f80/018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f86.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...",
    "httpMethod": "PUT",
    "requiredHeaders": {
      "Content-Type": "image/jpeg",
      "x-amz-server-side-encryption": "AES256"
    },
    "expiresInSeconds": 900,
    "expiresAt": "2026-09-03T20:45:00.000Z"
  },
  "meta": {
    "requestId": "req_cap_upload_01",
    "timestamp": "2026-09-03T20:30:00.060Z"
  }
}
```

---

## 3. Security & Privacy Invariants

1. **Anti-BOLA Path Binding:** The S3 key prefix strictly injects the caller's verified `auth.uid()`. It is mathematically impossible for User A to obtain an upload URL writing to User B's folder.
2. **Signed URL Expiration:** Signed PUT URLs expire in **15 minutes** (`PROPOSED / REQUIRES VALIDATION`). Signed GET URLs for backend workers expire in **60 seconds**.
3. **EXIF Stripping Verification:** The client-side canvas redraw asserts stripping of GPS/hardware metadata. The backend feature extractor asserts zero EXIF tags prior to loading byte arrays into RAM.
4. **Biometric Decoupling & Purge Policy (DEC-004):** Raw images in S3 are decoupled from relational vectors and purged according to DEC-004 (`OPEN DECISION`).
