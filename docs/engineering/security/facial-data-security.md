# AayurFace — Security Architecture Specification
## Biometric Facial Data Protection & Lifecycle Security

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Security Architect, Privacy Officer, Computer Vision Architect  
**Legal Notice:** Facial imagery constitutes sensitive biometric data; classifications and handling policies are designed to support applicable data-protection obligations (**REQUIRES FORMAL LEGAL REVIEW**).  

---

### 1. Biometric Sensitivity & Threat Profile

Facial imagery represents immutable personal biometrics that can be leveraged for non-consensual identity recognition. The architecture enforces strict minimization, client RAM isolation, and rapid purge protocols.

Primary threat vectors:
* **Unauthorized Facial Enumeration / Leakage:** Malicious actors accessing stored facial images via bucket enumeration or BOLA/IDOR.
* **EXIF / Geolocation Metadata Leakage:** Embedded camera metadata revealing physical location, device identifiers, or timestamps.
* **Accidental Telemetry & Log Leakage:** Developers or APM tools inadvertently printing base64-encoded facial frames to console or log aggregators.
* **Cold Storage / Backup Persistence:** Unpurged biometric assets persisting indefinitely in database backups.

---

### 2. End-to-End Facial Data Lifecycle

```text
[1. Real-Time Stream] ──► [2. Quality Gate] ──► [3. Single Frame Freeze] ──► [4. EXIF Stripping]
      (Client RAM)              (Client RAM)             (Client RAM)              (Client RAM)
                                                                                         │
                                                                                         ▼
[8. Deletion/Purge] ◄── [7. Derived Vector] ◄── [6. Feature Extract] ◄── [5. Signed S3 Upload]
     (S3 Purge API)           (PostgreSQL)             (Edge Worker)            (Private S3)
```

| Lifecycle Stage | Data State | Physical Location | Access Restrictions | Retention Duration | Inherent Security Risk | Architectural Mitigation & Control |
|---|---|---|---|---|---|---|
| **1. Capture Stream** | Volatile Video Stream (RGBA) | Browser WebAssembly RAM | Local browser process only | Ephemeral (Millisecond frame drop) | Memory scraping, browser extension interception | Ephemeral Canvas buffer; raw stream is never written to disk or transmitted over network. |
| **2. Quality Validation** | Landmark Coordinates (Float32Array) | Browser WebAssembly RAM | MediaPipe FaceMesh engine | Discarded upon next frame tick | Spoofing, non-human input, extreme angles | Multi-parameter gateway check (single face, centering, lighting, inter-pupillary scale). |
| **3. Frame Freeze** | Single Static Frame (Bitmap) | Browser WebAssembly RAM | Local browser memory context | Capped at 60 seconds during upload | User session hijacking in browser | Single frame frozen only after gateway emits unanimous PASS. |
| **4. Preprocessing** | Compressed Binary JPEG | Browser RAM | Canvas encoder | Ephemeral | Embedded EXIF metadata revealing GPS location | Client-side Canvas redraw strips 100% of EXIF, GPS, and device metadata prior to encoding. |
| **5. Storage Ingestion** | Encrypted Binary JPEG Object | Private S3 Bucket (`facial-captures/`) | Blocked from public read; signed PUT only | Subject to DEC-004 (Immediate purge vs 30 days) | Interception, unauthorized download | Ephemeral HMAC-signed upload URL (Proposed 15m TTL); path isolated to `{userId}/{uuid}.jpg`. |
| **6. Feature Extraction** | In-Memory Image Buffer | Serverless Deno Edge Function | Ephemeral extraction worker token | Lifespan of Edge execution (< 15 seconds) | Serverless memory dump, cold start exposure | Downloaded via short-lived signed GET URL (60s TTL); processed in memory; zero disk writes. |
| **7. Derived Vector Persist** | Numerical Float Vector (`VisualObservations`) | PostgreSQL Table (`scan_results`) | Authenticated user via RLS (`auth.uid() = user_id`) | Active account lifespan | Algorithmic re-identification | Only derived scalar indices (a*, GLCM, Melanin) are stored; raw facial pixels are decoupled. |
| **8. Retention & Purge** | Hard Deletion of S3 Object | Private S3 Bucket | S3 API `DeleteObject` via Service Role | Purged immediately post-extraction (DEC-004 Option A) | Orphaned biometric accumulation | Immediate API hard-purge post-extraction OR automated 30-day S3 lifecycle rule + account deletion cascade. |

---

### 3. Anti-Logging Biometric Safeguard

Logging raw image data is an unacceptable security vulnerability:
* **The Logger Sanitizer Invariant:** The central logging utility (`logger.ts`) enforces an automated regex scanner that detects and intercepts any string containing the pattern `data:image/*;base64,` or byte buffers exceeding 10 KB, replacing the content with `[BIOMETRIC_DATA_REDACTED]`.
* **Zero Base64 in Database:** Database columns store strictly normalized numerical floats (e.g., `redness_index: 0.42`); base64 image strings are barred from the PostgreSQL relational schema.
