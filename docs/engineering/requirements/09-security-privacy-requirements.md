# AayurFace — Engineering Requirements Specification
## Document 09: Security, Privacy & Facial Biometric Specifications

**Phase:** Phase 01 — Requirements Engineering, Formalization & Complete Traceability  
**Date:** 2026-09-03  
**Status:** FORMAL ENGINEERING CONTRACT  
**Authority:** Security & Privacy Architect, Compliance Lead  

---

### 1. Security Architecture & Threat Mitigation

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          AUTHENTICATION BOUNDARY                       │
│  User Credentials ──► Supabase Auth (bcrypt hashing, asymmetric JWT)   │
│  Access Token: Bearer JWT (TTL: 60 mins)  │ Refresh Token (Rotating)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        AUTHORIZATION BOUNDARY                          │
│  All API Calls & Edge Functions extract `auth.uid()` from verified JWT │
│  Client-provided `userId` in JSON bodies is NEVER trusted              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
┌───────────────────────────────────┐ ┌──────────────────────────────────┐
│      DATABASE RLS ENFORCEMENT     │ │     PRIVATE STORAGE BUCKET       │
│  Every table enforces:            │ │  Bucket: `facial-captures`       │
│  `USING (auth.uid() = user_id)`   │ │  Public Access: STRICTLY BLOCKED │
│  Cross-tenant access: IMPOSSIBLE  │ │  Access via: Signed URLs only    │
└───────────────────────────────────┘ └──────────────────────────────────┘
```

---

### 2. Authentication & Session Specifications (SEC-AUTH)

* **SEC-AUTH-001 (Supabase Auth Migration):** The insecure mock `localStorage` provider discovered in Phase 00 (`src/contexts/AuthContext.tsx`) shall be completely removed and replaced with standard Supabase Auth client integration.
* **SEC-AUTH-002 (Password Security):** Passwords shall be validated client-side and server-side against OWASP minimum complexity requirements. Passwords shall never be logged or transmitted in cleartext.
* **SEC-AUTH-003 (OAuth Social Identity):** Google OAuth authentication shall execute via standard OAuth 2.0 PKCE flow mediated by Supabase Auth; mock identity generation (`google.user@gmail.com`) is strictly prohibited.
* **SEC-AUTH-004 (Automatic Session Expiration & Refresh):** Client-side tokens shall automatically refresh in the background via Supabase SDK; expired sessions shall trigger immediate redirection to `/auth/login`.

---

### 3. Biometric Facial Data Privacy Lifecycle (SEC-PRIV)

Because facial imagery constitutes sensitive biometric personal data under international data protection laws (including the Digital Personal Data Protection Act 2023 and GDPR Article 9), AayurFace implements strict lifecycle guardrails:

```text
[Camera Stream] ──► [Ephemeral RAM Processing Only] ──► [Single Approved Frame]
                                                                │
                                                                ▼
                                                [AES-256 Encrypted In-Transit]
                                                                │
                                                                ▼
                                                [Private Storage Bucket]
                                                (Zero Public Access)
                                                                │
                                                                ▼
                                                [Temporary Signed URL (TTL 15m)]
                                                                │
                                                                ▼
                                                [Edge Function Feature Extraction]
                                                                │
                                                                ▼
                                                [Image Purge / Retention Policy]
```

* **SEC-PRIV-001 (Private Storage Invariant):** All facial captures shall be uploaded to an access-controlled Supabase Storage bucket (`facial-captures`). Public reads shall be disabled at the storage configuration level.
* **SEC-PRIV-002 (Signed URL Generation):** Temporary URLs for image ingestion shall be generated exclusively by authenticated Edge Functions with a maximum Time-To-Live of 15 minutes.
* **SEC-PRIV-003 (Facial Retention Lifecycle):**
  * *Standard Analysis:* The captured facial frame shall be retained only as long as required for feature extraction and user review.
  * *User Preference Control:* Users shall have the option in Privacy Settings to select: (a) "Retain images for visual progress tracking", or (b) "Delete facial images immediately after feature extraction, retaining only numerical metrics".
* **SEC-PRIV-004 (Cryptographic Purge on Account Deletion):** When a user requests account deletion, a background storage worker shall execute immediate hard deletion of all associated images in `facial-captures/{user_id}/*`.

---

### 4. Granular Consent Management (SEC-CONSENT)

* **SEC-CONSENT-001 (Unbundled Consent Collection):** Consent shall NOT be bundled into a generic "I accept everything" checkbox. The system shall enforce independent consent toggles for:
  1. `consent_biometric_processing` (Mandatory for scan)
  2. `consent_analysis_storage` (Mandatory for saving results)
  3. `consent_anonymized_research` (Optional)
  4. `consent_notifications` (Optional)
* **SEC-CONSENT-002 (Database Consent Model):** Every consent transaction shall be recorded in the `consents` table:
  * `id`: UUID (Primary Key)
  * `user_id`: UUID (Foreign Key to `profiles.id`)
  * `consent_version`: VARCHAR (e.g., "v1.0")
  * `scopes`: JSONB (`{"biometric": true, "storage": true, "research": false}`)
  * `granted_at`: TIMESTAMPTZ
  * `revoked_at`: TIMESTAMPTZ (nullable)
* **SEC-CONSENT-003 (Immediate Processing Cessation):** If `consent_biometric_processing` is revoked, all active analysis jobs for that user shall be immediately aborted.

---

### 5. API & Network Security (SEC-NET)

* **SEC-NET-001 (Edge Function Authentication Guard):** Every Supabase Edge Function (`analyze-skin`, `ayurveda-chat`, etc.) shall inspect the incoming `Authorization: Bearer <JWT>` header using `supabase.auth.getUser()`. Anonymous requests shall immediately return HTTP 401 Unauthorized.
* **SEC-NET-002 (Restricted CORS Whitelist):** CORS headers shall specify the verified production web origin (e.g., `https://aayurface.app` and `http://localhost:5173` for local development). Wildcard `*` is strictly forbidden.
* **SEC-NET-003 (Prompt Injection Quarantine):** Free-form user text strings (such as chat queries or custom concerns) shall be sanitized, length-limited, and enclosed in strict XML/delimiter fences when passed to LLMs to prevent prompt injection.
* **SEC-NET-004 (Automated Log Redaction):** Structured server-side logging shall implement filter masks that replace credit cards, passwords, base64 strings, and image signed URLs with `[REDACTED]`.
