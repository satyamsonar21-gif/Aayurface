# AayurFace — Database Architecture Specification
## PDF Export Storage, Cryptographic Share Tokens & Access Governance

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Data Security Architect  

---

### 1. Cryptographic Share Token Architecture

Users can share a read-only wellness summary with an Ayurvedic practitioner or family member without requiring the recipient to create an account. Public sharing is governed by high-entropy cryptographic tokens:
1. **Token Generation:** When a user clicks "Share Summary", the edge gateway generates a 32-byte cryptographically secure random token ($2^{256}$ entropy) using `crypto.getRandomValues()`.
2. **One-Way Token Hashing:** The database **NEVER** stores the raw token. It stores only the SHA-256 hash:
   $$\text{token\_hash} = \text{SHA-256}(\text{raw\_token})$$
3. **Public URL Structure:** `https://aayurface.app/share/${raw_token}`.
4. **Data Redaction Invariant:** Public shares expose **ONLY** the dominant dosha summary and lifestyle recommendations; raw facial images, phone numbers, and email addresses are **STRIPPED 100%**.

---

### 2. Relational Schema Specification

```sql
-- Target Schema for Cryptographic Shared Reports (Milestone 14)

CREATE TABLE shared_reports (
    id UUID PRIMARY KEY, -- UUIDv7
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    scan_id UUID NOT NULL REFERENCES scan_results(id) ON DELETE CASCADE,
    
    token_hash VARCHAR(64) NOT NULL UNIQUE, -- SHA-256 of raw token
    passcode_hash VARCHAR(100), -- Optional bcrypt hash of 6-digit access PIN
    
    expires_at TIMESTAMPTZ NOT NULL, -- Target 7 days (SEC-DEC-007)
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    view_count INT NOT NULL DEFAULT 0,
    max_views INT DEFAULT 50, -- Anti-scraping view cap
    
    last_accessed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 3. Ephemeral PDF Storage Lifecycle

Generated PDF export documents are treated as ephemeral cached assets:
* **Storage Location:** S3 private bucket `reports/${userId}/${exportId}.pdf`.
* **S3 Bucket Lifecycle:** Automated S3 rule deletes PDF objects after **7 days**.
* **Recomputability:** Because all underlying analysis metrics, visual features, and recommendations are permanently stored in PostgreSQL, any expired PDF report can be deterministically re-rendered on-demand.
* **Revocation Mechanics:** When a user toggles "Revoke Share" in the UI, an immediate atomic update sets `is_revoked = TRUE`. Subsequent HTTP GET requests to `/share/${raw_token}` return `HTTP 404 Not Found`.
