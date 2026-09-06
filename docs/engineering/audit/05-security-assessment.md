# AayurFace — Engineering Reconnaissance Audit
## Document 05: Security, Authentication & Authorization Audit

**Phase:** Phase 00 — Full Repository & System Reconnaissance  
**Date:** 2026-09-03  
**Auditor:** Security Engineer & Database Engineer  
**Status:** FORENSIC EVIDENCE COLLECTED — CRITICAL VULNERABILITIES IDENTIFIED  

---

### 1. Security Findings Matrix

| Finding ID | Domain | Severity | Description | Current Status |
|---|---|---|---|---|
| **AF-SEC-001** | Authentication | **CRITICAL** | Mock client-side authentication completely bypasses password verification and Supabase Auth. | **CONFIRMED DEFECT** |
| **AF-SEC-002** | Data Protection | **CRITICAL** | User records and mock sessions stored unencrypted in browser `localStorage`. | **CONFIRMED DEFECT** |
| **AF-SEC-003** | Authorization | **CRITICAL** | Supabase Edge Function `analyze-skin` accepts arbitrary `userId` in JSON body with zero token/ownership validation. | **CONFIRMED DEFECT** |
| **AF-SEC-004** | Secrets Management | **MEDIUM** | Real Supabase Project URL and Anon Key stored in local `.env.local`. Gitignore protects it, but no committed template exists. | **POTENTIAL RISK** |
| **AF-SEC-005** | API Security | **HIGH** | Edge Functions have open wildcard CORS (`Access-Control-Allow-Origin: *`) without rate-limiting. | **CONFIRMED DEFECT** |
| **AF-SEC-006** | Privacy / Consent | **HIGH** | Zero granular consent mechanisms implemented; violates PRD Section 2.2 and facial privacy regulations. | **MISSING FEATURE** |
| **AF-SEC-007** | Prompt Injection | **HIGH** | `ayurveda-chat` concatenates unvalidated user input directly into system context without boundary sanitization. | **CONFIRMED DEFECT** |

---

### 2. Deep Forensic Analysis of Vulnerabilities

#### Finding AF-SEC-001: Authentication Bypass via Mock LocalStorage
* **Location:** `src/contexts/AuthContext.tsx` (Lines 52–96)
* **Observation:** The `signUp` and `signIn` methods completely ignore the `password` argument.
* **Evidence:**
  ```typescript
  const signUp = useCallback(async (email: string, _password: string, fullName: string) => {
    // ...
    const newUser: User = {
      id: crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`,
      email,
      full_name: fullName,
      // ...
    };
    users.push(newUser);
    saveStoredUsers(users);
    saveSession(newUser);
  }, []);

  const signIn = useCallback(async (email: string, _password: string) => {
    // ...
    const users = getStoredUsers();
    const existingUser = users.find(u => u.email === email);
    if (!existingUser) throw new Error("Invalid email or password.");
    saveSession(existingUser);
  }, []);
  ```
* **Impact:** Anyone can log into ANY account simply by providing the target's email address. Any password string is accepted. No cryptographic hashing (bcrypt/argon2), no JWT token issuance, and no session expiration exist.
* **Remediation:** Replace mock implementation with genuine `supabase.auth.signUp()` and `supabase.auth.signInWithPassword()`.

#### Finding AF-SEC-002: Hardcoded Google OAuth Simulation
* **Location:** `src/contexts/AuthContext.tsx` (Lines 98–124)
* **Observation:** `signInWithGoogle` generates a hardcoded user object with email `google.user@gmail.com`.
* **Impact:** No genuine OAuth exchange with Google Identity Services occurs.

#### Finding AF-SEC-003: Unauthenticated AI Inference Endpoint
* **Location:** `supabase/functions/analyze-skin/index.ts` (Lines 43–60)
* **Observation:** The Edge Function extracts `userId` directly from the client JSON body:
  ```typescript
  const { imageBase64, userId } = await req.json();
  ```
  It does NOT verify the caller's Authorization header (`Bearer <token>`) against `supabase.auth.getUser()`.
* **Impact:** Any anonymous actor on the internet can invoke this endpoint, submit arbitrary base64 payloads, burn OpenAI API quota, and forge analysis reports under any user's UUID.
* **Remediation:** Enforce Supabase JWT verification on all Edge Functions.

#### Finding AF-SEC-004: Wildcard CORS on Sensitive Endpoints
* **Location:** `supabase/functions/analyze-skin/index.ts` (Lines 44–47) and `ayurveda-chat/index.ts` (Lines 44–47)
* **Observation:**
  ```typescript
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
  ```
* **Impact:** Allows any third-party malicious domain to make cross-origin requests to the AI endpoints.
