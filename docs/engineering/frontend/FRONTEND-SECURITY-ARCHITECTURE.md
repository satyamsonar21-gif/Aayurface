# AayurFace — Frontend Security Specification
## Client Security Architecture, XSS Defenses & Zero-Secret Invariants

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Domain:** Frontend Security & Application Hardening  
**Status:** `AUTHORITATIVE SECURITY ARCHITECTURE`  
**Authority:** Frontend Security Architect, Security Architect  

---

## 1. Zero-Secret Invariant & Credential Isolation

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       ZERO-SECRET CLIENT INVARIANTS                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ ❌ NO Supabase Service-Role Keys in frontend bundle or Vite env variables   │
│ ❌ NO OpenAI / LLM Provider API Keys in client code                         │
│ ❌ NO AWS IAM Credentials or S3 Private Bucket Secrets in client code       │
│ ❌ NO Database Connection Strings or Service Passwords in client code       │
│                                                                             │
│ ✅ ONLY Public Anonymous Keys (`VITE_SUPABASE_ANON_KEY`) and public URLs    │
│ ✅ Server-Authoritative Identity: Backend derives identity from RS256 JWT   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Content Security Policy (CSP) & XSS Defenses

* **Strict DOMPurify Sanitization:** Any dynamic HTML or classical Sanskrit markdown rendered in the UI is parsed through DOMPurify with strict HTML tag whitelisting (`<b>`, `<i>`, `<em>`, `<span>`, `<p>`).
* **Target CSP Header:**
  ```http
  Content-Security-Policy: default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://*.amazonaws.com; connect-src 'self' https://*.supabase.co https://*.amazonaws.com; frame-ancestors 'none';
  ```
* **Anti-Clickjacking:** `X-Frame-Options: DENY` and `frame-ancestors 'none'` prevent embedding in malicious iframes.
* **Open Redirect Defense:** Login redirect query parameters (`/login?redirect=...`) are strictly validated against a relative path whitelist (`path.startsWith('/') && !path.startsWith('//')`).
