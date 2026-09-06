# API Contract: User Profile & Account Management
## Profile Retrieval, Update, Preferences & Right-to-Erasure Contracts

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Profile Management  
**Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`  
**Authority:** Principal Backend Architect, Privacy Officer, Security Architect  

---

## 1. API-PROF-001: Get Current User Profile (`GET /api/v1/profile`)

* **HTTP Method:** `GET`
* **Path:** `/api/v1/profile`
* **Actor & Role:** Authenticated User
* **Auth Requirement:** `Authorization: Bearer <jwt>`
* **Ownership Invariant:** Server-derived identity (`WHERE id = auth.uid()`). Cross-user access is impossible.

### Success Response (`200 OK`)

```json
{
  "data": {
    "id": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f80",
    "email": "user@example.com",
    "fullName": "Priya Sharma",
    "avatarUrl": "https://aayurface-avatars.s3.amazonaws.com/018e3a2b.jpg",
    "ageBracket": "25-34",
    "gender": "FEMALE",
    "preferredLanguage": "en",
    "onboardingCompleted": true,
    "createdAt": "2026-09-01T10:00:00.000Z",
    "updatedAt": "2026-09-03T18:30:00.000Z"
  },
  "meta": {
    "requestId": "req_prof_018e3a2b",
    "timestamp": "2026-09-03T20:30:00.100Z"
  }
}
```

---

## 2. API-PROF-002: Update User Profile (`PUT /api/v1/profile`)

* **HTTP Method:** `PUT`
* **Path:** `/api/v1/profile`
* **Actor & Role:** Authenticated User (`auth.uid()`)
* **Concurrency Guard:** Optimistic locking via `updated_at` check or transactional update.

### Request Body & Zod Schema

```typescript
export const UpdateProfileSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  ageBracket: z.enum(['18-24', '25-34', '35-44', '45-54', '55+']).optional(),
  gender: z.enum(['FEMALE', 'MALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY']).optional(),
  preferredLanguage: z.enum(['en', 'hi', 'sa']).optional(),
  avatarUrl: z.string().url().optional()
}).strict();
```

### Success Response (`200 OK`)

```json
{
  "data": {
    "id": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f80",
    "fullName": "Priya Sharma",
    "ageBracket": "25-34",
    "gender": "FEMALE",
    "preferredLanguage": "hi",
    "updatedAt": "2026-09-03T20:31:00.000Z"
  },
  "meta": {
    "requestId": "req_prof_update_01",
    "timestamp": "2026-09-03T20:31:00.120Z"
  }
}
```

---

## 3. API-PROF-003: Update User Preferences (`PUT /api/v1/profile/preferences`)

* **HTTP Method:** `PUT`
* **Path:** `/api/v1/profile/preferences`
* **Actor:** Authenticated User (`auth.uid()`)
* **Database Entity:** `user_preferences`

### Request Body & Zod Schema

```typescript
export const UpdatePreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  audioEnabled: z.boolean(),
  hapticFeedback: z.boolean(),
  dailyReminderTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  notificationsEnabled: z.boolean()
}).strict();
```

---

## 4. API-PROF-004: Account Erasure & Cascading Purge (`DELETE /api/v1/profile/account`)

* **HTTP Method:** `DELETE`
* **Path:** `/api/v1/profile/account`
* **Actor:** Authenticated User (`auth.uid()`)
* **Security Classification:** High Confidentiality (Tier 3) / Statutory Right to Erasure (DPDP Act Sec. 12 / GDPR Art. 17)

### Request Payload (Mandatory Confirmation)

```json
{
  "confirmationText": "PERMANENTLY DELETE MY ACCOUNT",
  "reason": "USER_REQUESTED"
}
```

### Execution Semantics & Transaction Boundary:

```text
1. BEGIN TRANSACTION
2. Calculate tenant_hash = SHA256(auth.uid())
3. INSERT INTO deletion_tombstones (tenant_hash, purged_at, compliance_standard)
4. DELETE FROM auth.users WHERE id = auth.uid()
   ├── CASCADE DELETE profiles
   ├── CASCADE DELETE questionnaire_responses
   ├── CASCADE DELETE lifestyle_contexts
   ├── CASCADE DELETE captures (Triggers S3 Object Purge Worker)
   ├── CASCADE DELETE scan_results
   ├── CASCADE DELETE routines & routine_tracking
   └── SET NULL on security_audit_events.actor_id
5. COMMIT TRANSACTION
6. Invalidate all active JWT tokens in Supabase Auth
```

### Success Response (`200 OK`)

```json
{
  "data": {
    "status": "PURGE_COMPLETED",
    "purgedAt": "2026-09-03T20:32:00.000Z",
    "erasureCertificate": "tombstone_sha256_8f9c1b..."
  },
  "meta": {
    "requestId": "req_prof_delete_01",
    "timestamp": "2026-09-03T20:32:00.350Z"
  }
}
```
