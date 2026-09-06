# AayurFace — Security Architecture Specification
## Formal Security Decision Backlog (SEC-DEC-001 through SEC-DEC-010)

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Chief Security Architect, Privacy Officer, Solution Architect  

---

### 1. Decision Governance Framework

Open architectural security decisions identify areas where multiple viable technical or regulatory options exist. Each decision is assigned an explicit status (`PROPOSED` or `OPEN`), technical trade-offs, recommendations, an accountable owner, and a mandatory revisit gate:

---

### 2. Detailed Security Decisions Catalog

#### SEC-DEC-001: Biometric Classification under Indian DPDP Act 2023
* **Status:** `OPEN` / `REQUIRES LEGAL REVIEW`
* **Description:** Determine whether facial skin images captured solely for non-diagnostic Ayurvedic phenotypic analysis legally constitute "biometric data" triggering special consent and processing constraints under the Digital Personal Data Protection Act 2023.
* **Options Considered:**
  1. *Option A (Conservative Security Posture):* Classify all facial captures as Highly Sensitive Biometric Data by default; enforce explicit biometric consent and immediate post-extraction purging.
  2. *Option B (Standard Personal Data):* Classify captures as standard personal wellness imagery since facial recognition identity matching is not performed.
* **Trade-Offs:** Option A minimizes regulatory liability and user breach risk at the expense of higher architectural rigor. Option B reduces UX friction but creates compliance exposure if regulatory rules evolve.
* **Recommendation:** Adopt Option A (Conservative Security Posture) pending formal statutory legal opinion.
* **Owner:** Privacy Officer & Legal Counsel.
* **Revisit Gate:** Prior to Milestone 05 (Consent Ledger Implementation).

#### SEC-DEC-002: Exact Facial Image Retention Duration (DEC-004 Alignment)
* **Status:** `OPEN DECISION`
* **Description:** Establish the permanent retention policy for raw facial captures uploaded to the private S3 bucket.
* **Options Considered:**
  1. *Option A (Immediate Post-Extraction Purge):* S3 object is permanently hard-deleted within 60 seconds of successful feature extraction. Zero raw biometric storage.
  2. *Option B (Rolling 30-Day Retention):* Retain image in private S3 for 30 days via automated lifecycle rule to allow user visual comparison across monthly scans.
  3. *Option C (User-Selectable Toggle):* User explicitly chooses between immediate purge and 30-day visual progress history.
* **Trade-Offs:** Option A delivers the highest security and zero biometric liability, but eliminates historical image comparisons. Option B provides superior user experience but creates a persistent biometric target. Option C empowers user agency with slight UX complexity.
* **Recommendation:** Adopt Option C (User-Selectable Toggle with Option A as default).
* **Owner:** Principal Product Engineer & Security Architect.
* **Revisit Gate:** Milestone 08 (Biometric Storage Implementation).

#### SEC-DEC-003: Pre-Signed Upload & Download URL TTL Duration
* **Status:** `PROPOSED` (SEC-DEC-003)
* **Description:** Define the cryptographic time-to-live (TTL) for HMAC-signed S3 URLs.
* **Options Considered:**
  1. *Option A (Strict Short TTL):* 5 minutes for upload PUT; 60 seconds for extraction GET.
  2. *Option B (Standard Moderate TTL):* 15 minutes for upload PUT (proposed baseline); 60 seconds for extraction GET.
  3. *Option C (Extended TTL):* 60 minutes for upload PUT.
* **Trade-Offs:** Option A poses reliability issues on slow 3G cellular mobile connections in India. Option C increases the window of exposure if a signed URL is intercepted. Option B balances network resilience with security.
* **Recommendation:** Adopt Option B (15 minutes for PUT; 60 seconds for GET).
* **Owner:** Staff Backend Architect.
* **Revisit Gate:** Milestone 08 (Storage Implementation).

#### SEC-DEC-004: Analysis Rate Limiting Middleware Threshold
* **Status:** `PROPOSED` (DEC-006 Alignment)
* **Description:** Establish the rate-limiting threshold on multimodal analysis orchestration endpoints to mitigate denial-of-wallet attacks against OpenAI API budgets.
* **Options Considered:**
  1. *Option A (Strict Limit):* 3 analyses per user per hour.
  2. *Option B (Balanced Baseline):* 5 analyses per user per hour (proposed baseline).
  3. *Option C (High Limit):* 20 analyses per user per hour.
* **Trade-Offs:** Option A frustrates legitimate users testing lighting adjustments. Option C leaves the platform vulnerable to automated wallet-draining scripts. Option B provides ample capacity for human retries while blocking automated attacks.
* **Recommendation:** Adopt Option B (5 analyses per user per hour) with burst allowance of 2 scans within 5 minutes.
* **Owner:** Platform/SRE Architect.
* **Revisit Gate:** Milestone 11 (Multimodal Fusion & Rate Limiting).

#### SEC-DEC-005: RAG Cosine Similarity Threshold & Minimum Match Count
* **Status:** `TARGET` (Calibration Pending)
* **Description:** Configure the runtime gating threshold for semantic vector searches against classical Ayurvedic literature in `pgvector`.
* **Options Considered:**
  1. *Option A (Loose Threshold):* Cosine similarity $\ge 0.65$; match count $\ge 1$.
  2. *Option B (Standard Target Threshold):* Cosine similarity $\ge 0.75$; match count $\ge 2$.
  3. *Option C (Strict Threshold):* Cosine similarity $\ge 0.85$; match count $\ge 3$.
* **Trade-Offs:** Option A risks ungrounded herbal recommendations based on tangentially related verses. Option C triggers excessive fallbacks on colloquial user queries. Option B ensures strong grounding while maintaining conversational utility.
* **Recommendation:** Adopt Option B ($\ge 0.75$; matches $\ge 2$) as target, subject to empirical calibration against real Ayurvedic practitioner queries.
* **Owner:** AI/ML Architect & Ayurvedic Knowledge Analyst.
* **Revisit Gate:** Milestone 10 (RAG Grounding & Safety Gating).

#### SEC-DEC-006: AI Safety Fallback Execution Behavior
* **Status:** `PROPOSED`
* **Description:** Determine the system behavior when LLM output violates the Zod schema or trips the non-diagnostic keyword safety filter.
* **Options Considered:**
  1. *Option A (Deterministic Static Card):* Discard entire generative output; render a pre-vetted, static Ayurvedic skin wellness advisory card.
  2. *Option B (Automated Re-Prompting):* Re-invoke the LLM with an error payload commanding it to correct the violation (up to 2 retries).
  3. *Option C (Regex Masking):* Mask or scrub offending words from the response and display the remainder.
* **Trade-Offs:** Option B doubles latency and API costs without guaranteeing compliance. Option C risks rendering broken or confusing sentences. Option A provides guaranteed deterministic safety with zero latency overhead.
* **Recommendation:** Adopt Option A (Deterministic Static Card) for safety-critical failures.
* **Owner:** Principal Security Architect & AI/ML Architect.
* **Revisit Gate:** Milestone 12 (AI Reasoning & Guardrails).

#### SEC-DEC-007: Shared Wellness Report Token Lifetime Default
* **Status:** `PROPOSED`
* **Description:** Establish the default expiration time for cryptographically generated public share report links (`/share/{token}`).
* **Options Considered:**
  1. *Option A (Short-Lived):* 24 hours.
  2. *Option B (Standard Proposed):* 7 days.
  3. *Option C (Long-Lived):* 30 days.
  4. *Option D (Permanent):* No expiration.
* **Trade-Offs:** Option A causes broken links if an Ayurvedic doctor reviews reports weekly. Option D violates storage limitation principles and creates perpetual public leakage targets. Option B accommodates typical clinical consultation schedules.
* **Recommendation:** Adopt Option B (7 days default) with user options for 24 hours and 30 days, plus an instant "Revoke Now" button.
* **Owner:** Staff Frontend Architect & Security Architect.
* **Revisit Gate:** Milestone 13 (History & Sharing Implementation).

#### SEC-DEC-008: Administrative MFA Enforcement Standard
* **Status:** `TARGET`
* **Description:** Mandate the multi-factor authentication mechanism for users possessing administrative or research supervisor privileges.
* **Options Considered:**
  1. *Option A (SMS OTP):* One-time password sent via mobile SMS.
  2. *Option B (App-Based TOTP):* Time-based OTP via Google Authenticator / 1Password.
  3. *Option C (Hardware WebAuthn / FIDO2):* Physical security key (YubiKey) or platform biometric (TouchID/Windows Hello).
* **Trade-Offs:** Option A is vulnerable to SIM-swapping attacks. Option B provides good security. Option C provides phishing-resistant, cryptographic proof of identity.
* **Recommendation:** Mandate Option C (FIDO2/WebAuthn) for `admin:superuser`; allow Option B as secondary backup for `admin:support`.
* **Owner:** Chief Security Architect.
* **Revisit Gate:** Milestone 17 (Administrative Portal Implementation).

#### SEC-DEC-009: Research Dataset Anonymization vs Pseudonymization Standard
* **Status:** `OPEN` / `REQUIRES LEGAL REVIEW`
* **Description:** Determine the statutory classification of the double-blind research database under global privacy laws.
* **Options Considered:**
  1. *Option A (Legally Anonymized):* Irreversible decoupling such that re-identification is technically impossible; exempt from certain subject access/erasure rights.
  2. *Option B (Pseudonymized Personal Data):* Retains a secure, salt-hashed lookup table in a separate vault to allow research consent withdrawal; remains subject to privacy statutes.
* **Trade-Offs:** Option A protects ongoing research studies from data loss if subjects delete accounts, but may conflict with user withdrawal rights. Option B provides full user control but requires maintaining an encrypted re-identification key escrow.
* **Recommendation:** Adopt Option B (Pseudonymized Personal Data with encrypted key escrow) pending formal research compliance review.
* **Owner:** Privacy Officer & Research Systems Analyst.
* **Revisit Gate:** Prior to Milestone 18 (Research Platform Implementation).

#### SEC-DEC-010: Third-Party Foundation Model Data Retention Agreement
* **Status:** `TARGET`
* **Description:** Establish contractual terms for data transmission to external LLM providers (OpenAI).
* **Options Considered:**
  1. *Option A (Commercial Standard API):* Standard API terms (30-day abuse monitoring retention; no training on API data).
  2. *Option B (Enterprise Zero Data Retention):* Enterprise agreement with Zero Data Retention (ZDR) where prompt payloads are discarded immediately upon response completion.
  3. *Option C (Self-Hosted Open-Source LLM):* Deploy open-weights model (e.g., Llama-3-70B) in isolated private VPC.
* **Trade-Offs:** Option A retains prompts for 30 days on OpenAI servers. Option B provides complete data isolation with minimal operational overhead. Option C eliminates external third parties but introduces massive GPU infrastructure costs.
* **Recommendation:** Adopt Option B (OpenAI Enterprise ZDR) for cloud inference; evaluate Option C for future on-premise clinical deployments.
* **Owner:** Platform Architect & Legal Counsel.
* **Revisit Gate:** Milestone 12 (AI Reasoning Integration).
