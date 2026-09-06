# Architecture Decision Record: ADR-006
## Computer Vision Boundary: Two-Tier Pipeline (Client Gateway + Server Extraction)

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Deciders:** AI/ML Architect, Computer Vision Engineer, Solution Architect  
**Technical Area:** Computer Vision & Quality Assurance  

---

### 1. Context
The existing prototype uses a 3-second mock timer and sends unvalidated images directly to an unauthenticated Edge Function running generic GPT-4o Vision. GPT-4o Vision is uncalibrated for precise skin biometrics and produces non-reproducible, stochastic results.

### 2. Problem
Establishing a scientifically defensible, model-agnostic computer vision pipeline that enforces strict capture standardization, operates safely across mobile devices, and isolates deterministic feature extraction from generative AI.

### 3. Options Evaluated
* **Option A: Pure LLM Vision (Direct GPT-4o Vision):** Send raw image directly to GPT-4o Vision; ask the LLM to guess skin redness and dosha tendencies.
* **Option B: Heavy Server-Side CV Model (Dedicated Python Microservice):** Transmit continuous live video frames to a server running OpenCV and deep learning models.
* **Option C: Two-Tier Pipeline: Client-Side Gateway (Wasm) + Server-Side Extraction (Selected):** MediaPipe Face Mesh runs in client browser RAM; single approved frame undergoes deterministic numerical signal extraction on the backend.

### 4. Decision
Adopt **Option C: Two-Tier Computer Vision Pipeline**.
* **Tier 1 (Client WebAssembly):** MediaPipe Face Mesh runs locally in the browser to evaluate lighting, distance, centering, blur, and single-face presence in volatile RAM.
* **Tier 2 (Serverless Feature Extraction):** A single approved frame is processed to compute objective numerical indices (CIELAB $a^*$ micro-vascular redness, GLCM surface texture, melanin uniformity).

### 5. Rationale
* **Standardized Inputs:** Tier 1 eliminates 90% of poor captures before they incur cloud compute costs or introduce noisy artifacts into downstream algorithms.
* **Biometric Privacy:** Live camera frames never leave browser memory. Only a single verified frame is transmitted.
* **Scientific Reproducibility:** Deterministic mathematical algorithms (CIELAB, GLCM) produce identical numbers for identical frames, unlike stochastic LLM vision completions.

### 6. Consequences
* *Positive:* Drastically lowers API costs, guarantees capture quality, provides instant real-time feedback to users.
* *Negative:* Requires loading MediaPipe WebAssembly assets (~5MB) in the client browser.

### 7. Risks & Mitigations
* *Risk:* Low-end Android devices struggle with WebAssembly landmark tracking.
* *Mitigation:* Frame throttling (evaluate every 3rd frame) and WebGL hardware acceleration.

### 8. Evidence
`AayurFace Research.pdf` demonstrates that standardized ROI extraction is essential for cross-practitioner consensus.

### 9. Revisit Conditions
Revisit if browser WebNN (Web Neural Network API) matures, allowing Tier 2 feature extraction to run entirely in the browser.
