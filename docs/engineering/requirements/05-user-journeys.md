# AayurFace — Engineering Requirements Specification
## Document 05: Complete Step-by-Step User Journeys

**Phase:** Phase 01 — Requirements Engineering, Formalization & Complete Traceability  
**Date:** 2026-09-03  
**Status:** FORMAL ENGINEERING CONTRACT  
**Authority:** Principal Product Engineer, UX/Accessibility Engineer  

---

### Journey A: First-Time User — Complete End-to-End Analysis (JRN-A)

1. **Discovery (`/`):** User arrives at landing page; reviews "How It Works" 5-step flow and transparency statement; clicks "Start Your Analysis".
2. **Language Selection (`/onboarding/language`):** User selects preferred language (English or Hindi); app-wide locale updates immediately.
3. **Authentication (`/auth/signup`):** User inputs name, email, and password; accepts Terms of Service; account created via Supabase Auth; authenticated JWT issued.
4. **Informed Consent (`/onboarding/consent`):** User reviews clear disclosures; checks mandatory boxes for facial biometric processing and analysis storage; optionally checks research participation; clicks "I Agree and Continue".
5. **Basic Profile (`/onboarding/profile`):** User selects age range, gender, and primary skin concerns (e.g., Acne, Sensitivity); data saved to profile.
6. **Wellness Preferences (`/onboarding/preferences`):** User selects wellness goals (Skin Health, Energy) and recommendation style (Ingredient-focused); configures reminder toggles.
7. **Ayurvedic Questionnaire (`/onboarding/questionnaire`):** User completes 15 constitutional questions with animated step transitions; reviews answers on summary review screen; submits questionnaire; system computes normalized V/P/K vector.
8. **Lifestyle Context (`/onboarding/lifestyle`):** User inputs diet, sleep quality, stress level, climate, water intake, activity, and environmental exposure toggles; context saved.
9. **Capture Preparation (`/onboarding/ready`):** User reviews preparation guidelines (good lighting, remove glasses, hold still); clicks "Start Face Capture".
10. **Standardized Capture Gateway (`/analysis/capture`):** Camera initiates; oval guide displays; real-time MediaPipe quality checks evaluate lighting, distance, centering, and blur; when all indicators turn Green, capture button enables; user captures frame; quality gateway validates pass.
11. **Secure Ingestion & Processing (`/analysis/processing`):** Image uploads to private Supabase Storage bucket; Supabase Realtime channel updates status: "Extracting visual signals..." → "Combining evidence..." → "Retrieving knowledge..." → "Applying safety review...".
12. **Results & Guidance (`/analysis/results/[id]`):** Results load: Dominant tendency displayed with High/Moderate Agreement badge; observed skin signals detailed; constitutional breakdown visualized; RAG-grounded recommendations and daily routine displayed; persistent non-diagnostic safety disclaimer visible.
13. **Dashboard Transition (`/dashboard`):** Analysis auto-saved to history; user navigates to dashboard where recent analysis summary and today's routine items are pinned.

---

### Journey B: Returning User — Follow-up Analysis & Trend Tracking (JRN-B)

1. **Authentication (`/auth/login`):** User logs in with email/password or Google OAuth; redirected to `/dashboard`.
2. **Initiate Scan:** User clicks prominent "New Analysis" CTA card.
3. **Context Refresh:** System prompts: "Would you like to refresh your lifestyle context since your last analysis?"; user updates sleep or stress values or clicks "Keep Previous".
4. **Capture Flow:** User completes standardized capture at `/analysis/capture`; passes quality gateway; edge function processes new analysis.
5. **Delta Insight:** Results screen highlights changes compared with previous capture (e.g., "Texture observation improved compared with capture on Aug 14").
6. **Longitudinal Progress (`/progress`):** User views 30-day trend chart with plain-language explanation, routine adherence percentage, and confidence trajectory.

---

### Journey C: Capture Quality Failure & Corrective Guidance (JRN-C)

1. **Camera Initiation:** User opens capture screen in low-light environment.
2. **Quality Detection:** Real-time evaluation marks Lighting indicator RED ("Too Dark") and Face Centering AMBER ("Move Closer").
3. **Control Gating:** "Capture" button remains disabled.
4. **Dynamic Feedback:** On-screen prompt guides user: "Move to a well-lit area facing a light source. Bring face closer to center oval."
5. **Adjustment:** User turns on room light and centers face.
6. **Quality Pass:** All indicators transition to GREEN ("Lighting Good", "Position Good", "Sharpness Good"); capture button enables.
7. **Successful Submission:** User clicks Capture; gateway accepts frame and proceeds.

---

### Journey D: Multimodal Disagreement & Low-Agreement Handling (JRN-D)

1. **Input Discrepancy:** Visual feature extraction detects micro-vascular redness and warmth (Pitta signals), but questionnaire responses strongly reflect Vata traits (dryness, light frame), and lifestyle reflects high stress.
2. **Conflict Detection:** Fusion engine calculates inter-modality agreement score; falls below threshold; assigns `LOW_AGREEMENT`.
3. **Uncertainty Presentation:** Results screen prominently displays AMBER advisory card: "Mixed Signals Detected — Your facial observations and questionnaire answers indicate different constitutional patterns. Stated confidence is reduced."
4. **Calibrated Output:** Recommendations are marked as "Provisional / Exploratory"; language is softened; system offers prominent CTA buttons: "Retake Face Capture" or "Review Constitutional Answers".
5. **Invariant Check:** The system NEVER fabricates a false consensus.

---

### Journey E: Knowledge Retrieval Failure & Safe Fallback (JRN-E)

1. **Retrieval Trigger:** Fusion engine completes; RAG service queries `pgvector` knowledge base for specific rare herb interactions.
2. **Retrieval Miss:** Vector similarity search returns zero chunks exceeding relevance threshold ($0.75$).
3. **Safe Fallback:** System blocks generative hallucination; returns validated general Ayurvedic skin care guidance with an explicit limitation notice: "Specific classical citations for this combination could not be verified. General balancing recommendations provided."
4. **Audit Record:** Event logged as `KNOWLEDGE_RETRIEVAL_FALLBACK` for admin review.

---

### Journey F: Unauthorized Access Prevention (JRN-F)

1. **Tampering Attempt:** Authenticated User A attempts to view User B's scan by manually entering URL `/analysis/results/[user-b-analysis-id]`.
2. **RLS Enforcement:** Frontend query executes Supabase call; PostgreSQL RLS policy `USING (auth.uid() = user_id)` evaluates to `FALSE`.
3. **Zero Disclosure:** Database returns empty row set (0 rows found).
4. **Client Handling:** Application renders friendly "Analysis Not Found" error without disclosing that the record exists under another user.

---

### Journey G: Consent Withdrawal & Account Data Deletion (JRN-G)

1. **Settings Navigation (`/settings`):** User opens "Privacy & Data" section.
2. **Deletion Request:** User clicks "Delete My Account & Data"; modal displays consequences (permanent erasure of all historical scans, routines, and images).
3. **Re-Authentication:** User confirms by typing account password.
4. **Cryptographic Purging:**
   * Supabase Auth user record deleted.
   * PostgreSQL cascading foreign keys remove `profiles`, `questionnaire_responses`, `lifestyle_contexts`, `scan_results`, and `chat_messages`.
   * Background storage worker purges all user images from private bucket.
5. **Confirmation & Redirection:** Client clears local storage session; redirects to `/` with confirmation message.
