# API Contract: Consent Management
## Granular, Auditable Consent Ledger & Revocation Contracts

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Compliance & Privacy  
**Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION & LEGAL REVIEW)`  
**Authority:** Privacy Officer, Data Security Architect, Legal Counsel  

---

## 1. Architectural Principles of Consent

Consent under AayurFace is **Granular, Unbundled, Freely Given, Specific, Informed, and Revocable** (DPDP Act 2023 Sec. 6 / GDPR Art. 7):
1. **Zero Bundling:** Facial biometric capture consent, general wellness processing, and optional research sharing are strictly separate boolean scopes.
2. **Immutable Append-Only Audit:** Every consent grant, withdrawal, and policy version update is recorded as an immutable row in the `consents` table.
3. **No Retroactive Invalidation:** Withdrawing consent halts future processing immediately but does not retroactively invalidate past analyses generated while consent was active.

---

## 2. API-CONS-001: Get Active Consent Scopes (`GET /api/v1/consents`)

* **HTTP Method:** `GET`
* **Path:** `/api/v1/consents`
* **Actor:** Authenticated User (`auth.uid()`)

### Success Response (`200 OK`)

```json
{
  "data": {
    "userId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f80",
    "activeConsents": [
      {
        "scope": "FACIAL_BIOMETRIC_PROCESSING",
        "status": "GRANTED",
        "policyVersion": "v1.2.0",
        "grantedAt": "2026-09-01T10:05:00.000Z"
      },
      {
        "scope": "WELLNESS_DATA_PROCESSING",
        "status": "GRANTED",
        "policyVersion": "v1.2.0",
        "grantedAt": "2026-09-01T10:05:00.000Z"
      },
      {
        "scope": "RESEARCH_DEIDENTIFIED_SHARING",
        "status": "WITHDRAWN",
        "policyVersion": "v1.2.0",
        "withdrawnAt": "2026-09-03T14:20:00.000Z"
      }
    ]
  },
  "meta": {
    "requestId": "req_cons_01",
    "timestamp": "2026-09-03T20:30:00.050Z"
  }
}
```

---

## 3. API-CONS-002: Record Consent Grant or Revocation (`POST /api/v1/consents`)

* **HTTP Method:** `POST`
* **Path:** `/api/v1/consents`
* **Actor:** Authenticated User (`auth.uid()`)
* **Database Operations:**
  1. `INSERT INTO consents (id, user_id, consent_type, status, policy_version, client_ip_subnet, user_agent_hash)`
  2. `INSERT INTO security_audit_events (event_type: 'CONSENT_GRANTED' | 'CONSENT_REVOKED')`

### Request Body & Zod Schema

```typescript
export const ConsentUpdateSchema = z.object({
  scope: z.enum([
    'FACIAL_BIOMETRIC_PROCESSING',
    'WELLNESS_DATA_PROCESSING',
    'RESEARCH_DEIDENTIFIED_SHARING',
    'MARKETING_NOTIFICATIONS'
  ]),
  status: z.enum(['GRANTED', 'WITHDRAWN']),
  policyVersion: z.string().regex(/^v\d+\.\d+\.\d+$/)
}).strict();
```

### Success Response (`201 Created`)

```json
{
  "data": {
    "consentId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f82",
    "scope": "FACIAL_BIOMETRIC_PROCESSING",
    "status": "GRANTED",
    "policyVersion": "v1.2.0",
    "recordedAt": "2026-09-03T20:31:00.000Z"
  },
  "meta": {
    "requestId": "req_cons_update_01",
    "timestamp": "2026-09-03T20:31:00.080Z"
  }
}
```
