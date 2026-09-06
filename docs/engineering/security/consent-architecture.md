# AayurFace — Security Architecture Specification
## Granular Consent Lifecycle Architecture

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Privacy Officer, Security Architect, Staff Backend Architect  

---

### 1. The Unbundled Consent Invariant

In alignment with global privacy principles (including DPDP Act 2023 and GDPR), consent in AayurFace is never bundled, pre-ticked, or coerced:
* Agreeing to account creation does NOT automatically consent to biometric facial processing.
* Consenting to an individual skin scan does NOT automatically consent to academic research sharing.
* Every consent scope is discrete, independently toggleable, versioned, and revocable.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ ONBOARDING STEP 3: GRANULAR CONSENT MODAL                                   │
│                                                                             │
│ [x] 1. Biometric Facial Analysis (Required to use AI Camera Scan)           │
│     "I authorize AayurFace to analyze my facial landmarks and skin surface  │
│      characteristics using computer vision for Ayurvedic wellness insights." │
│                                                                             │
│ [x] 2. Personal Wellness & Routine Storage (Recommended)                    │
│     "I authorize storage of my analysis results and routine progress in my  │
│      personal history timeline."                                            │
│                                                                             │
│ [ ] 3. Ayurvedic Academic Research Sharing (Strictly Optional)              │
│     "I authorize sharing de-identified numerical features with certified   │
│      Ayurvedic researchers for algorithm calibration and fairness audits."   │
│                                                                             │
│ [ ] 4. Routine & Wellness Reminders (Strictly Optional)                     │
│     "Send me daily notifications for Morning/Evening Ayurvedic rituals."     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Granular Consent Scopes Taxonomy

| Consent Scope ID | Scope Name | Category | Mandatory for Scan? | Description | Revocation Impact |
|---|---|---|---|---|---|
| `biometric_processing` | Biometric Facial Analysis | Processing | **YES** | Real-time landmarking and serverless feature extraction on single frame. | User cannot initiate new scans; active facial image in S3 purged. |
| `analysis_storage` | History & Progress Storage | Storage | **NO** | Persisting analysis results and longitudinal metrics in `scan_results`. | Analyses become ephemeral; past history accessible until deleted. |
| `wellness_personalization` | Ayurvedic Habit Guidance | Processing | **NO** | Utilizing questionnaire and lifestyle context to tailor herbal recommendations. | System defaults to generic non-personalized dosha guides. |
| `ai_synthesis` | LLM Explainability Reasoning | Processing | **YES** | Passing extracted vectors to constrained GPT-4o for plain-language synthesis. | Disables narrative explanations; outputs raw dosha scores only. |
| `research_sharing` | De-Identified Research Vault | Secondary Use | **NO** | Contributing anonymous phenotypic vectors to the triple-practitioner consensus dataset. | Subject excluded from future research cohorts; prior anonymous data retained. |
| `voice_interaction` | Audio Capture & Transcription| Input | **NO** (V2) | Utilizing microphone stream for hands-free queries via Web Speech API. | Microphone button hidden; standard keyboard input enforced. |
| `routine_reminders` | Push / Web Reminders | Notification | **NO** (V2) | Sending scheduled Dinacharya notifications. | Reminder scheduler immediately drops scheduled push tasks. |

---

### 3. Consent Data Model & Immutability Schema

```sql
-- Target Architectural Schema for Consent Auditing (Milestone 05)

CREATE TABLE consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    scope VARCHAR(50) NOT NULL, -- e.g., 'biometric_processing', 'research_sharing'
    policy_version VARCHAR(20) NOT NULL, -- e.g., 'v1.0.0'
    status VARCHAR(20) NOT NULL CHECK (status IN ('GRANTED', 'REVOKED')),
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ,
    client_metadata_hash VARCHAR(64) NOT NULL, -- SHA-256 hash of User-Agent + IP subnet
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for rapid permission checking during API orchestration
CREATE INDEX idx_consents_user_scope ON consents(user_id, scope, status);
```

#### Revocation Enforcement:
When a user revokes `biometric_processing` via `/profile/settings`:
1. A new record is inserted into `consents` with `status = 'REVOKED'` and `revoked_at = NOW()`.
2. An automated database trigger enqueues a purge task:
   * Any pending or unpurged facial capture objects in `facial-captures/{userId}/*` are deleted via S3 API.
   * Active analysis orchestration routes verify `consents.status = 'GRANTED'` before executing; if revoked, the API returns `HTTP 403 Forbidden` (`CONSENT_REQUIRED`).
