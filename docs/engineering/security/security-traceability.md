# AayurFace — Security Architecture Specification
## Master Security Traceability Matrix (PRD to Evidence)

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Requirements Engineer, Security Architect, QA/Test Architect  

---

### 1. Master Traceability Framework

This matrix establishes end-to-end bidirectionally verifiable lineage from foundational business requirements to STRIDE threats, formal security requirements, architectural specifications, future engineering milestones, and acceptance test suites:

| PRD Business Requirement | Threat Model ID | Formal Security Requirement | Architectural Specification Document | Target Engineering Milestone | Verification Test Suite | Target Acceptance Evidence |
|---|---|---|---|---|---|---|
| **BR-AI-001 (Non-Diagnostic Safety)** | `TH-09`, `TH-49` | `SEC-AI-003` | [`ai-security.md`](file:///D:/Project%20Aayurface/docs/engineering/security/ai-security.md) | Milestone 12 | `TST-SEC-10` (Jailbreak Suite) | Diagnostic words scrubbed or dropped; fallback notice served. |
| **BR-AI-002 (Explainable Tridosha)** | `TH-38` | `SEC-AI-002` | [`ai-security.md`](file:///D:/Project%20Aayurface/docs/engineering/security/ai-security.md) | Milestone 12 | `TST-SEC-11` (Output Contract) | Output matches Zod schema; classical citations validated. |
| **BR-SYS-001 (Multi-Tenant Isolation)** | `TH-01`, `TH-18` | `SEC-AUTH-001`, `SEC-RLS-001` | [`rls-security-model.md`](file:///D:/Project%20Aayurface/docs/engineering/security/rls-security-model.md) | Milestone 03 & 04 | `TST-SEC-03`, `TST-SEC-05` | Kernel RLS returns 0 rows; API masks with HTTP 404. |
| **BR-SYS-002 (Biometric Privacy)** | `TH-17`, `TH-05` | `SEC-STORAGE-001`, `SEC-STORAGE-002` | [`facial-data-security.md`](file:///D:/Project%20Aayurface/docs/engineering/security/facial-data-security.md) | Milestone 08 | `TST-SEC-08`, S3 Policy Audit | Zero public reads; raw captures deleted post-extraction. |
| **BR-SYS-003 (Granular User Consent)** | `TH-13` | `SEC-PRIV-001` | [`consent-architecture.md`](file:///D:/Project%20Aayurface/docs/engineering/security/consent-architecture.md) | Milestone 05 | Consent Service Suite | Versioned immutable consent records in `consents` table. |
| **BR-SYS-004 (Right to Erasure)** | `TH-14`, `TH-47` | `SEC-PRIV-002` | [`retention-deletion.md`](file:///D:/Project%20Aayurface/docs/engineering/security/retention-deletion.md) | Milestone 13 | `TST-SEC-13` (Purge Test) | Zero records in DB and S3; anonymous WORM tombstone. |
| **BR-SYS-005 (Rate Limiting & Anti-Abuse)** | `TH-25` | `SEC-INFRA-002` | [`api-security.md`](file:///D:/Project%20Aayurface/docs/engineering/security/api-security.md) | Milestone 11 | `TST-SEC-07` (Rate Limit) | Requests exceeding 5 scans/hour receive HTTP 429. |
| **BR-SYS-006 (Zero Secret Leakage)** | `TH-19`, `TH-20` | `SEC-OBS-001`, `SEC-AUTH-001` | [`secrets-management.md`](file:///D:/Project%20Aayurface/docs/engineering/security/secrets-management.md) | Milestone 01 & 14 | `TST-SEC-01`, `TST-SEC-14` | Zero secrets in git/bundle; automated logger redaction. |
| **BR-SYS-007 (Classical RAG Grounding)** | `TH-10`, `TH-38` | `SEC-RAG-001`, `SEC-RAG-002` | [`rag-security.md`](file:///D:/Project%20Aayurface/docs/engineering/security/rag-security.md) | Milestone 09 & 10 | `TST-SEC-12` (Cosine Gate) | Queries $< 0.75$ cosine abort herb generation cleanly. |
| **BR-SYS-008 (Admin Governance)** | `TH-15`, `TH-46` | `SEC-ADMIN-001` | [`admin-security.md`](file:///D:/Project%20Aayurface/docs/engineering/security/admin-security.md) | Milestone 17 | Admin MFA Challenge Test | Hardware WebAuthn FIDO2 required; all actions logged to WORM. |
| **BR-SYS-009 (Double-Blind Research)** | `TH-33`, `TH-52` | `SEC-RESEARCH-001` | [`research-security.md`](file:///D:/Project%20Aayurface/docs/engineering/security/research-security.md) | Milestone 18 | Re-identification Review | Annotators see masked ROIs only; cannot see subject identity. |
| **BR-SYS-010 (Client Capture Gateway)** | `TH-07`, `TH-50` | `SEC-CV-001` | [`cv-security.md`](file:///D:/Project%20Aayurface/docs/engineering/security/cv-security.md) | Milestone 07 | Quality Gate Boundary Test | Degraded lighting/pose disables capture; guides user live. |
