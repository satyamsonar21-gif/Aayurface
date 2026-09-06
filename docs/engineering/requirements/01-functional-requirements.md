# AayurFace — Engineering Requirements Specification
## Document 01: Atomic Functional Requirements

**Phase:** Phase 01 — Requirements Engineering, Formalization & Complete Traceability  
**Date:** 2026-09-03  
**Status:** FORMAL ENGINEERING CONTRACT  
**Authority:** Principal Requirements Engineer, Product Manager  

---

### Module 1: Authentication & User Profile (FR-AUTH)

* **FR-AUTH-001 (Email/Password Registration):** The system shall allow new users to register an account using a valid email address, full name, and a password complying with security complexity rules (minimum 8 characters, mixed case, number, special character).
* **FR-AUTH-002 (Password Verification & Hashing):** The system shall cryptographically verify user passwords via Supabase Auth (bcrypt/argon2) and reject plaintext password storage.
* **FR-AUTH-003 (OAuth Social Authentication):** The system shall support OAuth 2.0 social login via Google Identity Services through Supabase Auth.
* **FR-AUTH-004 (Session Token Management):** The system shall issue secure, HTTP-only JWT session tokens with automatic token refresh upon expiry.
* **FR-AUTH-005 (Secure Sign-Out):** The system shall invalidate client-side sessions and revoke refresh tokens upon user sign-out.
* **FR-AUTH-006 (Password Reset Flow):** The system shall send a secure, time-limited password reset magic link to the registered email upon user request.
* **FR-AUTH-007 (Profile Data Persistence):** The system shall persist and retrieve user profile attributes (display name, age range, gender, primary skin concerns, wellness goals, and preferred language) in the `profiles` database table.
* **FR-AUTH-008 (Account Deletion):** The system shall provide an authenticated workflow allowing users to permanently delete their account and trigger cascading deletion of all associated biometric and analysis records.

---

### Module 2: Multilingual Localization (FR-I18N)

* **FR-I18N-001 (Language Selection):** The system shall present an interactive language selection view during initial onboarding and within application settings, supporting English (`en`) and Hindi (`hi`) for MVP.
* **FR-I18N-002 (Language Architecture Extensibility):** The localization architecture shall support pluggable translation bundles for regional Indian languages (Marathi `mr`, Tamil `ta`, Telugu `te`, Bengali `bn`) without modifying UI logic.
* **FR-I18N-003 (Global Session Language State):** The selected language choice shall persist in user profile storage and dynamically update all UI labels, navigation controls, questionnaires, explanations, and voice synthesis.
* **FR-I18N-004 (Missing Key Fallback):** The system shall gracefully fall back to English (`en`) whenever a translated string key is absent from a regional bundle without breaking layout or displaying raw translation keys.
* **FR-I18N-005 (Devanagari Font Rendering):** The system shall apply appropriate Devanagari typography (`Noto Sans Devanagari`) when Hindi or regional scripts are active.

---

### Module 3: Granular Informed Consent & Privacy (FR-CONSENT)

* **FR-CONSENT-001 (Mandatory Pre-Capture Consent):** The system shall block all facial capture, image uploading, and questionnaire intake until the user provides explicit, affirmative consent.
* **FR-CONSENT-002 (Granular Consent Dimensions):** The consent interface shall present independent, unbundled checkboxes for:
  1. *Biometric Facial Image Processing* (Mandatory for analysis)
  2. *Longitudinal Analysis Results Storage* (Mandatory for history/tracking)
  3. *Anonymized Research Participation* (Optional)
  4. *Reminder & Notification Preferences* (Optional)
* **FR-CONSENT-003 (Consent Audit Trail):** The system shall persist an immutable consent record in the database documenting user ID, consent version, granted permissions, client timestamp, and IP/user-agent hash.
* **FR-CONSENT-004 (Consent Withdrawal):** The system shall allow users to review, modify, or withdraw previously granted consents at any time from Account Settings.
* **FR-CONSENT-005 (Immediate Analysis Deletion on Withdrawal):** Upon withdrawal of facial processing or storage consent, the system shall cease processing and mark associated captures and analysis history for cryptographic purging.

---

### Module 4: Ayurvedic Constitutional Questionnaire (FR-AYU)

* **FR-AYU-001 (Structured Constitutional Intake):** The system shall provide a multi-step questionnaire collecting phenotypic and physiological traits across physical frame, skin texture, hair characteristics, digestive tendencies, energy levels, weather response, and appetite.
* **FR-AYU-002 (Tridoshic Dimension Mapping):** Each questionnaire option shall internally map to validated score contributions across Vata, Pitta, and Kapha constitutional vectors.
* **FR-AYU-003 (Progress & Navigation):** The questionnaire shall display progress indicators (e.g., "Question 3 of 15"), provide animated transitions, and permit backward navigation to amend prior selections.
* **FR-AYU-004 (Pre-Submission Review):** The system shall present an answer summary screen allowing the user to review all selected responses prior to final submission.
* **FR-AYU-005 (Normalized Signal Vector Output):** The questionnaire subsystem shall calculate a normalized 3-dimensional constitutional tendency vector (normalized sum: $V + P + K = 1.0$) and store it in `questionnaire_responses`.
* **FR-AYU-006 (Degraded Mode Fallback):** If a user skips or partially answers non-mandatory questionnaire items, the system shall flag the signal as degraded and adjust downstream confidence scoring.

---

### Module 5: Lifestyle Context Intake (FR-LIFE)

* **FR-LIFE-001 (Concise Lifestyle Intake):** The system shall collect structured environmental and behavioral variables including Diet Type, Sleep Quality, Average Sleep Duration, Perceived Stress Level, Geographic Climate, Daily Water Intake, Physical Activity Level, and Environmental Exposures (pollution, intense sun, dry HVAC).
* **FR-LIFE-002 (Downstream Relevance Invariant):** Every collected lifestyle variable shall have a deterministic downstream rule linking to Ayurvedic aggravation or pacification logic.
* **FR-LIFE-003 (Context Normalization):** The lifestyle intake subsystem shall normalize responses into a structured context object and persist it in `lifestyle_contexts` linked to the user and analysis session.
* **FR-LIFE-004 (Lightweight Returning User Refresh):** For returning users initiating a new scan, the system shall pre-fill previous lifestyle values and provide a single-click confirmation or quick-edit option.

---

### Module 6: Standardized Face Capture & Quality Gateway (FR-CAP)

* **FR-CAP-001 (Camera Permission Request):** The system shall request browser MediaDevices camera access with clear plain-language rationale regarding privacy and local execution.
* **FR-CAP-002 (Real-Time Face Presence & Count):** The client-side capture gateway shall detect face presence in the video stream and verify that exactly one face is present; multiple faces or zero faces shall immediately trigger corrective on-screen alerts.
* **FR-CAP-003 (Real-Time Face Centering):** The capture gateway shall verify that facial landmark bounds align within a defined central oval guide overlay (bounding box variance $\le \pm 15\%$).
* **FR-CAP-004 (Approximate Distance Evaluation):** The system shall evaluate facial scale (inter-pupillary distance or bounding box ratio) and guide the user if they are "Too Close" or "Too Far".
* **FR-CAP-005 (Lighting Adequacy Evaluation):** The system shall calculate real-time frame luminance from the face region of interest (ROI) and detect under-exposure ("Too Dark") or over-exposure ("Too Bright / Glare").
* **FR-CAP-006 (Sharpness / Blur Detection):** The system shall calculate frame sharpness (e.g., via Laplacian variance on face ROI) and reject motion-blurred frames with instruction to "Hold Still".
* **FR-CAP-007 (Occlusion Detection):** The system shall detect major facial obstructions (sunglasses, masks, hair covering forehead/cheeks) and instruct removal.
* **FR-CAP-008 (Binary Quality Decision Gating):** The "Capture" control shall remain disabled until all quality checks simultaneously return `PASS`. A manual override shall NOT be permitted in standard clinical mode.
* **FR-CAP-009 (Secure Capture Ingestion):** Upon capture, the quality-approved image shall be encrypted and transmitted directly to private Supabase Storage via a temporary signed upload URL; the raw image shall NOT be sent in API JSON bodies.

---

### Module 7: Computer Vision Feature Extraction (FR-CV)

* **FR-CV-001 (Non-Diagnostic Visual Observation):** The server-side computer vision layer shall extract objective, normalized morphological and dermatological signals from the quality-approved image without making medical diagnoses.
* **FR-CV-002 (Surface Texture Observation):** The CV pipeline shall calculate surface roughness, texture entropy, and pore prominence indicators across cheek and forehead ROIs.
* **FR-CV-003 (Erythema / Redness Signal Extraction):** The CV pipeline shall calculate localized micro-vascular redness and color distribution indices (CIELAB $a^*$ channel or erythema index) to indicate heat/inflammation markers.
* **FR-CV-004 (Pigmentation & Melanin Distribution):** The CV pipeline shall calculate melanin uniformity, localized hyper-pigmentation density, and under-eye circle contrast indices.
* **FR-CV-005 (Ayurvedic Morphological Markers):** The CV pipeline shall extract facial structural landmarks (facial width-to-height ratio, lip fullness curvature, eye spacing/shape) mapped to Ayurvedic morphological types.
* **FR-CV-006 (Normalized Observation Schema):** The CV layer shall output a structured, validated `VisualObservations` record containing numerical scores ($0.0 - 1.0$), localized ROI tags, and confidence metrics.

---

### Module 8: Multimodal Fusion Engine (FR-FUS)

* **FR-FUS-001 (Tri-Modality Fusion Ingestion):** The fusion engine shall ingest three distinct input streams: (1) `VisualObservations` vector, (2) `QuestionnaireResponse` vector, and (3) `LifestyleContext` vector.
* **FR-FUS-002 (Weighted Dimensional Fusion):** The engine shall combine modality vectors using a calibrated, configurable weighting model across Vata, Pitta, and Kapha axes.
* **FR-FUS-003 (Degraded Modality Operation):** If one non-mandatory modality is missing or incomplete, the fusion engine shall compute a degraded inference, explicitly label the result as `DEGRADED_MODE`, and reflect reduced certainty.
* **FR-FUS-004 (Deterministic Constitutional Tendency):** The fusion engine shall output primary and secondary constitutional tendencies (e.g., "Pitta-Vata") backed by a contribution breakdown.

---

### Module 9: Confidence & Conflict Detection (FR-CONF)

* **FR-CONF-001 (Inter-Modality Agreement Calculation):** The system shall calculate mathematical agreement (cosine similarity or directional variance) across the visual, questionnaire, and lifestyle vectors.
* **FR-CONF-002 (Discrete Agreement State Assignment):** The system shall assign an explicit agreement state:
  * `HIGH_AGREEMENT`: Modalities converge on consistent constitutional and tissue signals.
  * `MODERATE_AGREEMENT`: Minor divergence observed across secondary markers.
  * `LOW_AGREEMENT`: Significant divergence detected (e.g., visual suggests high Pitta heat while questionnaire suggests Kapha dominance).
* **FR-CONF-003 (Calibrated Numerical Confidence Score):** The system shall compute a calibrated confidence percentage based on quality gateway score, signal magnitude, and modality agreement.
* **FR-CONF-004 (Uncertainty Flagging Invariant):** When `LOW_AGREEMENT` is detected, the system shall NOT fabricate high confidence; it shall explicitly display an amber warning, soften claim language, and prompt for clarification or retake.

---

### Module 10: Explainable AI Layer (FR-XAI)

* **FR-XAI-001 (Five-Part Structured Explanation):** Every AI insight shall include a structured explanation consisting of:
  1. *What was observed* (Visual signals)
  2. *What contextual factors influenced the result* (Quiz & Lifestyle)
  3. *How strongly the evidence agreed* (Agreement level)
  4. *What the result means in Ayurvedic wellness*
  5. *What the result does NOT mean* (Medical boundary disclaimer)
* **FR-XAI-002 (Progressive Disclosure UX):** The results view shall present a plain-language executive summary by default, with expandable disclosure panels revealing signal weights and evidence citations.
* **FR-XAI-003 (Anti-Hallucination Explanations):** The system shall never generate synthetic causal explanations that are not mathematically traceable to input observations.

---

### Module 11: Ayurvedic Knowledge Grounding & RAG (FR-RAG)

* **FR-RAG-001 (Curated Knowledge Repository):** The system shall maintain an authenticated, versioned knowledge base of classical Ayurvedic principles, herbs, and remedies stored in PostgreSQL with `pgvector`.
* **FR-RAG-002 (Contextual Vector Retrieval):** Prior to LLM generation, the system shall query the vector store using `text-embedding-3-small` based on the user's fused constitutional profile and observed skin concerns.
* **FR-RAG-003 (Mandatory Source Citation):** Every generated recommendation shall link to specific retrieved knowledge chunks, citing the source text (e.g., *Charaka Samhita*, *Bhavaprakasha*).
* **FR-RAG-004 (Retrieval Failure Safe Fallback):** If vector similarity search returns no matches above the minimum relevance threshold, the system shall output an explicit limitation statement rather than allowing the LLM to invent remedies.
* **FR-RAG-005 (Prompt Injection Quarantine):** User input strings shall be quarantined and sanitized before injection into RAG prompts to prevent override of safety constraints.

---

### Module 12: Personalized Recommendations & Routine (FR-REC)

* **FR-REC-001 (Categorized Recommendations):** The system shall generate 3 to 5 prioritized recommendations categorized into Natural Herbs & Ingredients, Skincare Formulations, Dietary Guidance, and Lifestyle Adjustments.
* **FR-REC-002 (Standardized Recommendation Contract):** Each recommendation shall specify: Title, Rationale ("Why Suggested"), Step-by-step Usage Instructions, Frequency, Safety / Patch-Test Notice, and Evidence Citation.
* **FR-REC-003 (Mandatory Patch Test Warning):** Every topical herbal remedy shall prominently include a mandatory 24-hour patch test advisory.
* **FR-REC-004 (Personalized Routine Generation):** The system shall synthesize a structured daily routine organized into Morning, Evening, and Weekly rituals.
* **FR-REC-005 (Routine Adherence Tracking):** The system shall allow users to mark routine items as completed and track daily/weekly adherence percentages.

---

### Module 13: Analysis History & Longitudinal Progress (FR-HIST & FR-PROG)

* **FR-HIST-001 (Immutable Analysis Records):** Every completed analysis shall be stored as an immutable snapshot in `scan_results`, locking the visual observations, fusion score, confidence, and model versions at the time of creation.
* **FR-HIST-002 (Historical Timeline View):** Users shall be able to browse their complete analysis history filtered by date range and agreement state.
* **FR-PROG-001 (Longitudinal Trend Intelligence):** For users with two or more historical analyses, the system shall calculate longitudinal trends across observed visual signals, routine adherence, and confidence.
* **FR-PROG-002 (Checkpoints at 30, 60, 90 Days):** The system shall highlight 30-day, 60-day, and 90-day comparative checkpoints.
* **FR-PROG-003 (Model Incompatibility Guard):** If an earlier scan was generated with an incompatible model version, the system shall display an explanatory disclaimer regarding comparability limitations.

---

### Module 14: PDF Generation & Voice Assistant (FR-PDF & FR-VOICE)

* **FR-PDF-001 (Downloadable Wellness Report):** The system shall generate a downloadable, formatted PDF report containing user summary, analysis date, observed visual signals, Ayurvedic constitutional tendencies, confidence level, recommended routine, and prominent safety disclaimers.
* **FR-PDF-002 (Authenticated Report Access):** PDF generation shall be strictly access-controlled; users may only generate reports for their own analyses.
* **FR-VOICE-001 (Web Speech Voice Input):** The system shall integrate browser Web Speech API for voice-driven conversational inquiries regarding current analysis results and daily routines.
* **FR-VOICE-002 (Speech Synthesis Response):** Voice responses shall be synthesized aloud in the user's selected language using browser SpeechSynthesis.
* **FR-VOICE-003 (Voice Safety Guardrail):** Voice responses shall be generated through the identical RAG retrieval and safety filter pipeline as written responses.
