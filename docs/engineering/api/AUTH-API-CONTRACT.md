# API Contract: Authentication & Session Management
## Delegated Supabase Auth Contracts & Webhook Sync

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Identity & Authentication  
**Status:** `TARGET / EXTERNAL DELEGATION`  
**Authority:** Security Architect, Principal Backend Architect  

---

## 1. Architectural Scope & Delegation Boundary

AayurFace delegates all user registration, password hashing (Argon2/bcrypt), email verification, session rotation, and multi-factor authentication (MFA) to **Supabase Auth** (`auth.users`).

The AayurFace backend gateway **never** manages raw password hashes or session tokens directly. Instead, the backend:
1. Verifies the cryptographic RS256 signature of Supabase JWT bearer tokens on all protected `/api/v1/*` routes.
2. Synchronizes newly created user records via a server-side PostgreSQL trigger (`on_auth_user_created`) into the application `profiles` table.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION DELEGATION TOPOLOGY                       │
├─────────────────────────────────────────────────────────────────────────────┤
│   [ Client SPA ]                                                            │
│         │                                                                   │
│         ├──► 1. POST /auth/v1/signup (email, password) ──► [ Supabase Auth ]│
│         │                                                         │         │
│         │                                         DB Trigger      ▼         │
│         │                                         INSERT profiles Row       │
│         │                                                                   │
│         └──► 2. GET /api/v1/profile ──► [ Edge Gateway ] ──► [ PostgreSQL ] │
│                 (Bearer RS256 JWT)       Verify auth.uid()     RLS Engine   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Delegated Supabase Auth Endpoints

### 2.1 API-AUTH-001: User Registration (`POST /auth/v1/signup`)
* **Actor:** Anonymous Public User
* **Delegation:** Supabase Auth Service
* **Request Payload:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "data": {
      "full_name": "Priya Sharma",
      "preferred_language": "en"
    }
  }
  ```
* **Success Response (`200 OK`):**
  ```json
  {
    "id": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f80",
    "aud": "authenticated",
    "role": "authenticated",
    "email": "user@example.com",
    "created_at": "2026-09-03T20:30:00.000Z"
  }
  ```
* **Database Trigger Side Effect (ACID Atomic):**
  ```sql
  -- Target Database Trigger on auth.users
  INSERT INTO public.profiles (id, full_name, preferred_language, created_at)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'en', NOW());
  ```

### 2.2 API-AUTH-002: User Login (`POST /auth/v1/token?grant_type=password`)
* **Actor:** Anonymous User
* **Delegation:** Supabase Auth Service
* **Request Payload:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
  ```
* **Success Response (`200 OK`):**
  ```json
  {
    "access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6...",
    "token_type": "bearer",
    "expires_in": 3600,
    "refresh_token": "8f8b89c7-...",
    "user": {
      "id": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f80",
      "email": "user@example.com"
    }
  }
  ```

### 2.3 API-AUTH-003: User Logout (`POST /auth/v1/logout`)
* **Actor:** Authenticated User
* **Header:** `Authorization: Bearer <jwt>`
* **Success Response (`204 No Content`):** Revokes session in `auth.sessions`.

---

## 3. JWT Claims Verification & Server Identity Extraction

Every request entering the `/api/v1/*` boundary is verified by Edge middleware against the Supabase JWT Public Key:

```typescript
// Target JWT Verification Middleware (Deno Edge Function)
export interface SupabaseJwtPayload {
  iss: string;            // "https://<project-ref>.supabase.co/auth/v1"
  sub: string;            // "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f80" (auth.uid)
  aud: string;            // "authenticated"
  exp: number;            // Expiration timestamp
  role: string;           // "authenticated" | "service_role" | "admin"
  email: string;          // User email address
  app_metadata: {
    provider?: string;
    roles?: string[];
  };
  user_metadata: {
    full_name?: string;
  };
}
```

### Security Invariants:
1. **Server-Derived `auth.uid()`:** All domain services extract user identity directly from `payload.sub`.
2. **Expired Token Rejection:** Requests with `exp < Math.floor(Date.now() / 1000)` are immediately rejected with `401 Unauthorized` (`AUTH_TOKEN_EXPIRED`).
3. **Audit Log Emission:** Failed authentication attempts emit an immutable `AUTH_LOGIN_FAILURE` record to `security_audit_events`.
