# AayurFace — Engineering Requirements Specification
## Document 14: System Versioning & Longitudinal Comparability Specifications

**Phase:** Phase 01 — Requirements Engineering, Formalization & Complete Traceability  
**Date:** 2026-09-03  
**Status:** FORMAL ENGINEERING CONTRACT  
**Authority:** Principal Architect, AI/ML Architect, Data Architect  

---

### 1. The Multi-Tier Versioning Mandate

Because AayurFace tracks longitudinal health and wellness progress over 30, 60, and 90-day checkpoints, model updates must never silently distort historical data. Every analysis snapshot stored in `scan_results` shall be pinned to the exact version metadata of every component that produced it.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      IMMUTABLE ANALYSIS SNAPSHOT                       │
│  analysis_id: "7f4c9c1a-..."                                           │
│  created_at: "2026-09-03T10:00:00Z"                                    │
│  ├── cv_version: "mediapipe-facemesh-v0.10.9"                          │
│  ├── feature_extractor_version: "fe-v1.0.0"                            │
│  ├── fusion_version: "fusion-alg-v1.0"                                 │
│  ├── ai_model_version: "gpt-4o-2024-08-06"                             │
│  ├── prompt_version: "ayur-analysis-system-v1.2"                       │
│  ├── knowledge_base_version: "ayur-corpus-20260901"                    │
│  ├── safety_rules_version: "safety-v1.1"                               │
│  └── schema_version: "analysis-contract-v1.0"                          │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Versioned Subsystem Specifications (VER)

* **VER-001 (Computer Vision Model Versioning):** The client-side MediaPipe library and feature extraction scripts shall be tagged with semantic version strings (e.g., `mediapipe-facemesh-v0.10.9`). Upgrades to landmarking algorithms shall increment the minor or major version.
* **VER-002 (AI Foundation Model Versioning):** Edge Functions shall explicitly specify pinned snapshot model IDs (e.g., `gpt-4o-2024-08-06`) rather than moving aliases (e.g., `gpt-4o` or `latest`) to prevent unmonitored upstream behavioral drift.
* **VER-003 (Prompt Template Versioning):** All system prompts and user prompt templates shall be stored in version-controlled files with discrete semantic version identifiers (e.g., `prompt-analysis-v1.2.md`).
* **VER-004 (Ayurvedic Knowledge Base Versioning):** The curated `knowledge_chunks` table in Supabase shall maintain a `version` field. When classical texts are updated or re-embedded, existing records shall be archived and a new corpus version issued.
* **VER-005 (Multimodal Fusion Weights Versioning):** Any calibration adjustments to modality weights ($w_{vis}, w_{quiz}, w_{life}$) or agreement thresholds shall increment `fusion_version`.

---

### 3. Longitudinal Comparability & Historical Protection (VER-COMP)

* **VER-COMP-001 (Historical Immutability Invariant):** Upgrades to AI models, prompts, or knowledge bases shall NEVER trigger retroactive recalculations of past user analyses stored in `scan_results`. Past records represent historical truth.
* **VER-COMP-002 (Cross-Version Comparability Matrix):**
  * When rendering longitudinal trend charts across multiple scans on `/progress`, the system shall inspect the `cv_version` and `fusion_version` of each data point.
  * If two analyses share identical major versions (`fe-v1.x` and `fe-v1.y`), direct numerical comparison of visual features is permitted.
  * If a major breaking version change exists (`fe-v1.x` vs. `fe-v2.0`), the system shall display an explanatory advisory banner: "Note: The visual analysis algorithm was upgraded on [Date]. Long-term visual trend comparisons across this date should be viewed contextually."
