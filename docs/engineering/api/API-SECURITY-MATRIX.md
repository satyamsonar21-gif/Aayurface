# Security Contract: API Security & Threat Mitigation Matrix
## STRIDE Threat Modeling, Gateway Controls & Anti-Abuse Defenses

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Enterprise API Security  
**Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION & SECURITY AUDIT)`  
**Authority:** Security Architect, Principal Backend Architect  

---

## 1. STRIDE Threat Mitigation Mapping

Every endpoint domain is systematically defended against the six STRIDE threat vectors:

| STRIDE Threat Category | Potential Attack Vector in AayurFace | Architectural Defense & Gateway Security Control | Target Endpoint Mapping |
|---|---|---|---|
| **Spoofing Identity** | Malicious caller forged JWT or spoofed `userId` in request body. | Gateway cryptographically verifies RS256 JWT signature and derives identity solely from `auth.uid()`. Client `userId` headers are dropped. | All `/api/v1/*` endpoints |
| **Tampering with Data** | Attacker tampering with visual observable scores or RAG citations. | AI orchestration occurs strictly in isolated backend workers; LLM output parsed through strict Zod schemas; citation IDs foreign-key verified. | `POST /api/v1/analyses`, `POST /api/v1/voice/chat` |
| **Repudiation** | User denies granting consent or admin denies modifying system config. | Immutable append-only audit logging in `consents` and `security_audit_events` (WORM rule enforced). | `POST /api/v1/consents`, `POST /api/v1/admin/*` |
| **Information Disclosure** | IDOR / BOLA vulnerability allowing User A to view User B's raw facial images or health scans. | Kernel Row-Level Security (`auth.uid() = user_id`); S3 keys prefixed with verified `userId`; private buckets; 100% EXIF stripping. | `GET /api/v1/analyses/:id`, `GET /api/v1/history`, `POST /api/v1/captures/upload-url` |
| **Denial of Service / Wallet**| Flooding expensive GPT-4o analysis endpoints to inflate cloud compute bills. | Multi-tier sliding-window rate limiting (5 analyses/user/hour); mandatory `Idempotency-Key` headers; 5MB payload caps. | `POST /api/v1/analyses`, `POST /api/v1/voice/chat`, `POST /api/v1/reports/compile` |
| **Elevation of Privilege** | Normal user attempting to access administrative audit logs or practitioner research worklists. | Strict RBAC role enforcement in JWT claims (`admin_sec`, `admin_editorial`, `practitioner`); non-admin callers rejected with `403 Forbidden`. | `GET /api/v1/admin/*`, `POST /api/v1/research/*` |

---

## 2. CORS & Content Security Policy (CSP) Invariants

* **Strict CORS Whitelist:** Gateway strictly restricts `Access-Control-Allow-Origin` to trusted production domains (`https://aayurface.com`, `https://app.aayurface.com`). Wildcard (`*`) CORS is unconditionally blocked on all authenticated routes.
* **Strict Allowed Headers:** `Authorization`, `Content-Type`, `X-Request-ID`, `Idempotency-Key`.
* **Allowed Methods:** `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`.
