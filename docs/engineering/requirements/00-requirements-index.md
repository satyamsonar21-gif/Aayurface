# AayurFace — Engineering Requirements Specification
## Document 00: Requirements Index, Classification System & Governance

**Phase:** Phase 01 — Requirements Engineering, Formalization & Complete Traceability  
**Date:** 2026-09-03  
**Status:** FORMAL ENGINEERING CONTRACT  
**Authority:** Principal Requirements Engineer, Solution Architect, Compliance Lead  

---

### 1. Purpose & Scope of Phase 01

Phase 00 forensic reconnaissance revealed that the current repository is a disconnected client-side prototype operating on synthetic mock data, bypassing authentication, computer vision, multimodal fusion, confidence scoring, and RAG knowledge retrieval.

Phase 01 establishes the **formal engineering contract** for all future development. It converts the product vision (`D:\aayurface prd.txt` v1.0), the clinical/scientific research paper (`D:\AayurFace Research.pdf`), and the Phase 00 reconnaissance findings into an atomic, testable, traceable, and unambiguous requirements baseline.

**Core Invariant:** During this phase, zero feature code is written, zero migrations are applied, and zero architectures are implemented. Requirements strictly precede architecture.

---

### 2. Source-of-Truth Hierarchy

All requirements and constraints in this specification derive from a rigorous 6-level evidence hierarchy:

* **Level 1 (Highest Confidence — Empirical Reality):** Actual repository behavior, executed tests, compiler errors (`npm run build` failure), existing source code, and existing Supabase DDL.
* **Level 2 (Approved Product Specifications):** Approved Product Requirements Document (`D:\aayurface prd.txt`), committed Phase 00 audit documents (`docs/engineering/audit/`).
* **Level 3 (Domain & Scientific Guidance):** AayurFace Technical & Strategic Intelligence Report (`D:\AayurFace Research.pdf`), dermatological foundation models, classical Ayurvedic taxonomies (Charaka/Sushruta Samhita).
* **Level 4 (Direct User Directives):** Explicit engineering instructions provided by the project leads.
* **Level 5 (Engineering Inferences):** Logical deductions made by senior architects to resolve gaps; strictly labeled as `INFERENCE` or `PROPOSED`.
* **Level 6 (General Industry Heuristics):** WCAG 2.1 AA accessibility guidelines, OWASP API Security Top 10, ISO/IEC/IEEE 29148 requirements engineering standards.

---

### 3. Classification System

Every requirement belongs to one or more formal categories:

1. **[FR] Functional Requirements:** Observable, testable software behaviors, workflows, inputs, and outputs.
2. **[NFR] Non-Functional Requirements:** Quality attributes including Performance, Security, Privacy, Accessibility, Reliability, and Observability.
3. **[BR] Business Rules:** Domain constraints, logical boundaries, invariant truths, and clinical/ethical guardrails.
4. **[AI] Artificial Intelligence Requirements:** Multimodal fusion, confidence scoring, uncertainty representation, explainability (XAI), RAG retrieval, and safety filters.
5. **[CV] Computer Vision Requirements:** Real-time capture quality gateway, MediaPipe Face Mesh landmarking, lighting/blur/centering checks, and biometric feature extraction.
6. **[DATA] Data Requirements:** Conceptual domain models, attributes, sensitivity classifications, ownership, and retention rules.
7. **[API] API Requirements:** Conceptual serverless endpoint contracts, request/response schemas, error handling, and authorization rules.
8. **[UX / A11Y] User Experience & Accessibility Requirements:** Responsive layout rules, cognitive clarity, keyboard navigation, and WCAG 2.1 AA conformance.
9. **[DEC] Human / Product Decisions:** Underspecified items requiring explicit stakeholder resolution before architectural finalization.

---

### 4. Requirement ID Convention

All identifiers are globally unique, immutable, and strictly structured:

* `FR-[DOMAIN]-[NUM]` (e.g., `FR-AUTH-001`, `FR-CAP-001`, `FR-FUS-001`)
* `NFR-[CATEGORY]-[NUM]` (e.g., `NFR-SEC-001`, `NFR-PRIV-001`, `NFR-PERF-001`)
* `BR-[DOMAIN]-[NUM]` (e.g., `BR-CAP-001`, `BR-FUS-001`, `BR-SAF-001`)
* `AI-[SUBDOMAIN]-[NUM]` (e.g., `AI-CV-001`, `AI-FUS-001`, `AI-RAG-001`)
* `DATA-[NUM]` (e.g., `DATA-001`, `DATA-002`)
* `API-[NUM]` (e.g., `API-001`, `API-002`)
* `DEC-[NUM]` (e.g., `DEC-001`, `DEC-002`)
* `JRN-[LETTER]` (e.g., `JRN-A`, `JRN-B`)

---

### 5. Document Structure & Specification Map

This specification consists of 20 standardized engineering documents located in `docs/engineering/requirements/`:

| Doc # | File | Contents |
|---|---|---|
| **00** | `00-requirements-index.md` | Requirements Index, Classification, ID Convention & Governance (This Document) |
| **01** | `01-functional-requirements.md` | Atomic Functional Requirements across all 14 product modules |
| **02** | `02-non-functional-requirements.md` | Non-Functional Requirements (Security, Privacy, Performance, A11y, Reliability) |
| **03** | `03-business-rules.md` | Core Business Rules & Invariant Constraints |
| **04** | `04-user-roles-and-permissions.md` | User Roles, Actors, and Role-Capability Matrix |
| **05** | `05-user-journeys.md` | Complete Step-by-Step User Journeys (A through G) |
| **06** | `06-acceptance-criteria.md` | Formal GIVEN / WHEN / THEN Acceptance Criteria for all major FRs |
| **07** | `07-ai-requirements.md` | AI Architecture, Fusion Engine, Confidence Scoring, XAI & RAG Grounding |
| **08** | `08-cv-requirements.md` | Computer Vision Pipeline, Quality Gateway & Feature Extraction |
| **09** | `09-security-privacy-requirements.md` | Security Architecture, Consent Lifecycle & Facial Data Privacy |
| **10** | `10-data-requirements.md` | Conceptual Domain Data Models, Relationships, Sensitivity & Lifecycle |
| **11** | `11-api-requirements.md` | Serverless API Contracts, Endpoints, Schemas & Idempotency |
| **12** | `12-state-taxonomy.md` | Finite State Models (Auth, Capture, Analysis, Knowledge, Routine) |
| **13** | `13-error-taxonomy.md` | Standardized Error Taxonomy, Codes, Diagnostics & User Guidance |
| **14** | `14-versioning-requirements.md` | Version Tracking for Models, Knowledge Base, Rules & Schemas |
| **15** | `15-mvp-v1-v2-roadmap.md` | Phased Release Boundaries (MVP vs V1 vs V2 vs Research) |
| **16** | `16-conflicts-gaps-decisions.md` | Conflict Register, Gap Analysis & Human Decision Register |
| **17** | `17-requirement-traceability-matrix.md` | Complete Traceability Matrix (Req → Story → UI → API → DB → Test) |
| **18** | `18-requirement-quality-audit.md` | Quality Audit against ISO/IEC/IEEE 29148 Criteria |
| **19** | `19-phase-01-final-report.md` | Comprehensive Phase 01 Engineering Report & Phase Gate Decision |

---

### 6. Requirement Change Control & Governance

To maintain integrity and prevent implementation drift:
1. **No Silent Modifications:** Implementation teams in Phase 02+ may NOT unilaterally alter requirement scopes, acceptance criteria, or security boundaries.
2. **Change Protocol:** Any requested change must be documented as a formal Change Proposal specifying: (a) Requirement ID, (b) Rationale, (c) Technical impact, (d) Security/Privacy implications, and (e) Test suite modifications.
3. **Approval Threshold:** Changes to P0/MVP requirements require unanimous approval from the Principal Architect, Security Lead, and Product Manager.
