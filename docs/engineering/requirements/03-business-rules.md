# AayurFace — Engineering Requirements Specification
## Document 03: Core Business Rules & Invariant Constraints

**Phase:** Phase 01 — Requirements Engineering, Formalization & Complete Traceability  
**Date:** 2026-09-03  
**Status:** FORMAL ENGINEERING CONTRACT  
**Authority:** Principal Requirements Engineer, Ayurvedic Domain Systems Analyst, Compliance Lead  

---

### 1. Invariant Business Rules (BR)

* **BR-AUTH-001 (Zero Cross-Tenant Data Access):** A user shall NEVER be granted read or write access to another user's profile, captures, questionnaire answers, analysis results, or chat history under any circumstance.
* **BR-PRIV-001 (Affirmative Consent Invariant):** The system shall NOT process any biometric facial image or questionnaire response unless explicit, affirmative user consent exists in an active, unrevoked state in the database.
* **BR-CAP-001 (No Analysis Without Quality Gateway Pass):** An analysis pipeline shall NEVER be triggered using a capture that has not achieved a verified `PASS` decision across all client-side capture quality dimensions (lighting, centering, distance, sharpness, single face).
* **BR-CAP-002 (Single-Frame Storage Minimization):** Only the single quality-approved frame shall ever be uploaded to storage; continuous camera stream frames shall be ephemeral and processed exclusively in browser volatile memory.
* **BR-FUS-001 (Authentic Multimodal Fusion):** The system shall NEVER present an analysis result as a "Multimodal Constitutional Insight" if it was generated from a single modality alone without fusing visual, questionnaire, and lifestyle vectors.
* **BR-FUS-002 (Uncertainty Transparency — The "No Confident Lie" Invariant):** When input evidence streams disagree (e.g., visual signals indicate excess Pitta while constitutional questionnaire indicates Kapha dominance), the system shall NEVER fabricate high certainty. It is strictly required to lower stated confidence, assign `LOW_AGREEMENT`, and highlight the divergence to the user.
* **BR-AI-001 (Non-Diagnostic Wellness Boundary):** AayurFace is strictly an AI-assisted holistic wellness and skin intelligence platform. The system shall NEVER provide a clinical diagnosis, declare a dermatological disease, or replace professional medical consultation.
* **BR-AI-002 (No Unsupported Claims Invariant):** The generative AI layer shall NEVER generate an Ayurvedic herb, formulation, or dietary recommendation unless it is grounded in validated knowledge retrieved from the curated knowledge repository with source citation.
* **BR-SAF-001 (Mandatory Patch Test Warning):** Every single topical remedy, mask, oil, or herb surfaced to the user shall be accompanied by an unambiguous advisory instructing the user to perform a 24-hour patch test before full application.
* **BR-SAF-002 (Serious Condition Escalation):** If visual features or user responses suggest potentially severe dermatological pathology (severe cystic acne, infected lesions, suspicious pigmented lesions), the system shall flag `serious_condition_flag = true` and advise prompt consultation with a certified dermatologist.
* **BR-HIST-001 (Immutability of Analysis Snapshots):** Historical analysis records stored in `scan_results` shall be strictly immutable. Upgrades to ML models, prompts, or Ayurvedic knowledge bases shall NOT silently recalculate or modify past user analysis records.
* **BR-DATA-001 (Data Minimization):** The system shall collect only information that possesses an explicit, documented downstream purpose in personalization, constitutional mapping, or capture quality validation.
