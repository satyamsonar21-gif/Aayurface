# AayurFace — Database Architecture Specification
## Target Data Exchange Contracts & Subsystem Boundary Schemas

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Staff Backend Architect, Solution Architect  

---

### 1. Architectural Contract Strategy

To guarantee loose coupling and prevent non-deterministic LLMs from corrupting backend state, all subsystem boundaries enforce strict data exchange contracts validated using Zod schemas.

---

### 2. Primary Subsystem Exchange Contracts (TypeScript / Zod Specs)

#### Contract 1: CV Feature Extractor Output Contract
```typescript
export interface CVFeatureExtractionContract {
  capture_id: string; // UUIDv7
  face_detected: true;
  mean_luma: number; // 0.0 - 255.0
  cielab: {
    l: number; // 0.0 - 100.0
    a: number; // Redness/erythema signal (-128 to 127)
    b: number; // Warmth/yellowness (-128 to 127)
  };
  glcm: {
    contrast: number; // >= 0.0 (Roughness)
    homogeneity: number; // 0.0 - 1.0 (Smoothness)
  };
  melanin_index: number; // >= 0.0
  erythema_index: number; // >= 0.0
  regional_rois: {
    forehead_mask: Array<[number, number]>;
    left_cheek_mask: Array<[number, number]>;
    right_cheek_mask: Array<[number, number]>;
  };
  cv_version: string; // e.g., 'cv-v1.0.0'
}
```

#### Contract 2: Multimodal Fusion Engine Input/Output Contract
```typescript
export interface MultimodalFusionInputContract {
  visual_vector: [number, number, number]; // [Vata, Pitta, Kapha] (Sum = 1.0)
  quiz_vector: [number, number, number];   // [Vata, Pitta, Kapha] (Sum = 1.0)
  lifestyle_vector: [number, number, number]; // [Vata, Pitta, Kapha] (Sum = 1.0)
  configuration_version: string;
}

export interface MultimodalFusionOutputContract {
  fused_vector: {
    vata: number;  // 0.0 - 100.0%
    pitta: number; // 0.0 - 100.0%
    kapha: number; // 0.0 - 100.0%
  };
  dominant_dosha: 'VATA' | 'PITTA' | 'KAPHA' | 'VATA_PITTA' | 'PITTA_KAPHA' | 'VATA_KAPHA' | 'TRIDOSHIC';
  pairwise_similarities: {
    vis_quiz: number;
    vis_life: number;
    quiz_life: number;
  };
  agreement_index: number; // Harmonic mean A (0.0 - 1.0)
  agreement_state: 'HIGH_AGREEMENT' | 'MODERATE_AGREEMENT' | 'LOW_AGREEMENT' | 'INSUFFICIENT_DATA';
  calibrated_confidence: number; // 0.0 - 100.0% (Capped < 60.0% on LOW_AGREEMENT)
}
```

#### Contract 3: RAG Retrieval Payload Contract
```typescript
export interface RAGRetrievalChunkContract {
  id: string; // UUID of knowledge_chunks row
  source_work: string; // e.g., 'Charaka Samhita'
  section_reference: string; // e.g., 'Sutra Sthana 5.12'
  verse_numbers: string;
  content_english: string;
  content_sanskrit: string;
  target_doshas: string[];
  cosine_similarity: number; // >= 0.75
}
```

#### Contract 4: Foundation Model (LLM) Output Schema Contract
```typescript
export interface LLMAnalysisOutputContract {
  summary: string;
  dominant_tendency_explanation: string;
  contributing_factors: Array<{
    modality: 'VISUAL' | 'LIFESTYLE' | 'CONSTITUTIONAL';
    observation: string;
    ayurvedic_rationale: string;
  }>;
  recommended_rituals: Array<{
    knowledge_chunk_id: string; // Must match one of retrieved RAG chunk IDs
    ritual_name: string;
    timing: 'MORNING' | 'EVENING' | 'WEEKLY';
    instructions: string;
    contraindications: string;
    herb_name?: string;
    patch_test_required: boolean;
  }>;
  safety_advisories: string[];
  prohibited_terms_scanned: boolean; // Confirms zero disease/medical claims
}
```
