# AayurFace — Security Architecture Specification
## File Upload & Biometric Asset Ingestion Security

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Security Architect, Computer Vision Architect, Staff Backend Architect  

---

### 1. The Zero-Trust Ingestion Invariant

Uploaded user assets represent a critical attack surface. Malicious actors frequently exploit file upload endpoints using polyglot payloads (e.g., embedding executable PHP/JavaScript within a valid JPEG header), path traversal filenames (`../../etc/passwd`), or pixel flood decompression bombs designed to crash backend processing daemons:

> [!CRITICAL]
> **Zero-Trust Upload Principle**  
> Under NO circumstances shall the system trust the client-supplied filename, file extension, or HTTP `Content-Type` header.  
> Every uploaded asset must undergo rigorous byte-level inspection, server-side dimension validation, sanitization, and cryptographic storage isolation before being processed by computer vision or AI services.

---

### 2. Multi-Stage Ingestion Pipeline

```text
[1. Client Upload] ──► [2. Edge Gateway Gate] ──► [3. Magic Byte Check] ──► [4. Canvas Sanitizer] ──► [5. Private S3]
  PUT Signed URL         Content-Length <= 5MB     Verify `FF D8 FF`         Strip EXIF / Re-encode     `{userId}/{uuid}.jpg`
```

#### Pipeline Stages:
1. **Stage 1: Client Pre-Flight Verification:**
   * Before initiating an upload, the browser Canvas draws the frame to strip camera EXIF data and compresses the bitmap to JPEG format (quality factor: 0.85).
2. **Stage 2: Storage Perimeter Gate:**
   * S3 pre-signed URL policy enforces a hard limit of `Content-Length <= 5242880` (5 MB). Any upload exceeding 5 MB is dropped immediately at the cloud network edge with HTTP 413.
3. **Stage 3: Magic-Byte & Header Verification:**
   * The feature extraction worker inspects the first 4 bytes of the binary buffer.
   * For JPEG images, the buffer must begin with the hex sequence `FF D8 FF DB` or `FF D8 FF E0` / `FF D8 FF E1`.
   * Files containing HTML tags (`<script>`, `<html>`), PHP tags (`<?php`), or SVG XML structures are flagged as malicious polyglots, dropped, and reported to the security audit log.
4. **Stage 4: Image Re-Encoding & EXIF Sanitization:**
   * The serverless worker decodes the image binary into raw pixel buffers and re-encodes it into a clean JPEG. This operation neutralizes embedded polyglot scripts, strips any residual metadata, and protects downstream libraries against parser exploit CVEs.
5. **Stage 5: Cryptographic Path Isolation:**
   * The file is stored using a cryptographically generated UUIDv4 filename within the tenant's isolated directory prefix: `facial-captures/{auth.uid()}/{uuid}.jpg`. Client-supplied filenames (e.g., `photo.jpg`) are permanently discarded.

---

### 3. File Upload Threat Mitigation Matrix

| Threat Vector | Attack Mechanism | Target Architectural Control | Verification Method |
|---|---|---|---|
| **Polyglot Executable Injection** | Attacker crafts a file that passes as a JPEG but contains executable script in comment markers. | Magic-byte verification + serverless re-encoding; S3 bucket configured with `X-Content-Type-Options: nosniff` and non-executable execution policies. | Upload synthetic polyglot JPEG containing `<script>` payload; verify script is stripped and file cannot execute. |
| **Pixel Flood / Decompression Bomb** | Attacker crafts a 100 KB compressed image that unpacks into a 10 GB memory bitmap, crashing edge workers. | Hard dimension cap: Maximum resolution allowed is $1920 \times 1080$ pixels. Image decoding aborts immediately if unpacked dimensions exceed limits. | Upload a test decompression bomb image; assert worker rejects file without out-of-memory crash. |
| **Path Traversal** | Attacker supplies filename `../../system/config.env` to overwrite server configuration. | Client filenames are ignored; server generates an isolated path using `crypto.randomUUID()` within the user's S3 folder. | Synthetic request with path traversal in headers; asserts file is stored cleanly under generated UUID path. |
| **Malicious File Extensions** | Attacker attempts to upload `.exe`, `.sh`, `.php`, or `.svg` script payloads. | Extension allowlist: strictly `.jpg` / `.jpeg`. S3 bucket policies forbid executing files as server-side scripts. | Attempt upload of `.svg` or `.sh`; asserts HTTP 415 Unsupported Media Type. |
| **Geolocation Metadata Leakage** | Capture reveals exact GPS coordinates, home address, or device hardware IDs. | Client-side Canvas redraw and server-side re-encoder strip 100% of EXIF, IPTC, and XMP metadata blocks. | Analyze stored image buffer with `exiftool`; assert zero GPS or hardware metadata tags exist. |
