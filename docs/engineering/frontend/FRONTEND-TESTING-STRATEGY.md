# AayurFace — Frontend Testing Strategy
## Multi-Tier Test Pyramid, MSW Contract Mocks & E2E Critical Journeys

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Domain:** Quality Assurance & Automated Testing  
**Status:** `PLANNED TESTING STRATEGY (REQUIRES IMPLEMENTATION & EXECUTION IN PHASE 07)`  
**Authority:** QA Architect, Principal Frontend Architect  

---

## 1. Multi-Tier Frontend Test Pyramid

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       FRONTEND TEST PYRAMID ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ • Tier 1: Unit & Utility Tests (Vitest) ── Pure math, date, and parsers    │
│ • Tier 2: Component & Hook Tests (React Testing Library + Vitest)           │
│ • Tier 3: API Integration & MSW Contract Tests (Mock Service Worker)        │
│ • Tier 4: Automated Accessibility Tests (jest-axe / axe-core)               │
│ • Tier 5: End-to-End User Journey Tests (Playwright Browser Automation)     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. The 17 Critical User Journey E2E Test Suite

| Test ID | Critical User Journey | Key Interaction Flow | Success Assertion Criteria |
|---|---|---|---|
| **E2E-FE-01** | First Visit & Landing | Navigate `/` $\rightarrow$ View trust pillars $\rightarrow$ Click "Begin Journey" | Lands on `/signup` with clean form. |
| **E2E-FE-02** | User Registration | Fill email/password $\rightarrow$ Submit | User created $\rightarrow$ Redirects to `/onboarding`. |
| **E2E-FE-03** | Granular Consent | Toggle biometric/wellness consents $\rightarrow$ Grant | Consents recorded in DB ledger $\rightarrow$ Advance. |
| **E2E-FE-04** | 15-Question Intake | Answer all 15 Prakriti questions $\rightarrow$ Submit | Responses persisted $\rightarrow$ Onboarding marked complete. |
| **E2E-FE-05** | Camera Permission Denial | Click "Scan" $\rightarrow$ Deny browser camera | Graceful modal explains need + Upload Photo fallback. |
| **E2E-FE-06** | Facial Scan Capture | Center face $\rightarrow$ Quality approved $\rightarrow$ Auto-snap | Image EXIF stripped $\rightarrow$ Uploaded to S3 $\rightarrow$ 202 Accepted. |
| **E2E-FE-07** | Analysis Polling | Watch 12-stage progress | Updates stage every 1.5s $\rightarrow$ Completes $<8\text{s}$. |
| **E2E-FE-08** | Results & Gauge | View Doshic balance | Displays Vata/Pitta/Kapha percentages + confidence. |
| **E2E-FE-09** | Explainability Inspection | Click "Why am I seeing this?" | Expands 7-pillar accordion with classical verse chunk. |
| **E2E-FE-10** | Low-Agreement Result | Mock clashing scan vs quiz ($A < 0.60$) | Confidence capped $<60\%$ + dual-balancing notice shown. |
| **E2E-FE-11** | Routine Adoption | Click "Adopt to Routine" on lepa card | Routine updated $\rightarrow$ Navigates to `/routine`. |
| **E2E-FE-12** | Habit Tracking | Check off morning routine item | Checkbox animates $\rightarrow$ Streak increments (Optimistic). |
| **E2E-FE-13** | Scan History Keyset | Scroll down `/history` | Fetches next keyset page without duplicates or drift. |
| **E2E-FE-14** | Longitudinal Progress | View `/progress` | Renders 30-day delta vector charts vs baseline. |
| **E2E-FE-15** | Voice Guide Query | Speak query $\rightarrow$ Receive grounded reply | LLM reply formatted with classical citations + disclaimer. |
| **E2E-FE-16** | Public Share Link | Generate 256-bit link $\rightarrow$ Open in incognito | Public view loads de-identified assessment (Zero PII). |
| **E2E-FE-17** | Account Deletion | Confirm erasure in Privacy Center | Cascading purge executes $\rightarrow$ Session invalidated. |
