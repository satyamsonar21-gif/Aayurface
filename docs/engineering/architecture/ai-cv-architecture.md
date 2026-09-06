# AayurFace — Architecture Specification
## Computer Vision & Model-Agnostic AI Pipeline Architecture

**Phase:** Phase 02 — Target System Architecture, ADRs & Implementation Blueprint  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION  
**Authority:** AI/ML Architect, Computer Vision Engineer  

---

### 1. The Two-Tier Computer Vision Pipeline

AayurFace explicitly rejects using generic LLM vision prompts (such as unconstrained GPT-4o Vision) as the primary computer vision engine. Relying solely on multimodal LLMs produces uncalibrated, stochastic descriptions, introduces high per-scan latency and cost, and fails to provide verifiable, reproducible biometric feature metrics.

Instead, AayurFace implements a **Two-Tier Computer Vision Architecture**:

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│              TIER 1: CLIENT-SIDE STANDARDIZED CAPTURE GATEWAY                   │
│              (Browser Runtime: MediaPipe Face Mesh in WebAssembly)              │
│                                                                                 │
│  • Continuous evaluation of video stream in volatile browser RAM (Zero storage) │
│  • 468 3D Landmark points tracked locally via WebGL/Wasm                        │
│  • Real-Time Quality Checks:                                                    │
│    1. Single Face Invariant: Exactly 1 face detected                            │
│    2. Oval Centering Guide: Centroid alignment within +/- 15% oval bounds       │
│    3. Approximate Distance: Inter-pupillary distance scale (90px - 180px)       │
│    4. Illumination Adequacy: ROI mean luminance within 80 - 220 (0-255 scale)   │
│    5. Motion Blur / Sharpness: Laplacian variance above sharpness threshold     │
│    6. Occlusion Gate: Facial landmark confidence >= 0.85 (No masks/hair/glasses)│
│                                                                                 │
│  DECISION: [PASS] -> Enable Capture Button -> Upload Single Encrypted Frame     │
│            [FAIL] -> Disable Button -> Provide Live Dynamic Corrective Guidance │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │ Single Approved Encrypted JPEG
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│            TIER 2: SERVERLESS DETERMINISTIC BIOMETRIC FEATURE EXTRACTION        │
│            (Supabase Edge Function / Python Extraction Worker)                  │
│                                                                                 │
│  • Secure signed download of single frame from private storage bucket           │
│  • Mathematical Signal Extraction:                                              │
│    1. Micro-Vascular Redness Index: CIELAB a* channel distribution (Cheek ROIs) │
│    2. Surface Texture Roughness: GLCM Contrast, Energy, and Entropy             │
│    3. Melanin Uniformity Index: CIELAB L* variance & under-eye circle contrast  │
│    4. Surface Reflectance / Sebum: Specular reflectance clusters on T-zone     │
│    5. Ayurvedic Morphological Proportions: Facial aspect ratio & lip curvature  │
│                                                                                 │
│  OUTPUT: Structured, Normalized VisualObservations Vector (0.0 - 1.0)           │
│  STRICT INVARIANT: No Medical or Pathological Diagnosis Generated               │
└─────────────────────────────────────────────────────────────────────────────────┘
```

> [!NOTE]
> **Candidate Technique Classification**  
> CIELAB $a^*$ redness distribution, GLCM texture analysis, and melanin uniformity indices are **CANDIDATE SIGNAL-EXTRACTION APPROACHES** pending implementation, calibration, and empirical validation in Milestone 09. They do not constitute a validated clinical model or dermatological diagnostic instrument.

---

### 2. Capture Quality Gateway Finite State Machine

The client capture gateway enforces a deterministic state machine before permitting frame capture:

```text
       ┌────────────────────────┐
       │      INITIALIZING      │ MediaPipe Wasm & Camera Stream Loading
       └───────────┬────────────┘
                   │
                   ▼
       ┌────────────────────────┐
       │   WAITING_FOR_FACE     │ Face Count = 0 ("Position face in guide")
       └─────┬───────────┬──────┘
  Face Count │           │ Face Count = 1
         > 1 │           ▼
┌────────────┴───┐   ┌────────────────────────┐
│ MULTIPLE_FACES │   │    EVALUATING_FRAME    │
└────────────────┘   └───────────┬────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │ Centering > 15%       │ Luminance < 80        │ Sharpness < Threshold
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ POOR_CENTERING  │     │ POOR_LIGHTING   │     │  MOTION_BLUR    │
│ ("Center face") │     │ ("Too dark")    │     │ ("Hold steady") │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │ All 6 Checks PASS
                                 ▼
                     ┌────────────────────────┐
                     │    GATEWAY_APPROVED    │ "Capture" Button Activated
                     └───────────┬────────────┘
                                 │ User clicks Capture
                                 ▼
                     ┌────────────────────────┐
                     │   CAPTURING_ENCRYPT    │ Single frame encrypted & sent
                     └────────────────────────┘
```

---

### 3. Model-Agnostic Interface & Abstraction Layer

To ensure future foundation models or dedicated CV algorithms can be integrated without application refactoring, domain services interact with AI providers through abstract TypeScript interfaces:

```typescript
// Model Abstraction Interface for Computer Vision
export interface ICVFeatureExtractor {
  extractFeatures(imageBuffer: Uint8Array): Promise<VisualObservations>;
  getVersion(): string; // e.g., "fe-mediapipe-v1.0.0"
}

// Model Abstraction Interface for Generative Reasoning & XAI
export interface IAiReasoningEngine {
  generateAnalysis(
    input: MultimodalAnalysisInput,
    groundedContext: KnowledgeChunk[]
  ): Promise<AnalysisResultPayload>;
  getModelMetadata(): ModelProvenance;
}

export interface ModelProvenance {
  provider: 'openai' | 'anthropic' | 'local_onnx';
  modelId: string; // e.g., "gpt-4o-2024-08-06"
  temperature: number;
  promptVersion: string; // e.g., "ayur-xai-v1.2"
  executionTimestamp: string;
}
```

---

### 4. Indian Skin Tone Calibration & Fitzpatrick III–VI Representation

A critical scientific imperative documented in `AayurFace Research.pdf` is addressing dermatological algorithmic bias on darker Indian skin tones:
* Standard computer vision models trained on Western datasets (Fitzpatrick I–II) misinterpret melanin pigmentation for erythema (redness/inflammation) or fail edge detection under non-studio lighting.
* **Architectural Calibration Guard:** The CIELAB color space transformation isolates the $L^*$ (lightness/melanin) channel from the $a^*$ (green-red/erythema) channel, enabling independent calculation of micro-vascular redness without conflating it with baseline melanin content.
* **Benchmark Requirement:** All server-side feature extraction algorithms must be benchmarked across Fitzpatrick phototypes III through VI before production baseline approval.
