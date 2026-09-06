# AayurFace — Backend & API Architecture Specification
## Current Repository API & Interface Audit

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Date:** 2026-09-03  
**Status:** CURRENT VERIFIED AUDIT  
**Authority:** Principal Backend Architect, API Architect, Security Architect  

---

## 1. Executive Summary

A comprehensive reconnaissance of the current repository (`d:\Project Aayurface`) was conducted to identify all existing network interfaces, API clients, authentication flows, mock services, and database touchpoints.

### Key Reconnaissance Findings:
1. **Zero Active Production Endpoints:** The repository currently operates as a standalone Single Page Application (SPA) with zero deployed backend API routes or serverless endpoints.
2. **Supabase Client Stub (`src/lib/supabase.ts`):** A standard `@supabase/supabase-js` client is initialized using Vite environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), but is currently unused by active UI pages.
3. **Client-Side Mock Authentication (`src/contexts/AuthContext.tsx`):** User registration, login, session persistence, and profile updates are entirely simulated in-browser using `localStorage` keys (`aayurface_users`, `aayurface_session`) with synthetic artificial delays (`delay(300)`).
4. **Simulated Facial Capture & Scan Processing (`src/pages/app/ScanPage.tsx`):** The webcam feed captures video via `react-webcam`, but analysis execution is mocked via a client-side `setTimeout(() => navigate('/results/demo-scan'), 3000)` transition.
5. **Simulated Conversational Assistant (`src/pages/app/ChatPage.tsx`):** Chat messages are stored in ephemeral React state; AI responses are generated via local string matching on keywords (`oily`, `dry`, `acne`) with zero backend or LLM communication.
6. **Static Demo Datasets (`src/lib/mockData.ts`):** Hardcoded JSON arrays supply mock remedies, dosha scores, scan history, and classical herbs.

---

## 2. Comprehensive Current Interface Inventory & Disposition Matrix

| Interface ID | File Location | Method / Mechanism | Caller Component | Stated Purpose | Current Authentication & AuthZ | Input & Output Format | Target Disposition | Target Architecture Replacement |
|---|---|---|---|---|---|---|---|---|
| **INT-CUR-01** | `src/lib/supabase.ts` | `createClient()` | Application Root | Supabase SDK Initialization | None (Reads env vars) | Config Object $\rightarrow$ Supabase Client | **KEEP & HARDEN** | `TARGET`: Official client configured with server-derived JWT and zero client-side service role exposure. |
| **INT-CUR-02** | `src/contexts/AuthContext.tsx` | `signUp()` (Mock) | `RegisterPage.tsx` | User Registration | None (Checks `localStorage`) | `(email, password, fullName)` $\rightarrow$ `User` object | **REPLACE** | `TARGET`: Delegated to Supabase Auth `supabase.auth.signUp()` + server-side profile trigger. |
| **INT-CUR-03** | `src/contexts/AuthContext.tsx` | `signIn()` (Mock) | `LoginPage.tsx` | User Login | None (Checks `localStorage`) | `(email, password)` $\rightarrow$ `User` object | **REPLACE** | `TARGET`: Delegated to Supabase Auth `supabase.auth.signInWithPassword()` returning RS256 JWT. |
| **INT-CUR-04** | `src/contexts/AuthContext.tsx` | `signOut()` (Mock) | `ProfilePage.tsx` | User Logout | None (Clears `localStorage`) | Void $\rightarrow$ Void | **REPLACE** | `TARGET`: Delegated to Supabase Auth `supabase.auth.signOut()` with session invalidation. |
| **INT-CUR-05** | `src/contexts/AuthContext.tsx` | `updateProfile()` (Mock) | `EditProfilePage.tsx` | Update User Details | None (Overwrites `localStorage`)| Partial `User` fields $\rightarrow$ Updated `User` | **REPLACE** | `TARGET`: `PUT /api/v1/profile` with server-side validation and audit logging. |
| **INT-CUR-06** | `src/pages/app/ScanPage.tsx` | `handleCapture()` (Mock)| `ScanPage.tsx` | Facial Scan Execution | None (Client timer) | Captured canvas frame $\rightarrow$ Navigation | **REPLACE** | `TARGET`: `POST /api/v1/captures/sessions` $\rightarrow$ Signed S3 PUT $\rightarrow$ `POST /api/v1/analyses`. |
| **INT-CUR-07** | `src/pages/app/ChatPage.tsx` | `handleSend()` (Mock) | `ChatPage.tsx` | Conversational Guidance | None (Regex string check) | Text string $\rightarrow$ Hardcoded advice | **REPLACE** | `TARGET`: `POST /api/v1/voice/chat` grounded in classical RAG with AI safety filters. |
| **INT-CUR-08** | `src/lib/mockData.ts` | Static JSON Export | `HomePage.tsx`, `LibraryPage.tsx` | Reference Knowledge | None (Static bundle) | Static JS Arrays $\rightarrow$ React UI | **REPLACE** | `TARGET`: `GET /api/v1/remedies`, `GET /api/v1/routines`, `GET /api/v1/history`. |
| **INT-CUR-09** | `src/routes/guards.tsx` | React Router Guards | `routes/index.tsx` | Route Protection | Client-side `user !== null` check| Boolean state $\rightarrow$ Redirect | **REWORK** | `TARGET`: Authenticated route protection verified against active Supabase JWT session. |

---

## 3. Security Vulnerabilities & Gaps in Current Prototype

1. **VULN-CUR-01 (Insecure Credential Storage):** Passwords and user records in `AuthContext.tsx` are stored in plain unhashed text in browser `localStorage`.
2. **VULN-CUR-02 (Client-Side Identity Spoofing):** User ID is generated via `crypto.randomUUID()` in the browser; no server-side signature validates caller identity.
3. **VULN-CUR-03 (Zero Biometric Protection):** Facial capture occurs in browser memory without formal EXIF stripping, signed upload tokens, or server-side quality gating.
4. **VULN-CUR-04 (Ungrounded Conversational Output):** Chat assistant relies on hardcoded string matching without classical treatise grounding, dosage validation, or medical disclaimer enforcement.
5. **VULN-CUR-05 (Missing Error Contracts):** Prototype catches errors via generic `console.error()` without structured error envelopes or correlation tracking.

---

## 4. Target Disposition Summary

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       INTERFACE DISPOSITION BREAKDOWN                       │
├──────────────────────────────┬───────────────┬──────────────────────────────┤
│ Disposition Action           │ Count         │ Description                  │
├──────────────────────────────┼───────────────┼──────────────────────────────┤
│ KEEP & HARDEN                │ 1             │ Supabase Client SDK instance │
│ REWORK                       │ 1             │ React Router Route Guards    │
│ REPLACE                      │ 7             │ Mock Auth, Scan, Chat, Data  │
│ REMOVE                       │ 0             │ N/A                          │
├──────────────────────────────┼───────────────┼──────────────────────────────┤
│ TOTAL AUDITED INTERFACES     │ 9             │ 100% Accounted For           │
└──────────────────────────────┴───────────────┴──────────────────────────────┘
```
