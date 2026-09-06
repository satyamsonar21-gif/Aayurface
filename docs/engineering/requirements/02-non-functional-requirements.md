# AayurFace — Engineering Requirements Specification
## Document 02: Non-Functional Requirements (NFR)

**Phase:** Phase 01 — Requirements Engineering, Formalization & Complete Traceability  
**Date:** 2026-09-03  
**Status:** FORMAL ENGINEERING CONTRACT  
**Authority:** Solution Architect, Security Architect, DevOps/SRE Engineer, UX/Accessibility Engineer  

---

### Category 1: Security & Protection (NFR-SEC)

* **NFR-SEC-001 (Cryptographic Authentication):** User authentication shall be managed by Supabase Auth with bcrypt password hashing (work factor $\ge 10$) and asymmetric JWT token signing.
* **NFR-SEC-002 (Token Expiry & Rotation):** Access JWT tokens shall have a maximum validity of 60 minutes; refresh tokens shall rotate upon each use and expire after 30 days of inactivity.
* **NFR-SEC-003 (Server-Side Ownership Enforcement):** The backend shall NEVER accept a client-provided `userId` as proof of authorization. All database queries and Edge Function operations shall enforce `auth.uid() = user_id`.
* **NFR-SEC-004 (Row-Level Security):** Row-Level Security (RLS) policies shall be strictly enabled on 100% of PostgreSQL tables containing user or health data.
* **NFR-SEC-005 (Secret Isolation):** Third-party credentials (including `OPENAI_API_KEY`) shall exist solely in Supabase Edge Function environment secrets and shall NEVER be bundled or transmitted to the client.
* **NFR-SEC-006 (Strict CORS Policy):** Edge Functions shall restrict `Access-Control-Allow-Origin` to verified application origin domains rather than wildcard `*`.
* **NFR-SEC-007 (Rate Limiting):** API endpoints shall enforce rate limiting (e.g., maximum 5 analysis requests per user per hour; maximum 30 chat queries per hour) to prevent denial-of-wallet and quota exhaustion attacks.
* **NFR-SEC-008 (Input Schema Validation):** All incoming API payloads shall be validated against strict Zod/TypeScript schemas before execution; un-whitelisted fields shall be stripped.

---

### Category 2: Biometric Data Privacy & Compliance (NFR-PRIV)

* **NFR-PRIV-001 (Private Object Storage):** All captured facial images shall be stored in private, encrypted Supabase Storage buckets (`facial-captures`); public bucket access shall be forbidden.
* **NFR-PRIV-002 (Time-Limited Signed URLs):** Image access for analysis processing shall utilize cryptographic signed URLs with a maximum Time-To-Live (TTL) of 15 minutes.
* **NFR-PRIV-003 (Zero Biometrics in Application Logs):** Application logging frameworks shall automatically redact base64 strings, image URLs, and user health responses.
* **NFR-PRIV-004 (Data Minimization):** Only the quality-approved single frame shall be transmitted; continuous video frames shall be processed in browser RAM only and discarded immediately.
* **NFR-PRIV-005 (Facial Retention & Purging Lifecycle):** If a user withdraws consent or requests account deletion, all associated facial images in storage buckets shall be permanently purged within 24 hours.

---

### Category 3: Performance & Responsiveness (NFR-PERF)

* **NFR-PERF-001 (Initial Load Time):** The web application shall achieve a First Contentful Paint (FCP) of $\le 1.5$ seconds and Largest Contentful Paint (LCP) of $\le 2.5$ seconds over 4G connections.
* **NFR-PERF-002 (Client Bundle Budget):** The production JavaScript bundle shall not exceed 350 kB (compressed/gzipped) for the initial application chunk.
* **NFR-PERF-003 (Camera Initialization):** Browser camera stream and face mesh model initialization shall complete within 2.0 seconds of user permission grant.
* **NFR-PERF-004 (Quality Gateway Frame Rate):** Client-side face quality evaluation shall process at $\ge 15$ frames per second (FPS) without freezing the UI thread.
* **NFR-PERF-005 (End-to-End Analysis Latency):** From capture submission to results rendering, the multimodal analysis pipeline shall complete within 20 to 40 seconds.
* **NFR-PERF-006 (Database Query Latency):** 95% of standard database queries (profile, history, routines) shall execute within $\le 100$ milliseconds.

---

### Category 4: Accessibility & Inclusivity (NFR-A11Y)

* **NFR-A11Y-001 (WCAG 2.1 AA Compliance):** All user interfaces shall conform to WCAG 2.1 Level AA accessibility standards.
* **NFR-A11Y-002 (Color Contrast Ratio):** Text and interactive controls shall maintain a minimum contrast ratio of 4.5:1 against their backgrounds (3:1 for large text).
* **NFR-A11Y-003 (Complete Keyboard Navigation):** Every interactive control (buttons, links, form inputs, modal dialogs) shall be fully operable via keyboard with visible focus rings.
* **NFR-A11Y-004 (Screen Reader Compatibility):** All custom widgets, badges, progress bars, and camera guidance instructions shall include appropriate ARIA roles, labels, and live region announcements.
* **NFR-A11Y-005 (Reduced Motion Preferences):** The system shall honor `prefers-reduced-motion` media queries by disabling looping decorative animations and transitions.

---

### Category 5: Reliability, Resilience & Availability (NFR-REL)

* **NFR-REL-001 (Graceful Degradation):** In the event of an external AI service failure (OpenAI timeout/outage), the system shall present a safe, non-broken fallback screen with a retry option; it shall never display raw stack traces.
* **NFR-REL-002 (Network Reconnection Resilience):** Transient network disconnections during questionnaire or lifestyle intake shall preserve filled form states in local storage without losing user progress.
* **NFR-REL-003 (Analysis Pipeline Idempotency):** The analysis ingestion endpoint shall be idempotent; network retries on the same capture token shall not create duplicate analysis records or double-charge inference quota.
* **NFR-REL-004 (Target Uptime SLA):** The core consumer web application shall target 99.5% operational availability during active user hours.

---

### Category 6: Observability & Telemetry (NFR-OBS)

* **NFR-OBS-001 (Structured JSON Logging):** Server-side Edge Functions shall output structured JSON logs containing `requestId`, `userId`, `timestamp`, `level`, and `stage`.
* **NFR-OBS-002 (Synthetic Request Correlation):** An end-to-end correlation ID (`x-correlation-id`) shall be generated at capture initiation and passed through all Edge Function and database calls.
* **NFR-OBS-003 (Quality Gateway Metrics):** The system shall aggregate telemetry on capture failure categories (percentage rejected for blur, lighting, or centering) without logging facial data.
* **NFR-OBS-004 (AI Performance Monitoring):** The system shall track inference duration, token consumption, and RAG retrieval latency for all AI operations.

---

### Category 7: Maintainability & Code Quality (NFR-MAINT)

* **NFR-MAINT-001 (Strict Type Safety):** The codebase shall compile with zero TypeScript errors under `tsc -b --noEmit`. Bypassing types via `any` shall be rejected during code review.
* **NFR-MAINT-002 (Zero Linter Warnings):** The codebase shall pass linter checks (`oxlint` / `eslint`) with zero errors and zero unhandled warnings.
* **NFR-MAINT-003 (Automated CI/CD Validation):** Every pull request shall automatically execute unit test suites, type-checking, and production build verification in an automated CI pipeline.
