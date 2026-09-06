# AayurFace — Engineering Requirements Specification
## Document 08: Computer Vision & Capture Gateway Specifications

**Phase:** Phase 01 — Requirements Engineering, Formalization & Complete Traceability  
**Date:** 2026-09-03  
**Status:** FORMAL ENGINEERING CONTRACT  
**Authority:** Computer Vision Engineer, Solution Architect  

---

### 1. The Two-Tier Computer Vision Architecture

AayurFace divides computer vision into two distinct tiers:

```text
┌──────────────────────────────────────────────────────────────────┐
│             TIER 1: CLIENT-SIDE CAPTURE QUALITY GATEWAY          │
│               (Browser: TensorFlow.js / MediaPipe)               │
│                                                                  │
│  • Ephemeral processing in browser memory; no frames saved       │
│  • 468-point 3D Face Mesh detection                              │
│  • Real-time validation:                                         │
│    1. Face Presence & Single-Face Invariant                      │
│    2. Oval Centering Alignment (Bounding Box Offset <= 15%)      │
│    3. Approximate Distance (Inter-pupillary distance: 90-180px)  │
│    4. Illumination Adequacy (Luma histogram: 80–220 range)       │
│    5. Sharpness / Blur Gating (Laplacian variance > Threshold)   │
│    6. Occlusion Detection (Forehead/Cheek Landmark Confidence)   │
│                                                                  │
│  DECISION: [PASS] -> Enable Capture Button                       │
│            [FAIL] -> Disable Button + Show Dynamic Guidance      │
└─────────────────────────────────┬────────────────────────────────┘
                                  │ Single Approved Encrypted Frame
                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│             TIER 2: SERVER-SIDE BIOMETRIC FEATURE EXTRACTION     │
│                 (Supabase Edge Functions / Python Worker)        │
│                                                                  │
│  • Micro-Vascular Redness Index (CIELAB a* / Erythema Score)     │
│  • Surface Texture Roughness & Pore Prominence (GLCM Entropy)    │
│  • Melanin & Hyperpigmentation Uniformity (CIELAB L* variance)   │
│  • Ayurvedic Morphological Facial Proportions                    │
│                                                                  │
│  OUTPUT: Normalized VisualObservations Vector (0.0 - 1.0)        │
│  STRICT INVARIANT: No Disease Diagnosis Generated                │
└──────────────────────────────────────────────────────────────────┘
```

---

### 2. Capture Quality Gateway Specifications (CV-CAP)

* **CV-CAP-001 (Face Mesh Landmark Model):** The client application shall load MediaPipe Face Mesh running locally via WebAssembly/WebGL to detect 468 facial coordinates without sending video streams to a server.
* **CV-CAP-002 (Single-Face Constraint):**
  $$\text{Valid Face Count} = 1$$
  If count $= 0$, trigger "No face detected". If count $> 1$, trigger "Multiple faces detected".
* **CV-CAP-003 (Centering & Bounding Box Alignment):**
  Let the oval guide center be $(X_c, Y_c)$ with dimensions $(W_{oval}, H_{oval})$. The detected face bounding box center $(x_f, y_f)$ shall satisfy:
  $$\frac{|x_f - X_c|}{W_{oval}} \le 0.15 \quad \text{AND} \quad \frac{|y_f - Y_c|}{H_{oval}} \le 0.15$$
  If offset exceeds $15\%$, status is `POOR_CENTERING` ("Center your face in the oval").
* **CV-CAP-004 (Inter-Pupillary Distance / Scale Evaluation):**
  The Euclidean distance between pupil landmarks (Landmark 468 and 473) shall fall within a calibrated pixel range:
  $$D_{min} \le \text{dist}(P_{left}, P_{right}) \le D_{max}$$
  * If $< D_{min}$: Trigger "Move closer".
  * If $> D_{max}$: Trigger "Move back".
* **CV-CAP-005 (ROI Illumination & Exposure):**
  The mean luminance $Y$ calculated from the facial skin polygon ROI in the YUV/YCbCr color space shall satisfy:
  $$80 \le \bar{Y}_{face} \le 220 \quad (\text{Scale: } 0 - 255)$$
  * If $\bar{Y} < 80$: Trigger `TOO_DARK` ("Move to a brighter area").
  * If $\bar{Y} > 220$: Trigger `TOO_BRIGHT` ("Reduce direct glare").
* **CV-CAP-006 (Sharpness / Motion Blur Gating):**
  The system shall compute the variance of the Laplacian filter over the grayscale facial ROI:
  $$\sigma^2_{Laplacian} \ge \tau_{blur}$$
  Frames below $\tau_{blur}$ shall be classified as `BLURRY` ("Hold still, stabilizing camera").
* **CV-CAP-007 (Occlusion Detection):**
  Key facial feature landmarks (forehead: 10, nose tip: 1, cheeks: 234/454, chin: 152) shall maintain landmark visibility confidence $\ge 0.85$. If occluded, trigger "Remove hair, glasses, or mask obstructing your face".
* **CV-CAP-008 (Deterministic Pass Condition):**
  $$\text{Capture Enabled} \iff \bigwedge_{k=1}^7 \text{Check}_k = \text{PASS}$$

---

### 3. Biometric Feature Extraction Specifications (CV-FEAT)

* **CV-FEAT-001 (Micro-Vascular Redness Index):**
  Extract CIELAB $a^*$ channel mean and localized variance across bilateral cheek ROIs to measure micro-vascular erythema. Normalized to $S_{redness} \in [0.0, 1.0]$.
  * *Ayurvedic Relevance:* High redness correlates with Pitta aggravation (excess heat / inflammatory tendency).
* **CV-FEAT-002 (Surface Texture Roughness):**
  Apply Gray-Level Co-occurrence Matrix (GLCM) contrast, energy, and entropy across the cheek and forehead patches. Normalized to $S_{roughness} \in [0.0, 1.0]$.
  * *Ayurvedic Relevance:* High roughness/flakiness correlates with Vata aggravation (dryness / roughness).
* **CV-FEAT-003 (Pigmentation Uniformity Index):**
  Calculate standard deviation of luminance $L^*$ and melanin contrast across periorbital (under-eye) and cheek zones. Normalized to $S_{pigment} \in [0.0, 1.0]$.
  * *Ayurvedic Relevance:* Under-eye pigmentation and patchy tone correlate with Vata-Pitta imbalances.
* **CV-FEAT-004 (Sebum / Surface Reflectance Indicator):**
  Calculate high-specular reflectance pixel clusters on forehead and nose T-zone. Normalized to $S_{sebum} \in [0.0, 1.0]$.
  * *Ayurvedic Relevance:* High lipid shine correlates with Kapha dominance.
* **CV-FEAT-005 (Ayurvedic Morphological Extraction):**
  Compute facial aspect ratio (bizygomatic width / facial height), eye roundness metric, and lip curvature ratio from 3D landmark coordinates.
* **CV-FEAT-006 (Output Schema):** The feature extraction module shall output a structured `VisualObservations` payload with numerical indicators, confidence scores, and bounding metadata.

---

### 4. Non-Diagnostic Boundary & Ethical Guardrails

1. **No Pathology Labels:** The CV pipeline shall NEVER output labels such as "Acne Vulgaris", "Melasma", "Atopic Dermatitis", or "Seborrheic Dermatitis".
2. **Neutral Descriptive Nomenclature:** Visual findings shall strictly use descriptive, empirical terminology:
   * *Permitted:* "Localized surface redness", "Increased surface reflectance", "Micro-texture unevenness".
   * *Forbidden:* "Infected lesions", "Rosacea flare-up", "Cystic outbreak".
3. **Population Calibration Requirement:** Feature extraction thresholds shall be calibrated against Fitzpatrick skin phototypes III through VI to eliminate darker skin tone algorithmic bias.
