# AayurFace — Security Architecture Specification
## Privacy by Design & Data Protection Architecture

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Privacy Officer, Security Architect, Principal Product Engineer  
**Legal Notice:** Designed to support applicable privacy and data-protection obligations (including principles of the Indian Digital Personal Data Protection Act 2023 and GDPR); **FORMAL LEGAL AND COMPLIANCE REVIEW IS REQUIRED**.  

---

### 1. Foundational Privacy Principles

1. **Privacy by Design & Default:** Data protection is embedded into the core system architecture from day zero, not appended as compliance documentation.
2. **Data Minimization:** The system collects and processes the absolute minimum personal data necessary to deliver personalized Ayurvedic wellness insights. Continuous camera feeds remain in ephemeral browser RAM; only derived numerical features are permanently stored.
3. **Purpose Limitation:** User data collected for Ayurvedic skin assessment is strictly quarantined from marketing, unauthorized secondary data sales, and unconsented AI training.
4. **Storage Limitation:** Biometric facial images are purged immediately post-feature extraction or retained for a strict rolling period (DEC-004), preventing indefinite biometric accumulation.
5. **Transparency & User Agency:** Users maintain complete control over their personal data, including the right to inspect granted consents, export analysis history, and execute a permanent cascading account purge.

---

### 2. User Privacy Rights Implementation Framework

| Statutory Privacy Right | Architectural Realization in AayurFace | Technical Enforcement Mechanism | Legal Notice Status |
|---|---|---|---|
| **Right to Notice & Transparent Consent** | Clear, plain-language onboarding notice explaining what data is captured (face, wellness habits) and its exact purpose. | Onboarding consent wizard with unbundled checkboxes; versioned records stored in `consents` table. | Requires Legal Review |
| **Right to Access & Data Portability** | User can view their entire historical timeline of analyses, routines, and questionnaire inputs, or export as JSON/PDF. | `GET /api/v1/profile/export` compiling structured user data into a portable cryptographic download bundle. | Requires Legal Review |
| **Right to Correction / Rectification** | User can update profile details, adjust lifestyle context ratings, or edit wellness goals at any time. | `PUT /api/v1/profile` and `PUT /api/v1/lifestyle` guarded by RLS. | Requires Legal Review |
| **Right to Revoke Consent** | User can withdraw biometric processing, notifications, or research contribution consents via settings. | Revocation immediately cascades: disables future scans, excludes records from research cohorts. | Requires Legal Review |
| **Right to Erasure / "To Be Forgotten"** | Permanent cascading hard-deletion of user account, profile, facial images in S3, and historical analysis records. | Asynchronous deletion worker executing multi-service hard purges with anonymous WORM tombstoning. | Requires Legal Review |
| **Grievance Redressal** | Direct in-app mechanism to contact the Data Protection Officer / Privacy Lead. | Designated support routing and ticketing integration in app settings. | Requires Legal Review |
