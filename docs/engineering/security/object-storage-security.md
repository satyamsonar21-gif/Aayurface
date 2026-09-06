# AayurFace — Security Architecture Specification
## Object Storage & Cryptographic Pre-Signed Access Security

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Security Architect, Platform/SRE Architect, Staff Backend Architect  

---

### 1. Private Bucket Storage Architecture

To completely eliminate unauthorized exposure of sensitive facial biometric data, Supabase Storage (S3-compatible) is configured with private bucket access rules:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ S3 STORAGE BUCKET: `facial-captures` (PRIVATE)                               │
│ • Public Read Access: DISABLED (Direct HTTP GET returns 403 Forbidden)      │
│ • Public Listing Access: DISABLED (Bucket enumeration physically blocked)    │
│ • Path Isolation Scheme: `facial-captures/{userId}/{captureId}.jpg`          │
│ • Server-Side Encryption: AES-256 (KMS-Managed Encryption at Rest)           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Cryptographic Pre-Signed URL Access Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Client as User Browser SPA
    participant Edge as Edge Function API
    participant S3 as Private S3 Bucket (`facial-captures`)

    Note over Client,S3: 1. Secure Ingestion Request
    Client->>Edge: POST /api/v1/captures/upload-url (Bearer JWT)
    Edge->>Edge: Verify JWT signature & extract auth.uid()
    Edge->>Edge: Generate Target Object Path: `facial-captures/${auth.uid()}/${uuid}.jpg`
    Edge->>S3: Request Pre-signed PUT URL (HMAC-SHA256, Proposed 15m TTL)
    S3-->>Edge: Return Signed PUT URL with Cryptographic Signature
    Edge-->>Client: HTTP 200 { upload_url, object_path, expires_in: 900 }

    Note over Client,S3: 2. Direct-to-Storage Upload
    Client->>S3: PUT <upload_url> (Body: Binary Compressed JPEG, Max 5MB)
    S3->>S3: Validate HMAC signature, expiration timestamp, and Content-Length
    alt Signature Valid & Size <= 5MB
        S3-->>Client: HTTP 200 OK (Upload Successful)
    else Expired or Forged Signature
        S3-->>Client: HTTP 403 Forbidden
    end

    Note over Client,S3: 3. Ephemeral Feature Extraction Read
    Edge->>S3: Request Ephemeral Signed GET URL (60s TTL for Feature Extractor)
    S3-->>Edge: Download frame binary in serverless memory
    Edge->>Edge: Compute numerical VisualObservations vector
    Note over Edge,S3: 4. Biometric Purge Protocol (DEC-004)
    Edge->>S3: DELETE /facial-captures/${auth.uid()}/${uuid}.jpg (If Immediate Purge)
```

---

### 3. Object Storage Security Specifications

| Control Area | Security Specification | Threat Addressed | Verification Method |
|---|---|---|---|
| **Public URL Prohibition** | Public bucket reads are disabled at the storage API layer. | Direct image scraping, search engine indexing. | Automated test: Direct unauthenticated HTTP GET must return `403 Forbidden`. |
| **Tenant Path Isolation** | Objects are partitioned by user UUID: `{userId}/{captureId}.jpg`. Upload URL generation verifies that the path prefix matches `auth.uid()`. | Cross-tenant overwriting, BOLA/IDOR file tampering. | Unit test verifying User A cannot obtain signed upload URL for User B's path. |
| **Proposed Signed URL TTL** | Upload URLs expire after 15 minutes; download URLs for serverless extraction expire after 60 seconds (SEC-DEC-003: Proposed). | Intercepted or forwarded link reuse. | Clock skew test verifying signed URL fails after expiration timestamp. |
| **MIME & Size Enforcement** | Enforce `Content-Type: image/jpeg` and `Content-Length <= 5242880` (5 MB). | Decompression bombs, storage exhaustion, malicious executables. | Attempting to upload a 10 MB payload or `.html` file is rejected. |
| **Automated Orphan Cleanup** | Daily scheduled storage worker scans for uploaded files older than 24 hours that are not linked to a completed `scan_results` record. | Orphaned file accumulation, unlinked biometric storage liability. | Staging audit verifying unlinked test captures are hard-purged after 24 hours. |
| **Audit Telemetry** | Every generation of a signed upload or download URL is logged with `user_id`, `object_path`, and `expires_at`. | Forensic investigations, unauthorized access tracking. | Verification of `OBJECT_SIGNED_URL_CREATED` event emission in audit log. |
