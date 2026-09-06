# AayurFace — Security Architecture Specification
## Authorization, RBAC & Contextual Permissions Matrix

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Security Architect, Staff Backend Architect, Platform Architect  

---

### 1. Multi-Tier Authorization Model

Authorization in AayurFace is evaluated across three sequential gates:

```text
Request ──► [1. RBAC Check] ──► [2. Resource Ownership Check] ──► [3. Contextual Gate] ──► Execution
                │                             │                              │
          Role Allowed?                 User Owns ID?                 Consent Active?
          (anon / auth / admin)         (auth.uid() == user_id)       (biometric_processing)
```

1. **Role-Based Access Control (RBAC):** Coarse-grained role verification derived from JWT claims (`app_metadata.role`).
2. **Resource Ownership Enforcement:** Fine-grained tenant verification ensuring that the caller owns the targeted record.
3. **Contextual & Policy Gating:** Verification of active, unrevoked consent flags, rate-limit allowances, and account status.

---

### 2. User & System Actor Taxonomy

| Actor ID | Actor Role | Description & Typical Identity Source | Privilege Level |
|---|---|---|---|
| **ACT-01** | **Anonymous Visitor** | Unauthenticated public web user accessing landing page or login view. | Minimal (Public reads only) |
| **ACT-02** | **Authenticated User** | General consumer logged in via verified Supabase Auth JWT (`role: authenticated`). | Standard (Own data only) |
| **ACT-03** | **System Administrator** | Engineering/operations personnel with verified `role: admin` and MFA. | High (Platform management) |
| **ACT-04** | **Ayurvedic Expert** | Certified Ayurvedic doctor reviewing literature or participating in consensus. | Domain Authority |
| **ACT-05** | **Research Annotator** | Practitioner performing double-blind annotations on de-identified images. | Restricted Research |
| **ACT-06** | **Research Reviewer** | Senior Ayurvedic researcher arbitrating consensus label discrepancies. | Research Adjudication |
| **ACT-07** | **System / Worker** | Automated background worker executing asynchronous feature extraction via service token. | Internal Service Privileges |

---

### 3. Comprehensive Granular Permission Matrix

| Resource Area | Action / Operation | Anonymous Visitor | Authenticated User | System Administrator | Research Annotator | System / Worker | Authorization Enforcement Mechanism |
|---|---|---|---|---|---|---|---|
| **Public Landing & Assets** | Read landing copy, styles, public disclaimers | **ALLOW** | **ALLOW** | **ALLOW** | **ALLOW** | **ALLOW** | Edge CDN / Static Web Server |
| **Authentication** | Register account, login, request password reset | **ALLOW** | **ALLOW** | **ALLOW** | **ALLOW** | **DENY** | Supabase Auth API (`/auth/v1/*`) |
| **User Profile** | Read / Update own profile (`profiles`) | **DENY** | **ALLOW (Own Only)** | **ALLOW (Read Audit)** | **DENY** | **ALLOW (Scoped)** | PostgreSQL RLS: `auth.uid() = id` |
| **User Profile** | Delete own account and cascade purges | **DENY** | **ALLOW (Own Only)** | **ALLOW (With Audit)** | **DENY** | **DENY** | API Middleware + Re-auth verification |
| **Consent Management** | Grant, inspect, or revoke consent scopes | **DENY** | **ALLOW (Own Only)** | **ALLOW (Read Audit)** | **DENY** | **DENY** | PostgreSQL RLS: `auth.uid() = user_id` |
| **Capture Quality Gateway** | Execute client Wasm landmark quality check | **ALLOW (In RAM)** | **ALLOW (In RAM)** | **ALLOW (In RAM)** | **DENY** | **DENY** | Client WebAssembly Browser RAM |
| **Image Upload (S3)** | Obtain signed S3 PUT upload URL | **DENY** | **ALLOW (Own Path)** | **DENY** | **DENY** | **ALLOW** | Edge API: `POST /api/v1/captures/upload-url` |
| **Biometric Image Access** | Read or download raw facial capture frame | **DENY** | **ALLOW (Own Signed)** | **DENY (Zero Direct)** | **DENY** | **ALLOW (Scoped)** | Ephemeral signed URL (Proposed 15m TTL) |
| **Analysis Orchestration** | Trigger multimodal analysis pipeline | **DENY** | **ALLOW (Own Only)** | **DENY** | **DENY** | **ALLOW** | Edge Function: JWT verification + Rate limit |
| **Analysis Results** | View analysis history & recommendations | **DENY** | **ALLOW (Own Only)** | **DENY** | **DENY** | **ALLOW** | PostgreSQL RLS: `auth.uid() = user_id` |
| **Daily Routines** | View and toggle daily ritual adherence | **DENY** | **ALLOW (Own Only)** | **DENY** | **DENY** | **DENY** | PostgreSQL RLS: `auth.uid() = user_id` |
| **PDF Export** | Generate & download PDF wellness report | **DENY** | **ALLOW (Own Only)** | **DENY** | **DENY** | **ALLOW** | Ephemeral token / Client-side generation |
| **Classical Texts (RAG)** | Query classical compendium chunks | **DENY** | **ALLOW (Query Read)** | **ALLOW (Full CRUD)** | **ALLOW (Read)** | **ALLOW (Search)** | Read-only RLS policy for authenticated users |
| **Classical Texts (Admin)** | Ingest, update, or remove classical verses | **DENY** | **DENY** | **ALLOW** | **DENY** | **DENY** | Admin RBAC check + Cryptographic sign-off |
| **Research Datasets** | View de-identified subject cohorts | **DENY** | **DENY** | **ALLOW** | **ALLOW (Blind Only)** | **ALLOW** | Dedicated research schema & RLS policies |
| **Expert Annotations** | Submit Tridosha consensus rating | **DENY** | **DENY** | **DENY** | **ALLOW (Assigned)** | **DENY** | Annotator queue check: `practitioner_id = auth.uid()` |
| **Security Audit Logs** | Query platform security logs & SIEM | **DENY** | **DENY** | **ALLOW (Security)** | **DENY** | **DENY** | Dedicated WORM audit vault access controls |
