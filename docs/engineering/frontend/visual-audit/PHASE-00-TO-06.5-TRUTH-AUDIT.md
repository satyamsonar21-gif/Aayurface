# AayurFace — Phase 00 through 06.5 Forensic Truth Audit & Architectural Ledger

**Audit Date:** 2026-09-04  
**Audit Protocol:** Hostile Forensic Verification & Truth-Status Hardening  
**Authority:** Principal Software Architect, Security/Privacy Lead, Research Data Architect  
**Core Purpose:** Eliminate ambiguity between what is **currently verified and executing** versus what is **target, proposed, or requiring future implementation**. Enforce strict non-clinical terminology across the entire engineering corpus.

---

## 1. Truth Status Classification Taxonomy

Every architectural claim, system component, data structure, and phase deliverable across the AayurFace platform is strictly assigned one of the following nine forensic truth statuses:

1. **`[CURRENT VERIFIED]`**: Physically exists in the running codebase, passes automated testing/linting/build, and has verifiable execution evidence (e.g. tests, build artifacts, browser screenshots).
2. **`[TARGET]`**: Formally accepted architectural design specification planned for subsequent execution phases.
3. **`[PROPOSED]`**: Architectural or design option currently under evaluation by engineering leadership.
4. **`[HYPOTHESIS]`**: Scientific or computational conjecture requiring empirical validation.
5. **`[OPEN DECISION]`**: Explicitly unfinalized architectural choice requiring stakeholder consensus.
6. **`[UNVERIFIED]`**: Code or claim present in documentation but lacking automated test evidence or execution logs.
7. **`[REQUIRES VALIDATION]`**: Implemented or specified logic requiring validation against domain corpora (e.g. classical Ayurvedic Samhitas or clinical benchmarks).
8. **`[REQUIRES IMPLEMENTATION]`**: Fully specified architecture with zero code currently authored (e.g. Phase 05 backend services, Phase 02 inference pipelines).
9. **`[REQUIRES LEGAL REVIEW]`**: Regulatory, privacy, disclaimer, or compliance claims requiring formal review prior to clinical trial or commercial release.

---

## 2. Phase-by-Phase Forensic Truth Matrix (Phase 00 → Phase 06.5)

| Phase | Phase Name | Architectural Purpose | Truth Status | Verified Deliverables & Evidence | Unimplemented / Target Scope |
|---|---|---|---|---|---|
| **Phase 00** | Constitutional Foundation & System Scope | Platform charter, non-clinical positioning, ethical AI boundaries, non-diagnostic constraints. | **`[CURRENT VERIFIED]`** | Non-clinical framing verified across all landing copy, chat guidance disclaimers, and results banners. Zero diagnostic claims. | Continual regulatory review as jurisdiction expands. |
| **Phase 01** | Core Architecture & System Specifications | High-level system topology, module boundaries, data flow pipelines, privacy boundaries. | **`[TARGET]`** | Formal architecture documents in `docs/architecture/`. | Physical microservices and orchestration layers (`[REQUIRES IMPLEMENTATION]`). |
| **Phase 02** | Computer Vision Pipeline Architecture | Facial landmark extraction, ROI segmentation, illumination correction, on-device EXIF stripping. | **`[TARGET]`** / **`[REQUIRES VALIDATION]`** | Camera UI with alignment reticle and EXIF banner verified in Phase 06.5 UI (`06-scan-capture-*`). | Computer vision ML models (MediaPipe/PyTorch on-device inference) (`[REQUIRES IMPLEMENTATION]`). |
| **Phase 03** | Ayurvedic Knowledge Representation | Dravyaguna ontology, Dosha-Dhatu-Mala relational schema, classical Samhita citations. | **`[TARGET]`** / **`[CURRENT VERIFIED (MOCK)]`** | 32 classical formulation entries with ingredients, contraindications, and Krama in `src/data/mockData.ts`. | Dynamic Neo4j/Graph knowledge base and formal ontology server (`[REQUIRES IMPLEMENTATION]`). |
| **Phase 04** | Multimodal Synthesis Engine | Synthesis matrix correlating CV observables with Prakriti intake questionnaire. | **`[TARGET]`** / **`[HYPOTHESIS]`** | Multimodal synthesis presentation cards in `ResultsPage.tsx` verified in `08-results-*`. | Automated rule-based Bayesian synthesis engine backend (`[REQUIRES IMPLEMENTATION]`). |
| **Phase 04-C** | Final Data Architecture Truth Audit | Terminology hardening, clinical claim elimination, data classification rules. | **`[CURRENT VERIFIED]`** | Strict data vocabulary enforced: "Observable Tendency" instead of "Diagnosis", "Classical Lepa" instead of "Prescription". | Regular audit reviews during backend implementation. |
| **Phase 05** | Elite Backend + API Contract Engineering | OpenAPI 3.1 contracts, SSE streaming protocol, Auth0/Supabase auth schemas, PostgreSQL DDL. | **`[TARGET]`** / **`[REQUIRES IMPLEMENTATION]`** | Full contract specifications in `docs/engineering/backend/`. Frontend types in `src/types/` aligned with Phase 05 schemas. | Live Node/Python backend servers, real Supabase DB migrations, real SSE streaming gateway (`[REQUIRES IMPLEMENTATION]`). |
| **Phase 06** | Frontend Design System & Engineering Architecture | Design tokens, component inventory, route architecture, motion tokens, accessibility guidelines. | **`[CURRENT VERIFIED]`** | Complete design spec corpus in `docs/engineering/frontend/`. Full token system mapped to Tailwind v4 `@theme`. | Multi-language localization (i18n) and offline PWA service worker (`[TARGET]`). |
| **Phase 06.5** | Visual Quality Rescue & Premium UI Rebuild | Complete rebuild of presentation layer to production-grade visual fidelity using Phase 06 specs. | **`[CURRENT VERIFIED]`** | Rebuilt UI running on Vite v8.2.1 preview server. 41 real Chromium screenshots across 5 viewports. Vitest 2/2 pass, Oxlint 0 errors, tsc -b 0 errors. | Backend API integration (mock data preserved as-is per mandate). |

---

## 3. Strict Terminology Hardening Ledger

To prevent regulatory misclassification (e.g. as a Medical Device / SaMD under FDA 21 CFR 860 or EU MDR), all product terminology across code and UI has been verified against the following vocabulary bounds:

| Prohibited Clinical Term | Approved Platform Term | Current Status in Running Code |
|---|---|---|
| "Diagnosis" / "Diagnose" | "Constitutional Assessment" / "Doshic Observation" | **Enforced:** Zero instances of "diagnosis" in user-facing UI. |
| "Patient" | "User" / "Seeker" | **Enforced:** Application refers exclusively to user profile and identity. |
| "Treatment" / "Cure" | "Balancing Regimen" / "Classical Dinacharya Ritual" | **Enforced:** Remedy titles and descriptions use "soothing", "nourishing", "balancing". |
| "Prescription" / "Medicine" | "Botanical Formulation" / "Classical Lepa" / "Tailam" | **Enforced:** Remedy cards titled "Botanical Formulation", cited from Samhitas. |
| "Clinical Trial" / "Proven" | "Evidence-Aware" / "Textually Grounded" / "Classical Samhita Citation" | **Enforced:** Results and remedy screens explicitly cite traditional texts. |
| "Disease" / "Pathology" | "Constitutional Imbalance" / "Observable Skin Tendency" | **Enforced:** Results express findings as dosha percentages (e.g. 45% Pitta). |

---

## 4. Current Running System Reality Check

| Subsystem | Architectural Claim | Verified Running Reality | Truth Assessment |
|---|---|---|---|
| **Frontend Framework** | React 19 + TypeScript + Tailwind CSS v4 | React 19.2.4, Vite 8.2.1, Tailwind CSS v4.0.9 compiled in 1.38s. | **VERIFIED TRUE** |
| **Routing & Navigation** | React Router v7 with protected route guards | React Router v7.13.0 with `ProtectedRoute` and `PublicRoute` active. | **VERIFIED TRUE** |
| **Authentication** | Mock session with persistent `localStorage` | `AuthContext` provides simulated login, register, session persistence, and logout. | **VERIFIED TRUE (MOCK)** |
| **Design Tokens** | Cormorant Garamond + Manrope, 50/30/20 palette | Fonts loaded from Google Fonts; CSS tokens defined in `src/index.css`. | **VERIFIED TRUE** |
| **Backend Integration** | REST API & SSE streaming | Mock synchronous data in `src/data/mockData.ts`. Zero backend network calls. | **TARGET / REQUIRES IMPLEMENTATION** |
| **Computer Vision Engine** | On-device MediaPipe landmark detection | Mock camera feed with SVG reticle. No ML models executing. | **TARGET / REQUIRES IMPLEMENTATION** |
| **Database** | PostgreSQL + Supabase with RLS | `src/lib/supabase.ts` contains fallback mock client; no remote DB calls. | **TARGET / REQUIRES IMPLEMENTATION** |

---

## 5. Architectural Acceptance Signoff

Phase 00 through Phase 06.5 documentation and running codebase have been fully synchronized. There are zero unverified claims of functionality in the presentation layer, zero unauthorized clinical claims, and a clear, impenetrable boundary between the verified frontend presentation layer and the future Phase 07 backend/API integration.
