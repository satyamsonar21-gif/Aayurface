# Architecture Decision Record: ADR-012
## Authentication & Authorization Boundary: Cryptographic Identity & Server-Side Token Derivation

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Deciders:** Security Architect, Staff Backend Architect, Principal Software Architect  
**Technical Area:** Identity & Multi-Tenant Authorization  

---

### 1. Context
The existing repository uses a mock authentication context in `src/contexts/AuthContext.tsx` that persists mock user JSON in browser `localStorage`, completely ignores passwords, and allows client components to pass unverified `userId` strings directly to Edge Functions.

### 2. Problem
Completely decommissioning the insecure mock authentication mechanism and establishing a zero-trust authorization boundary where clients cannot forge or tamper with user identities.

### 3. Options Evaluated
* **Option A: Custom JWT & Node.js Session Server:** Implement custom session middleware and JWT issuing logic.
* **Option B: Supabase Auth with Strict Server-Side Identity Derivation (Selected):** Standard bcrypt/Argon2 password hashing, RS256-signed JWTs, and middleware extraction of `auth.uid()`.
* **Option C: Third-Party Auth0 / Clerk Integration:** Delegate identity to external SaaS.

### 4. Decision
Adopt **Option B: Supabase Auth with Strict Server-Side Identity Derivation**.
1. Decommission mock `localStorage` auth completely.
2. User authentication is managed by Supabase Auth (email/password + Google OAuth PKCE).
3. Backend Edge Functions extract the caller's identity exclusively from the cryptographically verified JWT payload (`auth.uid()`). Client-supplied `userId` parameters in request bodies are strictly rejected.
4. Database tables enforce Row-Level Security (`USING (auth.uid() = user_id)`).

### 5. Rationale
* **Zero Trust:** Even if a malicious actor modifies client JavaScript to request another user’s analysis ID, the database physically returns zero rows.
* **Native Co-location:** Supabase Auth natively synchronizes user sessions with PostgreSQL RLS context without custom microservices.

### 6. Consequences
* *Positive:* Complete elimination of BOLA/IDOR vulnerabilities, secure password storage, automatic token rotation.
* *Negative:* Requires rewriting `src/contexts/AuthContext.tsx` and updating all page components that read mock auth state.

### 7. Risks & Mitigations
* *Risk:* Access token theft via Cross-Site Scripting (XSS).
* *Mitigation:* Enforce strict Content Security Policy (CSP), sanitize all dynamic HTML, and keep token lifetimes short (60 minutes).

### 8. Evidence
Phase 00 forensic audit highlighted mock auth as the #1 critical security vulnerability.

### 9. Revisit Conditions
Revisit if enterprise SAML/SSO integration is required for clinical institutional deployments.
