# AayurFace — Security Architecture Specification
## PDF Export & Public Sharing Token Security

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Security Architect, Staff Backend Architect, Frontend Architect  

---

### 1. PDF Export & Sharing Threat Landscape

AayurFace allows users to compile their Ayurvedic wellness assessment into a downloadable PDF report or share a read-only link with an Ayurvedic doctor or family member. This introduces distinct data leakage vectors:
* **Public URL Enumeration:** Attacker brute-forces sequential or low-entropy URLs to scrape thousands of users' wellness summaries.
* **Biometric Exposure in Reports:** Raw facial imagery embedded into PDF reports that are subsequently forwarded over insecure messaging apps.
* **Perpetual Public Accessibility:** Share links remaining active indefinitely on the web after the user intended a temporary view.
* **Search Engine Indexing:** Public share links being crawled and indexed by Google/Bing, exposing health concerns publicly.

---

### 2. Cryptographic Share Token Architecture

Public report sharing requires an explicit user action and is governed by high-entropy cryptographic tokens:

```sql
-- Target Schema for Cryptographically Governed Share Links

CREATE TABLE shared_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    scan_id UUID NOT NULL REFERENCES scan_results(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL UNIQUE, -- SHA-256 hash of high-entropy URL token
    passcode_hash VARCHAR(100),             -- Optional bcrypt hash of user-defined PIN
    expires_at TIMESTAMPTZ NOT NULL,        -- Mandatory expiration (Default: 7 days)
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    view_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Token Security Specifications:
1. **256-Bit Cryptographic Entropy:** Share URLs utilize tokens generated via `crypto.getRandomValues()` with 32 bytes (256 bits) of entropy, base64url-encoded:
   `https://app.aayurface.in/share/r_9fK2Lp4mQ7vX1yZ8...`  
   Guessing or brute-forcing a 256-bit token is mathematically infeasible.
2. **Hash-at-Rest Storage:** Raw share tokens are never stored in the database. The database stores only the SHA-256 hash (`token_hash`). If the database is compromised, an attacker cannot construct active share URLs.
3. **Mandatory Expiration & Instant Revocation:**
   * Share links enforce a strict maximum expiration of **7 days** (or user-selected 24 hours / 30 days).
   * Users can instantly revoke any active share link from `/profile/history` with a single tap (`is_revoked = TRUE`).
4. **Search Engine Indexing Prevention:**
   All public share views permanently emit the HTTP header:
   `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`  
   and include `<meta name="robots" content="noindex, nofollow">` in the HTML document.

---

### 3. Biometric & PII Data Minimization in PDF Reports

The generated PDF wellness report is subject to strict data sanitization:
* **Zero Raw Facial Pixels:** The PDF report **NEVER** includes the raw facial capture image. Only high-level phenotypic charts (e.g., Tridosha balance spider chart, surface reflection score bar) are embedded.
* **Anonymized Export Header:** Reports display only the user's first name and assessment date; email addresses, phone numbers, and internal database UUIDs are excluded.
* **Mandatory Non-Diagnostic Watermark:** Every page features a permanent header/footer notice: *"AayurFace AI Wellness Report — For Informational & Educational Purposes Only — Not a Medical Diagnosis."*
