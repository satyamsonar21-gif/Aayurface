# AayurFace — Database Architecture Specification
## Cross-Phase Data Contradiction Audit & Reconciliation

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL AUDIT SPECIFICATION (Evidence-Based Reconciliation)  
**Authority:** Principal Software Architect, Principal Database Architect  

---

### 1. Cross-Phase Reconciliation Matrix

This audit evaluates potential contradictions between early marketing/PRD statements, Phase 01 requirements, Phase 02 architecture, Phase 03 security, and the Phase 04 target data architecture:

| Conflict ID | Phase 00 / PRD Claim | Phase 02 / Phase 03 Stated Position | Phase 04 Database Resolution | Final Status Classification |
|---|---|---|---|---|
| **CON-01** | PRD stated: *"Instant real-time skin diagnosis."* | Phase 01-C & Phase 03: Platform is non-diagnostic; provides holistic wellness assessments. | **Resolved:** Database schema strictly bars medical disease terminology. Field is named `dominant_dosha`, not `skin_disease`. Status enum bars pathology. | `CONFIRMED NON-DIAGNOSTIC` |
| **CON-02** | Early prototype accepted `userId` in POST body (`analyze-skin`). | Phase 03: High-severity BOLA vulnerability; server must derive identity. | **Resolved:** Database RLS strictly enforces `auth.uid() = user_id`. Server rejects client-supplied `userId` parameters. | `CONFIRMED KERNEL ISOLATION` |
| **CON-03** | PRD implied permanent before/after photo gallery. | Phase 01-C & Phase 03 (DEC-004): Biometric minimization dictates purging raw facial imagery. | **Resolved:** Stated as **OPEN DECISION (DEC-004)**. Schema is decoupled: `scan_results` references `captures.id` with `ON DELETE SET NULL`. If photos are purged post-extraction, numerical observations (`visual_observations`) remain permanently intact. | `OPEN DECISION (DEC-004)` |
| **CON-04** | Prototype stored unconstrained JSONB in `scan_results`. | Phase 02: Target architecture requires normalized entities for reproducible AI. | **Resolved:** JSONB is decomposed into 3NF relational tables (`visual_observations`, `multimodal_fusions`, `recommendation_items`). JSONB is restricted to polymorphic ROI masks. | `CONFIRMED 3NF NORMALIZATION` |
| **CON-05** | PRD claimed: *"Scientific multi-modal fusion: 40% Visual, 35% Questionnaire, 25% Lifestyle."* | Phase 01-C: Weights have not been validated by clinical studies. | **Resolved:** Weights are stored in versioned table `fusion_configurations` and formally tagged as an **INITIAL HYPOTHESIS / PROPOSED CONFIGURATION**, subject to empirical calibration in Milestone 11. | `PROPOSED HYPOTHESIS` |
| **CON-06** | PRD implied full-feature offline mobile app. | Phase 02 (DEC-008): On-device LLM inference and pgvector in browser is unfeasible. | **Resolved:** Database is hosted in cloud PostgreSQL. Offline mode is restricted to client caching of past scan results and active routine checklists via IndexedDB/Service Worker. | `CONFIRMED ONLINE INFERENCE` |
| **CON-07** | Prototype lacked consent persistence. | Phase 03: Mandatory unbundled consent ledger for DPDP/GDPR compliance. | **Resolved:** Added immutable append-only `consents` table recording policy version and client metadata hash. | `CONFIRMED TARGET LEDGER` |
| **CON-08** | Clinical study was assumed part of initial launch. | Phase 02 & Phase 03 (DEC-010): Post-MVP isolation required to prevent blocking launch. | **Resolved:** Research tables (`research.*`) designed in isolated schema and scheduled for Milestone 18 (Post-MVP). | `CONFIRMED POST-MVP ENCLAVE` |
