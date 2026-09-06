# Architecture Decision Record (ADR)
## ADR-DB-004: Facial Image Storage — Private S3 Object Storage with Ephemeral Signed URLs

**Status:** TARGET  
**Date:** 2026-09-03  
**Deciders:** Principal Database Architect, Platform/SRE Architect, Security Architect  
**Technical Category:** Object Storage & Biometric Architecture  

---

### Context & Problem Statement
In the existing prototype, `supabase/functions/analyze-skin/index.ts` accepts base64-encoded image payloads directly in HTTP request bodies and stores an unverified string in `scan_results.image_url`. Storing raw images in database tables (as `BYTEA` or base64 `TEXT`) or accepting multi-megabyte payloads in Edge Functions creates catastrophic operational and security liabilities:
1. Database table bloat and massive memory pressure during database backups.
2. Direct image exposure through database SQL injection or misconfigured API responses.
3. High network latency and edge worker memory crashes from decoding 5 MB base64 payloads.

### Decision Drivers
1. **Zero Database Image Bloat:** Database tables must store only metadata and derived numerical vectors.
2. **Perimeter Security:** Eliminate public read access to raw biometric imagery.
3. **Bandwidth Optimization:** Enable direct client-to-storage ingestion without proxying raw image bytes through Edge Functions.
4. **Biometric Lifecycle Control:** Support rapid hard-purging of raw biometric images (DEC-004) without running complex SQL `VACUUM` operations.

### Decision Outcome
**Chosen Option: Decoupled Private S3 Object Storage with Short-Lived HMAC Pre-Signed URLs.**

#### Architecture Specifications:
* **Private Bucket:** S3 bucket `facial-captures` configured with zero public read permissions. Direct HTTP GET queries return `403 Forbidden`.
* **Path Partitioning:** Object keys strictly scoped to user tenant IDs: `facial-captures/{userId}/{captureId}.jpg`.
* **HMAC Pre-Signed PUT URLs:** Client requests an upload URL from `/api/v1/captures/upload-url`; the serverless gateway validates the caller's JWT, verifies active consent, and generates a pre-signed PUT URL with a proposed 15-minute TTL (SEC-DEC-003).
* **Metadata Persistence in PostgreSQL:** The `captures` table stores only: `storage_path`, `mime_type`, `file_size_bytes`, `checksum_sha256`, and `retention_state`.
* **Biometric Decoupling:** Raw facial image binaries never touch the PostgreSQL engine.

### Consequences
* **Positive:** Database backups remain lean and fast; edge worker memory is protected; S3 access is strictly auditable and cryptographically signed; enables independent S3 lifecycle automated purge rules.
* **Negative:** Requires coordinating a two-step upload process (obtain URL $\rightarrow$ PUT to S3 $\rightarrow$ notify analysis worker) instead of a single monolithic API call.
* **Status Classification:** `TARGET` — scheduled for Milestone 08 implementation.
