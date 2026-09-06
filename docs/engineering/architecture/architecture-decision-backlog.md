# AayurFace — Architecture Specification
## Architectural Decision Backlog & Open Questions

**Phase:** Phase 02 — Target System Architecture, ADRs & Implementation Blueprint  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION  
**Authority:** Principal Software Architect, Solution Architect  

---

### 1. Decision Governance

The Architectural Decision Backlog tracks all open product, technical, and regulatory decisions carried forward from Phase 01-C or uncovered during Phase 02 architectural modeling.

**Rule:** Engineering teams MUST NOT unilaterally close open decisions during implementation. Every item in this backlog requires explicit review and approval by the designated decision owner before the corresponding implementation milestone begins.

---

### 2. Carried-Forward Decision Backlog

| Decision ID | Topic | Current Architectural Stance | Options Under Review | Decision Owner | Implementation Deadline / Dependency | Technical & Architectural Impact | Status |
|---|---|---|---|---|---|---|---|
| **DEC-001** | **Target React Major Version (React 18 vs React 19)** | Conditionally retain React 19.2.8; current prototype compiles and bundles cleanly in Vite v8. | **Option A:** Retain React 19.2.8; install modern compatible packages.<br>**Option B:** Downgrade to React 18 LTS if prospective packages (MediaPipe, Recharts, React-PDF) show blocking peer-dependency issues. | Technical Lead / Principal Architect | Milestone 01 (Build Stabilization) | Dictates all frontend dependencies, React Query versions, and typings. | **OPEN DECISION** |
| **DEC-002** | **Brand Design System & Color Palette** | Prototype uses Material Green (`#4CAF50`); PRD specifies Ayurvedic Terracotta (`#C2622D`) and Sage (`#5A7A5C`). | **Option A (Recommended):** Refactor Tailwind tokens to PRD Section 4 heritage palette.<br>**Option B:** Retain Material Green and Cream theme. | Product Manager / Design Lead | Milestone 02 (Module Boundaries) | Governs global design tokens, UI component aesthetics, and WCAG contrast. | **OPEN DECISION** |
| **DEC-003** | **Minimum User Age Eligibility Gate** | Prototype has no age checks; PRD targets general consumers. | **Option A:** Strict 18+ age gate during signup.<br>**Option B:** Allow ages 13–17 with explicit, verifiable parental/guardian consent flow. | Legal Counsel / Compliance Lead | Milestone 03 (Auth & Consent) | Crucial for legal compliance under Indian DPDP Act 2023 (processing minor biometrics). | **OPEN DECISION** |
| **DEC-004** | **Raw Facial Biometric Image Retention** | Architecture supports immediate purge; longitudinal tracking operates on numerical vectors. | **Option A:** Immediate hard-purge post-extraction (zero raw image retention).<br>**Option B:** 30-day retention for visual comparison.<br>**Option C:** User opt-in privacy toggle. | Privacy Officer / Product Manager | Milestone 08 (Storage Ingestion) | Determines cloud storage bills, biometric regulatory exposure, and user trust. | **OPEN DECISION** |
| **DEC-005** | **Multimodal Fusion Weight Calibration** | Architecture enforces configurable weights; initial 40/35/25 is an unvalidated prototyping hypothesis. | **Option A:** Prototyping baseline (Visual 40%, Quiz 35%, Lifestyle 25%).<br>**Option B:** Dynamic weights based on capture quality and input completeness.<br>**Option C:** Offline calibration against expert consensus labels. | AI/ML Architect & Ayurvedic Analyst | Milestone 11 (Fusion Engine) | Directly affects constitutional classification and doshic scoring accuracy. | **OPEN / RESEARCH VALIDATION** |
| **DEC-006** | **Analysis Rate Limiting Policy** | Architecture enforces configurable middleware; proposed baseline is 5 analyses/user/hour. | **Option A:** Fixed limit of 5 analyses per user per hour.<br>**Option B:** Daily allowance (e.g., 3 scans/day) with cooldown period.<br>**Option C:** Tiered subscription / quota system. | DevOps / Finance / Product Manager | Milestone 11 (API Deployment) | Protects OpenAI cloud inference expenditure and prevents denial-of-wallet abuse. | **PROPOSED POLICY** |
| **DEC-007** | **Launch Localization Scope** | Current code is English-only; PRD Section 2.1 designates English and Hindi as core. | **Option A (Recommended):** Launch MVP with English and Hindi (`en`, `hi`); add Marathi and Tamil in V1.<br>**Option B:** Launch MVP with all 6 regional Indian languages. | Product Manager / Localization Lead | Milestone 06 (Onboarding Flow) | Governs translation authoring velocity, Devanagari typography, and QA effort. | **OPEN DECISION** |
| **DEC-008** | **Manual Photo Upload Policy vs Webcam-Only** | Only webcam capture is implemented; upload is disabled in PRD 5.12. | **Option A (Recommended):** Webcam-only for MVP to enforce capture quality gateway standardization.<br>**Option B:** Permit photo upload with asynchronous server-side quality validation. | Computer Vision Lead / Product Manager | Milestone 07 (Capture Gateway) | Balances strict capture quality control against consumer device accessibility. | **OPEN DECISION** |
| **DEC-009** | **PDF Wellness Report Generation Engine** | No PDF package currently installed. | **Option A (Recommended):** Client-side compilation via `@react-pdf/renderer` (zero server load).<br>**Option B:** Server-side Deno Edge Function with headless PDF compilation. | Frontend Architect / Backend Architect | Milestone 14 (V1 Scope Preparation) | Bundle size vs server compute cost and font rendering fidelity. | **PROPOSED** |
| **DEC-010** | **Clinical Research Portal Scheduling** | Consensus labeling workflows defined in research paper, unbuilt in repository. | **Option A (Recommended):** Defer Triple-Practitioner portal to dedicated post-MVP Research Phase.<br>**Option B:** Build clinical annotation tools in MVP. | Principal Product Engineer / Research Lead | Milestone 14 (Post-MVP Planning) | Prevents distraction of core engineering resources from consumer MVP delivery. | **PROPOSED** |
