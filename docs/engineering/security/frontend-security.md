# AayurFace — Security Architecture Specification
## Frontend Client Security, Browser Storage Policy & Security Headers

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Staff Frontend Architect, Principal Security Architect  

---

### 1. Forensic Audit of Current Prototype Insecurities

The Phase 00 forensic audit and Phase 02 reconnaissance identified critical client-side security vulnerabilities in the existing prototype that must be decommissioned during implementation:

| Current Prototype Vulnerability | Source Location | Forensic Evidence | Risk Classification | Target Architecture Replacement |
|---|---|---|---|---|
| **Plain-Text Mock Auth in `localStorage`** | `src/contexts/AuthContext.tsx` | Serializes mock user JSON directly to browser `localStorage`; completely ignores password verification. | **CRITICAL CURRENT SECURITY WEAKNESS** | Replace completely with Supabase Auth managing cryptographically signed RS256 JWTs stored in memory. |
| **Wildcard CORS (`*`) on Edge Functions** | `supabase/functions/analyze-skin/`, `ayurveda-chat/` | Edge functions return `Access-Control-Allow-Origin: *`, permitting arbitrary cross-origin sites to invoke backend services. | **CRITICAL CURRENT SECURITY WEAKNESS** | Replace with strict origin whitelist (`https://app.aayurface.in`) and credentials verification. |
| **Client-Supplied Identity Spoofing** | `src/pages/app/ScanPage.tsx` | Passes unverified mock strings as identity without server JWT validation. | **HIGH CURRENT SECURITY WEAKNESS** | Decommission client `userId` passing; derive identity exclusively from verified JWT bearer token. |
| **Simulated 3-Second Timer Scan** | `src/pages/app/ScanPage.tsx` | Uses static `setTimeout` without camera landmarking or illumination quality checks. | **PROTOTYPE LIMITATION** | Replace with client-side WebAssembly MediaPipe FaceMesh capture quality gateway. |

---

### 2. Browser Storage Policy Architecture

The client browser environment is an untrusted host susceptible to Cross-Site Scripting (XSS) and malicious browser extensions. Strict storage boundaries are mandated:

| Browser Storage Mechanism | Permitted Data Assets | Prohibited Data Assets | Security Rationale |
|---|---|---|---|
| **Volatile Client RAM (In-Memory)** | Active RS256 Access Token (JWT), MediaPipe 468 landmark coordinates, active video stream frames, uncompressed captured frame bitmap. | None. Memory drops automatically upon tab close or page reload. | Protects biometrics and tokens from persisting on shared or compromised host disks. |
| **`localStorage`** | UI theme preference (`light` / `dark`), language selection (`en` / `hi`), dismissed walkthrough guide state. | **STRICTLY PROHIBITED:** Passwords, refresh tokens, raw facial captures, base64 image strings, detailed health questionnaire answers. | Data in `localStorage` is perpetually accessible to any script executing within the origin (high XSS vulnerability). |
| **`sessionStorage`** | Multi-step onboarding form draft state (cleared upon tab closure). | Raw biometric images, long-lived tokens. | Ephemeral to the active browser tab; minimizes cross-tab leakage. |
| **`IndexedDB`** | MediaPipe WebAssembly model cache (`face_mesh.wasm`). | User biometric data, analysis results, health inputs. | Caches immutable public binary models for performance; stores zero user personal data. |
| **`HttpOnly` Secure Cookies** | Session renewal refresh token (if web cookie mode is enabled). | Non-session user health data. | `HttpOnly` flag prevents JavaScript access, completely neutralizing XSS token exfiltration. |

---

### 3. Enterprise Content Security Policy (CSP) & Security Headers

To completely neutralize Cross-Site Scripting (XSS), clickjacking, and MIME confusion attacks, the production edge host (Vercel / Cloudflare) must emit strict HTTP security headers:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' blob: data: https://*.supabase.co; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.openai.com; media-src 'self' blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(self), microphone=(self), geolocation=(), payment=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

#### Rationale for CSP Directives:
* `script-src 'self' 'wasm-unsafe-eval'`: Restricts script execution strictly to the bundled application origin. `'wasm-unsafe-eval'` is explicitly constrained to allow WebAssembly compilation of MediaPipe FaceMesh while prohibiting arbitrary `eval()` execution.
* `frame-ancestors 'none'` / `X-Frame-Options: DENY`: Prevents the application from being embedded inside an `<iframe>` on any third-party domain, completely eliminating clickjacking attacks.
* `Permissions-Policy`: Restricts browser hardware access. Camera and microphone permissions are granted exclusively to the first-party origin; geolocation and payment APIs are globally disabled.
* `Strict-Transport-Security (HSTS)`: Enforces HTTPS communication for a minimum of two years with preload registration, eliminating SSL-stripping MitM attacks.
