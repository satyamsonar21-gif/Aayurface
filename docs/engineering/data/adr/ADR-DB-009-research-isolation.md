# Architecture Decision Record (ADR)
## ADR-DB-009: Research Data Isolation — Double-Blind Expert Research Enclave & De-Identification

**Status:** PROPOSED / TARGET (POST-MVP RESEARCH PHASE; REQUIRES VALIDATION)  
**Date:** 2026-09-03  
**Deciders:** Principal Database Architect, Privacy Officer, Research Systems Analyst  
**Technical Category:** Research Architecture & Participant Protection  

---

### Context & Problem Statement
To calibrate multimodal fusion weights and evaluate algorithmic fairness across diverse skin-tone / pigmentation subgroup variables (corresponding to Fitzpatrick types III–VI), AayurFace will conduct double-blind expert consensus studies with certified Ayurvedic practitioners. Exposing production consumer accounts directly to research annotators creates severe privacy risks, including subject re-identification, snooping into personal health histories, and unblinded assessment bias.

### Decision Drivers
1. **Double-Blind Integrity:** Annotators must not know the identity, age, or location of subjects, nor can they view ratings submitted by peer practitioners.
2. **Subject Re-Identification Defense:** High-dimensional facial images and lifestyle context must be stripped and coarsened to prevent external re-identification.
3. **Physical Schema Isolation:** Operational production tables must be quarantined from research annotation pipelines.
4. **Consent Control:** Only data from users with explicit, active `research_sharing = 'GRANTED'` consent can enter research datasets.

### Decision Outcome
**Chosen Option: Dedicated Isolated Research Schema (`research.*`) with Cryptographic De-Identification Pipeline.**

#### Architecture Specifications:
* **Schema Segregation:** Research entities (`research_subjects`, `expert_annotations`, `consensus_labels`, `fairness_benchmarks`) reside in a dedicated PostgreSQL schema (`research`) or isolated database role.
* **De-Identification Pipeline:**
  * Direct PII (name, email, phone, auth UUID) is permanently stripped.
  * Age is coarsened into 10-year brackets (e.g., `'25-34'`).
  * A cryptographic ephemeral `research_uuid` is assigned.
  * Full-face photographs are cropped into standardized, masked ROIs (cheeks and forehead) stored in an isolated S3 bucket prefix (`research-rois/`).
* **Double-Blind Locking:** Annotations submitted by practitioners are immediately locked (`is_locked = TRUE`). RLS policies restrict annotators strictly to their assigned queue of masked ROIs.

### Consequences
* **Positive:** Complete protection against subject re-identification; supports objective, unbiased expert reference label derivation; adheres to ethical research standards.
* **Negative:** Post-MVP scope (DEC-010); requires maintaining automated de-identification and image masking workers.
* **Status Classification:** `PROPOSED / TARGET (POST-MVP MILESTONE 18; REQUIRES VALIDATION)` — design finalized; implementation deferred to Milestone 18.

