# AayurFace — Engineering Requirements Specification
## Document 06: Formal GIVEN / WHEN / THEN Acceptance Criteria

**Phase:** Phase 01 — Requirements Engineering, Formalization & Complete Traceability  
**Date:** 2026-09-03  
**Status:** FORMAL ENGINEERING CONTRACT  
**Authority:** QA/Test Architect, Principal Requirements Engineer  

---

### Scenario Matrix: Core Acceptance Criteria

#### 1. FR-AUTH-001 & FR-AUTH-002: User Registration & Password Verification
* **Scenario 1.1: Successful Registration**
  * `GIVEN` an unauthenticated user on `/auth/signup`
  * `WHEN` the user provides valid email "user@example.com", full name "Priya Sharma", and a compliant password "AyurSkin#2026"
  * `AND` agrees to the Terms of Service
  * `THEN` the system shall create a user record in Supabase Auth with bcrypt-hashed password
  * `AND` insert a corresponding profile in the `profiles` table
  * `AND` issue an authenticated JWT session
  * `AND` navigate the user to `/onboarding/language`.
* **Scenario 1.2: Weak Password Rejection**
  * `GIVEN` a user entering a password "short" (< 8 characters)
  * `WHEN` the user submits the registration form
  * `THEN` the form submission shall be blocked client-side with a validation error: "Password must be at least 8 characters and include mixed case, number, and special character"
  * `AND` no network request shall be transmitted to Supabase Auth.
* **Scenario 1.3: Duplicate Email Rejection**
  * `GIVEN` an email address already registered in the system
  * `WHEN` a new registration is submitted with that email
  * `THEN` the system shall return an error: "An account with this email already exists"
  * `AND` preserve user input fields except the password.

---

#### 2. FR-CONSENT-001 & FR-CONSENT-002: Informed Consent Gating
* **Scenario 2.1: Incomplete Consent Blocks Progress**
  * `GIVEN` an authenticated user on `/onboarding/consent`
  * `WHEN` the user checks only optional research consent but leaves mandatory facial processing unchecked
  * `THEN` the "I Agree and Continue" button shall remain disabled
  * `AND` navigation to `/onboarding/profile` shall be blocked.
* **Scenario 2.2: Valid Consent Submission**
  * `GIVEN` a user checking all mandatory consent items
  * `WHEN` the user clicks "I Agree and Continue"
  * `THEN` the system shall insert an immutable record in `consents` table with user ID, timestamps, and granted scopes
  * `AND` navigate the user to `/onboarding/profile`.

---

#### 3. FR-CAP-002, FR-CAP-005, FR-CAP-006: Capture Quality Gateway
* **Scenario 3.1: All Quality Checks Pass**
  * `GIVEN` the user is on `/analysis/capture` with camera active
  * `AND` exactly 1 face is detected
  * `AND` face bounds align within the oval guide ($\le \pm 15\%$)
  * `AND` face ROI luminance is within acceptable bounds (80–220)
  * `AND` frame sharpness exceeds blur threshold
  * `THEN` all live status indicators shall display GREEN
  * `AND` the "Capture" button shall become active.
* **Scenario 3.2: Insufficient Lighting Rejection**
  * `GIVEN` a user in a dark room (face ROI luminance < 80)
  * `WHEN` the quality gateway evaluates the video stream
  * `THEN` the lighting indicator shall display RED ("Too Dark")
  * `AND` the "Capture" button shall be disabled
  * `AND` the display shall show: "Lighting is too low. Move to a well-lit area."
* **Scenario 3.3: Multiple Faces Detected**
  * `GIVEN` two individuals in the camera frame
  * `WHEN` the quality gateway detects > 1 face mesh
  * `THEN` the system shall display an amber warning: "Multiple faces detected. Please ensure only one person is in the frame."
  * `AND` the "Capture" button shall be disabled.

---

#### 4. FR-FUS-001 & FR-CONF-002: Multimodal Fusion & Agreement Calculation
* **Scenario 4.1: High Agreement Convergence**
  * `GIVEN` visual signals indicating Pitta traits (redness, warmth)
  * `AND` questionnaire score indicating Pitta dominance ($P \ge 0.60$)
  * `AND` lifestyle context indicating high heat exposure and stress
  * `WHEN` the multimodal fusion engine calculates agreement
  * `THEN` the system shall assign `agreement_state = 'HIGH_AGREEMENT'`
  * `AND` calculate calibrated confidence $\ge 80\%$
  * `AND` display a Soft Jade "High Agreement" pill badge on `/analysis/results/[id]`.
* **Scenario 4.2: Low Agreement Conflict Detection**
  * `GIVEN` visual signals indicating strong Pitta markers
  * `AND` questionnaire score indicating strong Vata dominance ($V \ge 0.65$)
  * `AND` lifestyle context indicating Kapha sedentary traits
  * `WHEN` the multimodal fusion engine detects inter-modality cosine divergence
  * `THEN` the system shall assign `agreement_state = 'LOW_AGREEMENT'`
  * `AND` cap stated confidence at $< 60\%$
  * `AND` display a prominent Amber advisory card on the results screen stating: "Mixed Signals Detected — Evidence sources indicate different patterns. Confidence is reduced."
  * `AND` provide action buttons: "Retake Capture" and "Review Questionnaire".

---

#### 5. FR-RAG-002 & FR-REC-003: Knowledge Grounding & Patch Test Advisory
* **Scenario 5.1: Grounded Recommendation with Citation**
  * `GIVEN` an analysis result recommending Neem & Turmeric paste
  * `WHEN` the recommendation card is rendered
  * `THEN` it shall display the verified classical citation tag (e.g., "Source: Charaka Samhita, Chikitsa Sthana")
  * `AND` include step-by-step preparation and frequency
  * `AND` display an amber-bordered safety box: "Mandatory: Always conduct a 24-hour patch test behind the ear before full application."
* **Scenario 5.2: Knowledge Retrieval Fallback**
  * `GIVEN` a rare user condition where `pgvector` returns zero chunks above similarity threshold 0.75
  * `WHEN` the recommendation generator executes
  * `THEN` it shall NOT fabricate an unverified herbal compound
  * `AND` output a safe limitation statement: "Specific classical citations for this combination are currently unavailable. General balancing guidelines provided."

---

#### 6. FR-ROUT-005 & FR-PROG-001: Routine Tracking & Longitudinal Trends
* **Scenario 6.1: Marking Routine Item Complete**
  * `GIVEN` a user viewing today's Morning Routine on `/dashboard`
  * `WHEN` the user taps "Mark Complete" on "Splash face with cool water 7 times"
  * `THEN` the system shall persist an adherence record in `routine_tracking`
  * `AND` update today's progress bar dynamically without page reload.
* **Scenario 6.2: Longitudinal Progress Rendering**
  * `GIVEN` a returning user with 3 historical analyses across 45 days
  * `WHEN` the user visits `/progress` and selects "60 Days"
  * `THEN` the system shall render Recharts line charts for texture, erythema, and routine adherence
  * `AND` display a plain-language summary beneath each chart (e.g., "Observed redness has steadily decreased over the past 30 days").

---

#### 7. FR-PDF-002 & FR-AUTH-008: Security, Privacy & Data Lifecycle
* **Scenario 7.1: Authenticated PDF Generation**
  * `GIVEN` an authenticated user on their own results screen `/analysis/results/[id]`
  * `WHEN` the user clicks "Download Report"
  * `THEN` the system shall generate a structured PDF incorporating analysis date, visual observations, Ayurvedic context, confidence, and non-diagnostic disclaimer
  * `AND` initiate client download without exposing private storage URLs.
* **Scenario 7.2: Permanent Account Deletion**
  * `GIVEN` an authenticated user confirming account deletion in `/settings`
  * `WHEN` the user confirms their password
  * `THEN` the system shall delete the user from Supabase Auth
  * `AND` cascade-delete all rows in `profiles`, `consents`, `scan_results`, `questionnaire_responses`, `lifestyle_contexts`, and `chat_messages`
  * `AND` trigger storage bucket deletion of all facial images
  * `AND` redirect the user to `/` with session cleared.
