# AayurFace — Security Architecture Specification
## Computer Vision Quality Gateway & Adversarial Input Security

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Computer Vision Architect, Principal Security Architect  
**Validation Notice:** The controls specified herein represent target architectural defenses. Adversarial robustness is an **UNVERIFIED TARGET** requiring physical empirical benchmark testing in Milestone 07.  

---

### 1. Computer Vision Threat Modeling

The computer vision pipeline evaluates facial skin surface characteristics to derive objective numerical indices (CIELAB $a^*$ redness, GLCM texture roughness, melanin uniformity). Attackers and degraded consumer conditions introduce critical threats:
* **Adversarial Perturbations:** Sub-perceptual pixel alterations designed to trick feature extractors into misclassifying skin characteristics.
* **Photo / Screen Replay Spoofing:** Presenting a printed photograph or digital screen showing another individual's face to trigger unauthorized scans or skew wellness records.
* **Extreme Environmental Degradation:** Heavy shadowing, extreme backlighting, motion blur, or face coverings that cause inaccurate phenotypic feature calculation.
* **Client Resource Exhaustion:** Running continuous unconstrained MediaPipe landmark loops on low-end mobile devices, causing browser freezing or battery drain.

---

### 2. Client WebAssembly Capture Quality Gateway

To prevent degraded or non-human images from entering the serverless processing pipeline, the client SPA executes an ephemeral **Capture Quality Gateway** running `@mediapipe/face_mesh` in WebAssembly:

```text
[Continuous Camera Stream]
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│ WebAssembly MediaPipe FaceMesh Evaluation (Volatile RAM)     │
├─────────────────────────────────────────────────────────────┤
│ 1. Face Count Gate: Exactly 1 face detected                 │
│ 2. Landmark Completeness: Landmark confidence >= 0.85       │
│ 3. Pose / Angle Gate: Yaw, Pitch, Roll within +/- 15 deg    │
│ 4. Centering Gate: Centroid within +/- 15% oval guide bounds│
│ 5. Distance Gate: Inter-pupillary scale (90px to 180px)     │
│ 6. Illumination Gate: Mean ROI luminance 80 - 220 (0-255)   │
│ 7. Sharpness Gate: Laplacian variance >= 100.0 (No blur)    │
└─────────────────────────────┬───────────────────────────────┘
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼
          GATE PASS                     GATE FAIL
      [Enable Capture]              [Disable Button]
    (Upload Single Frame)      (Render Live Corrective HUD)
```

---

### 3. Serverless Resource & Execution Boundaries

When the single approved frame reaches the serverless feature extraction worker:
* **Execution Timeout:** The extraction worker enforces a strict execution deadline of **15 seconds**. If signal extraction does not complete within 15 seconds, the worker terminates and returns an RFC 7807 timeout error.
* **Image Dimension Capping:** Unpacked bitmap buffers exceeding $1920 \times 1080$ pixels are rejected before processing.
* **Fallback & Degraded Mode (`FR-FUS-003`):** If server-side image corruption or unexpected landmark failure occurs, the pipeline degrades gracefully:
  * The visual modality is excluded.
  * Constitutional scoring falls back to the 15-question intake and lifestyle context.
  * Calibrated confidence reflects the missing modality ($C_{input} \le 0.60$).
