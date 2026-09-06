# AayurFace — Engineering Reconnaissance Audit
## Document 08: AI & Computer Vision Pipeline Assessment

**Phase:** Phase 00 — Full Repository & System Reconnaissance  
**Date:** 2026-09-03  
**Auditor:** AI/ML Engineer & Computer Vision Engineer  
**Status:** FORENSIC EVIDENCE COLLECTED — SIMULATED / COMMODITY PIPELINE DETECTED  

---

### 1. The Reality Test: Real Pipeline vs. Generic AI API

The user prompt mandates an explicit determination of whether AayurFace implements:
> **A REAL PIPELINE** (Capture → Quality Validation → Face Detection → Preprocessing → Feature Extraction → AI Interpretation → Ayurvedic Context → Multimodal Fusion → Confidence → Explainability → Safety → Result)  
> *or merely:*  
> **IMAGE → GENERIC AI API → TEXT RESPONSE**

#### Forensic Verdict:
**MERELY A GENERIC AI WRAPPER (AND IN THE UI, MERELY A TIME DELAY SIMULATION).**

* **In the Frontend (`ScanPage.tsx`):**
  There is NO pipeline. When the capture button is clicked, it does not extract video frames, detect faces, or invoke any model. It executes a `setTimeout` for 3000ms and navigates to `/results/demo-scan`.
* **In the Backend (`supabase/functions/analyze-skin/index.ts`):**
  It is purely:  
  `Raw Base64 Image → OpenAI GPT-4o Vision Chat Completion → JSON Text Response`.

---

### 2. Stage-by-Stage Forensic Breakdown

| Conceptual Pipeline Stage | PRD / Research Specification | Actual Repository Implementation | Status |
|---|---|---|---|
| **1. Capture & Permission** | Web MediaDevices API with user guidance | `react-webcam` component rendered | Partially Working |
| **2. Quality Gateway** | Client-side TensorFlow.js + MediaPipe Face Mesh real-time check of lighting, blur, centering, distance | **ZERO**. Neither TF.js nor MediaPipe installed. No sharpness or exposure calculation. | **MISSING** |
| **3. Face Detection & Landmarks** | 468-point facial mesh landmarking; face oval alignment | Static CSS circle overlay with CSS animation (`animate-breathe`) | **MOCKED** |
| **4. Preprocessing** | Server-side normalization, ROI crop, white-balance correction | In `src/lib/utils.ts`, a client-side `compressImage` helper exists but is uncalled in `ScanPage` | **UNUSED UTILITY** |
| **5. Feature Extraction** | Computer Vision extraction of texture, pigmentation density, symmetry, morphological markers | **ZERO**. No CV feature vectors extracted. Delegated entirely to GPT-4o Vision's black box. | **MISSING** |
| **6. Multimodal Fusion** | Weighted fusion of image signals, questionnaire answers, lifestyle context | **ZERO**. No fusion code exists anywhere in the repository. | **MISSING** |
| **7. Confidence & Conflict** | Inter-modality agreement calculation (High, Moderate, Low Agreement); uncertainty flagging | **ZERO**. No confidence engine exists. A hardcoded `"Mild"` badge is rendered in `ResultsPage`. | **MISSING** |
| **8. Explainable AI (XAI)** | Plain-language "Why this result" and "What this does NOT mean" rationale | Static mock text in `src/lib/mockData.ts` | **HARDCODED MOCK** |
| **9. RAG Grounding** | Vector similarity retrieval from curated Ayurvedic classical texts via `pgvector` | **ZERO**. No knowledge documents, no embeddings, no vector search. | **MISSING** |
| **10. Safety Filtering** | Mandatory patch test advisories, serious condition flagging | Prompt instructions to GPT-4o; static disclaimer in UI | **PARTIAL PROMPT** |

---

### 3. Scientific & Algorithmic Deficiencies

1. **No Indian Skin Tone Calibration:** The research document (`D:\AayurFace Research.pdf`) explicitly highlights the Fitzpatrick III–VI scale performance drop in Western models. The current repository contains zero calibration, benchmark data, or lighting normalization for Indian skin tones.
2. **Subjectivity & Black-Box Hallucination:** Asking a general multimodal LLM (GPT-4o) to look at a facial selfie and directly diagnose "Pitta imbalance with excess heat" violates the core principle of evidence-based intelligence outlined in the Research paper. Without grounding in objective visual feature measurements (erythema index, melanin index, texture entropy) and verified classical Ayurvedic treatises, the model produces ungrounded, uncalibrated approximations.
3. **No Consensus Adjudication Framework:** PRD Section 2.20 and Research Section 5 mandate an expert consensus pipeline (Triple-Practitioner Assessment) for clinical credibility. Zero code or schema exists to support researcher workflows.
