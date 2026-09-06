# Architecture Decision Record (ADR)
## ADR-DB-003: Sensitive Data Separation — Decoupling Identity from Wellness Observations

**Status:** TARGET  
**Date:** 2026-09-03  
**Deciders:** Principal Database Architect, Data Security Architect, Privacy Officer  
**Technical Category:** Privacy Architecture & Data Isolation  

---

### Context & Problem Statement
AayurFace processes personal identifiers (email, name, phone, age, gender) alongside sensitive wellness profiles (Tridosha imbalances, skin concerns, daily habit adherence) and high-sensitivity biometric data (facial captures and derived phenotypic vectors). If all data is co-located in a single flat table or exposed indiscriminately across database queries, any database credential leak or administrative oversight exposes complete personal identities paired with sensitive health profiles.

### Decision Drivers
1. **Data Minimization & Privacy by Design:** Prevent casual internal browsing of health records by staff who only require account operational data.
2. **Breach Impact Containment:** Ensure that a compromise of user profiles does not automatically leak phenotypic feature vectors.
3. **Research Portability:** Allow seamless de-identification of wellness records for post-MVP algorithmic fairness studies without exposing PII.
4. **Statutory Alignment:** Support principles of the Indian DPDP Act 2023 and GDPR regarding pseudonymization and purpose limitation.

### Decision Outcome
**Chosen Option: Multi-Tier Schema & Table Decoupling with Strict Foreign Key Partitioning.**

#### Architecture Specifications:
1. **Authentication Vault (`auth.users`):** Managed exclusively by Supabase Auth; stores email, encrypted password hashes, and OAuth identities. Application code possesses zero direct write permissions to this table.
2. **Profile & Contact Tier (`profiles`, `user_preferences`):** Stores display name, age bracket, language, and non-sensitive UI settings. Contains zero biometric data and zero raw analysis results.
3. **Wellness & Health Observation Tier (`questionnaire_responses`, `lifestyle_contexts`, `visual_observations`, `scan_results`):** Stores derived numerical vectors and doshic assessments. These tables reference `profiles.id` exclusively via UUID foreign keys. They do not store user names, emails, or phone numbers.
4. **Biometric Asset Tier (`facial-captures/` in S3):** High-resolution facial images are stored physically outside the relational database in private object storage, completely isolated from relational queries.

### Consequences
* **Positive:** Massive reduction in blast radius during security incidents; customer support queries for user profiles never touch biometric observation tables; simplifies research de-identification.
* **Negative:** Requires foreign key joins across `profiles` and `scan_results` to assemble comprehensive user summaries in API responses.
* **Status Classification:** `TARGET` — scheduled for Milestone 04 implementation.
