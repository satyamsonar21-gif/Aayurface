# AayurFace — Phase 01-C Requirements Engineering Audit
## Document: Requirement Status Register

**Phase:** Phase 01-C — Requirements Evidence Reconciliation, Claim Correction & Quality Hardening  
**Date:** 2026-09-03  
**Status:** AUDITED & RECONCILED  
**Core Invariant:** Requirements engineering status defines the state of the *specification*, NOT the state of implementation code. Implementation status is tracked separately in the Current vs Target matrix.  

---

### 1. Status Taxonomy Key

* **BASELINED:** Formalized, testable, agreed engineering requirement approved for implementation planning.
* **PROPOSED:** Engineering recommendation or working hypothesis pending stakeholder sign-off.
* **OPEN:** Requirement has unresolved design, technical, or legal dependencies that must be decided.
* **UNVERIFIED:** Requirement or threshold requires empirical benchmarking or experimental testing before baselining.
* **DEFERRED:** Valid requirement intentionally scheduled for a future milestone (V1, V2, or Research).
* **OUT OF SCOPE:** Explicitly rejected or placed outside the application boundary.

---

### 2. Comprehensive Requirement Status Register

| Requirement ID | Domain / Module | Summary Title | Priority | Target Milestone | Requirements Status | Source Document | Implementation State in Repo |
|---|---|---|---|---|---|---|---|
| **FR-AUTH-001** | Authentication | Email / Password Registration | P0 | MVP | **BASELINED** | PRD 2.3 | Missing (Mock localStorage) |
| **FR-AUTH-002** | Authentication | Password Verification & bcrypt Hashing | P0 | MVP | **BASELINED** | PRD 2.3 | Missing (Plaintext ignored) |
| **FR-AUTH-003** | Authentication | Google OAuth 2.0 PKCE | P0 | MVP | **BASELINED** | PRD 2.3 | Missing (Mock identity) |
| **FR-AUTH-004** | Authentication | Session JWT & Token Rotation | P0 | MVP | **BASELINED** | PRD 2.3 | Missing |
| **FR-AUTH-005** | Authentication | Secure Session Sign-Out | P0 | MVP | **BASELINED** | PRD 2.3 | Missing (Clears mock key) |
| **FR-AUTH-006** | Authentication | Password Reset Magic Link | P1 | V1 | **DEFERRED** | PRD 2.3 | Missing |
| **FR-AUTH-007** | Authentication | Extended Profile Persistence | P0 | MVP | **BASELINED** | PRD 2.3 | Partial (Basic fields in mock) |
| **FR-AUTH-008** | Authentication | User Account & Data Deletion | P0 | MVP | **BASELINED** | PRD 2.21 | Missing |
| **FR-I18N-001** | Localization | Interactive Language Selection (EN/HI) | P0 | MVP | **BASELINED** | PRD 2.1 | Missing (English-only JSX) |
| **FR-I18N-002** | Localization | Extensible Language Architecture (MR/TA/TE/BN) | P1 | V1 / V2 | **DEFERRED** | PRD 2.1 | Missing |
| **FR-I18N-003** | Localization | Global Session Locale Persistence | P0 | MVP | **BASELINED** | PRD 2.1 | Missing |
| **FR-I18N-004** | Localization | Missing Key Fallback to English | P0 | MVP | **BASELINED** | PRD 2.1 | Missing |
| **FR-I18N-005** | Localization | Devanagari Typography Rendering | P0 | MVP | **BASELINED** | PRD 2.1 | Missing |
| **FR-CONSENT-001**| Consent & Privacy | Mandatory Pre-Capture Consent Gate | P0 | MVP | **BASELINED** | PRD 2.2 | Missing (Zero consent in UI) |
| **FR-CONSENT-002**| Consent & Privacy | Granular Unbundled Consent Checkboxes | P0 | MVP | **BASELINED** | PRD 2.2 | Missing |
| **FR-CONSENT-003**| Consent & Privacy | Immutable Consent Audit Trail in Database | P0 | MVP | **BASELINED** | PRD 2.2 | Missing (No `consents` table) |
| **FR-CONSENT-004**| Consent & Privacy | Consent Modification & Revocation | P0 | MVP | **BASELINED** | PRD 2.2 | Missing |
| **FR-CONSENT-005**| Consent & Privacy | Immediate Processing Purge upon Withdrawal | P0 | MVP | **BASELINED** | PRD 2.2 | Missing |
| **FR-AYU-001** | Questionnaire | 15-Question Constitutional Intake | P0 | MVP | **BASELINED** | PRD 2.4 | Missing (Only 3 skin concerns) |
| **FR-AYU-002** | Questionnaire | Phenotypic Tridosha Mapping Logic | P0 | MVP | **BASELINED** | PRD 2.4 | Missing |
| **FR-AYU-003** | Questionnaire | Step-by-Step Progress & Animated Navigation | P0 | MVP | **BASELINED** | PRD 2.4 | Missing |
| **FR-AYU-004** | Questionnaire | Pre-Submission Summary Review Screen | P0 | MVP | **BASELINED** | PRD 2.4 | Missing |
| **FR-AYU-005** | Questionnaire | Normalized 3D Constitutional Vector Output | P0 | MVP | **BASELINED** | PRD 2.4 | Missing |
| **FR-AYU-006** | Questionnaire | Degraded Mode Fallback for Partial Intake | P1 | V1 | **DEFERRED** | PRD 2.4 | Missing |
| **FR-LIFE-001** | Lifestyle Intake | Structured Environmental & Habit Form | P0 | MVP | **BASELINED** | PRD 2.5 | Missing (Zero lifestyle UI) |
| **FR-LIFE-002** | Lifestyle Intake | Downstream Ayurvedic Relevance Invariant | P0 | MVP | **BASELINED** | PRD 2.5 | Missing |
| **FR-LIFE-003** | Lifestyle Intake | Normalized Lifestyle Context Vector Output | P0 | MVP | **BASELINED** | PRD 2.5 | Missing |
| **FR-LIFE-004** | Lifestyle Intake | Lightweight Returning User Refresh Flow | P1 | V1 | **DEFERRED** | PRD 2.5 | Missing |
| **FR-CAP-001** | Capture Gateway | WebRTC Camera Access Request | P0 | MVP | **BASELINED** | PRD 2.6 | Partial (`react-webcam` present) |
| **FR-CAP-002** | Capture Gateway | Face Mesh Presence & Single Face Constraint | P0 | MVP | **BASELINED** | PRD 2.6 | Missing (Zero detection) |
| **FR-CAP-003** | Capture Gateway | Real-Time Oval Centering Alignment Guide | P0 | MVP | **BASELINED** | PRD 2.6 | Missing (Static overlay only) |
| **FR-CAP-004** | Capture Gateway | Inter-Pupillary Distance / Scale Evaluation | P0 | MVP | **BASELINED** | PRD 2.6 | Missing |
| **FR-CAP-005** | Capture Gateway | Face ROI Illumination & Glare Check | P0 | MVP | **BASELINED** | PRD 2.6 | Missing |
| **FR-CAP-006** | Capture Gateway | Sharpness / Motion Blur Evaluation | P0 | MVP | **BASELINED** | PRD 2.6 | Missing |
| **FR-CAP-007** | Capture Gateway | Facial Occlusion Detection | P0 | MVP | **BASELINED** | PRD 2.6 | Missing |
| **FR-CAP-008** | Capture Gateway | Deterministic Capture Button Gating | P0 | MVP | **BASELINED** | PRD 2.6 | Missing (3s mock setTimeout) |
| **FR-CAP-009** | Capture Gateway | Encrypted Single-Frame Storage Upload | P0 | MVP | **BASELINED** | PRD 2.6 | Missing |
| **FR-CV-001** | Feature Extractor | Non-Diagnostic Visual Signal Extraction | P0 | MVP | **BASELINED** | PRD 2.7 | Missing (Uncalled GPT Vision) |
| **FR-CV-002** | Feature Extractor | Micro-Vascular Redness / Erythema Index | P0 | MVP | **BASELINED** | PRD 2.7 | Missing |
| **FR-CV-003** | Feature Extractor | Surface Texture Roughness & Pore Prominence | P0 | MVP | **BASELINED** | PRD 2.7 | Missing |
| **FR-CV-004** | Feature Extractor | Melanin Uniformity & Under-Eye Contrast | P0 | MVP | **BASELINED** | PRD 2.7 | Missing |
| **FR-CV-005** | Feature Extractor | Ayurvedic Morphological Structural Proportions | P1 | V1 | **DEFERRED** | PRD 2.7 | Missing |
| **FR-CV-006** | Feature Extractor | Normalized VisualObservations Schema | P0 | MVP | **BASELINED** | PRD 2.7 | Missing |
| **FR-FUS-001** | Multimodal Fusion | Tri-Modality Input Stream Ingestion | P0 | MVP | **BASELINED** | PRD 2.8 | Missing (Hardcoded mock data) |
| **FR-FUS-002** | Multimodal Fusion | Configurable Weighted Fusion Architecture | P0 | MVP | **BASELINED** | PRD 2.8 | Missing |
| **FR-FUS-003** | Multimodal Fusion | Initial Prototyping Weights (40/35/25) | P0 | MVP | **PROPOSED** | Research Doc | Missing (Hypothesis only) |
| **FR-FUS-004** | Multimodal Fusion | Degraded Modality Dynamic Normalization | P1 | V1 | **DEFERRED** | PRD 2.8 | Missing |
| **FR-CONF-001** | Confidence Engine | Inter-Modality Cosine Agreement Scoring | P0 | MVP | **BASELINED** | PRD 2.9 | Missing |
| **FR-CONF-002** | Confidence Engine | Discrete Agreement States (High / Med / Low) | P0 | MVP | **BASELINED** | PRD 2.9 | Missing |
| **FR-CONF-003** | Confidence Engine | Calibrated Confidence Formula | P0 | MVP | **BASELINED** | PRD 2.9 | Missing (Static "94%" string) |
| **FR-CONF-004** | Confidence Engine | Uncertainty Flagging & Low Agreement Advisory | P0 | MVP | **BASELINED** | PRD 2.9 | Missing |
| **FR-XAI-001** | Explainable AI | 5-Part Structured Explanation Contract | P0 | MVP | **BASELINED** | PRD 2.10 | Missing (Generic mock string) |
| **FR-XAI-002** | Explainable AI | Progressive Disclosure UX Architecture | P0 | MVP | **BASELINED** | PRD 2.10 | Missing |
| **FR-XAI-003** | Explainable AI | Anti-Hallucination Causal Attribution Guard | P0 | MVP | **BASELINED** | PRD 2.10 | Missing |
| **FR-RAG-001** | Knowledge Base | Classical Ayurvedic Corpus Vectorization | P0 | MVP | **BASELINED** | PRD 2.11 | Missing (No pgvector table) |
| **FR-RAG-002** | Knowledge Base | Vector Similarity Search via text-embedding-3 | P0 | MVP | **BASELINED** | PRD 2.11 | Missing |
| **FR-RAG-003** | Knowledge Base | Mandatory Classical Source Citation | P0 | MVP | **BASELINED** | PRD 2.11 | Missing |
| **FR-RAG-004** | Knowledge Base | Safe Limitation Fallback on Retrieval Miss | P0 | MVP | **BASELINED** | PRD 2.11 | Missing |
| **FR-RAG-005** | Knowledge Base | Prompt Injection Quarantine & Delimitation | P0 | MVP | **BASELINED** | PRD 2.11 | Missing |
| **FR-REC-001** | Personalization | Categorized Recommendations (Herbal/Diet/Life) | P0 | MVP | **BASELINED** | PRD 2.12 | Partial (Static mock list) |
| **FR-REC-002** | Personalization | Standardized Recipe Contract & Instructions | P0 | MVP | **BASELINED** | PRD 2.12 | Partial (Static mock list) |
| **FR-REC-003** | Personalization | Mandatory 24-Hour Patch Test Advisory | P0 | MVP | **BASELINED** | PRD 2.12 | Partial (Present in UI component) |
| **FR-ROUT-001** | Routine Engine | Morning / Evening / Weekly Routine View | P0 | MVP | **BASELINED** | PRD 2.13 | Partial (Static mock in UI) |
| **FR-ROUT-005** | Routine Engine | Daily Adherence Logging & Checkboxes | P1 | V1 | **DEFERRED** | PRD 2.13 | Missing (Checkboxes unpersisted) |
| **FR-HIST-001** | History & Trends | Immutable Analysis Snapshot Records | P0 | MVP | **BASELINED** | PRD 2.16 | Missing (Mock scans in state) |
| **FR-PROG-001** | History & Trends | 30/60/90-Day Longitudinal Progress Charts | P2 | V2 | **DEFERRED** | PRD 2.17 | Missing (Static SVG graphic) |
| **FR-PDF-001** | Reporting | Authenticated PDF Wellness Report Export | P1 | V1 | **DEFERRED** | PRD 2.18 | Missing (Button non-functional) |
| **FR-VOICE-001** | Conversational | Web Speech API Multilingual Voice Assistant | P2 | V2 | **DEFERRED** | PRD 2.15 | Missing |
| **FR-ADMIN-001** | Administration | Role-Gated Admin Dashboard & Knowledge Ingest | P1 | V1 | **DEFERRED** | PRD 2.20 | Missing |
| **FR-ADMIN-008** | Clinical Research | Expert Consensus & Triple-Practitioner Portal | P3 | Research | **DEFERRED** | Research Doc | Missing |
