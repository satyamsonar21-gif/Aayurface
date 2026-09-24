# Phase 13 Forensic Repository Baseline & Architecture Status
**Domain:** AI Knowledge Systems, RAG, XAI, Provenance & Safety  
**Standard:** Forensic • Evidence-First • Production-Grade  
**Date:** September 2026  
**Repository State:** Phase 12 Verified (12 test suites, 171 unit/integration tests passing)  

---

## 1. Executive Summary

A comprehensive forensic audit of the repository was conducted before authoring any Phase 13 code. This baseline establishes the exact boundaries between the **current working code**, **historical/prototype code**, and the **Phase 13 production target architecture**.

---

## 2. Environment & Stack Baseline

| Component | Current Specification / Version | Verification Evidence |
| :--- | :--- | :--- |
| **Runtime Environment** | Node.js v24.13.0 / Windows 11 AMD64 | `node --version` |
| **Language & Toolchain** | TypeScript 6.0.2, Vite 8.2.1 | `package.json` |
| **Frameworks** | React 19.2.8, React Router DOM 7.18.2 | `package.json` |
| **Styling** | TailwindCSS 4.3.3, Lucide React 1.29.0 | `package.json` |
| **Database & Client** | Supabase JS 2.112.2, PostgreSQL 15+ (local/cloud schema) | `supabase/schema.sql` |
| **Test Runner** | Vitest 4.1.11, jsdom 29.1.1, Testing Library 16.3.2 | `vitest run` (171 tests pass) |
| **Linter** | Oxlint 1.75.0 | `npm run lint` (0 errors, 27 warnings in test scripts) |
| **Computer Vision Engine** | MediaPipe BlazeFace v1.0.1, Canvas Laplacian | `src/lib/cv/` |
| **Ayurveda Intelligence** | Phase 11 Rule Engine & Provenance (`ayur-k-v1.0.0`) | `src/lib/ayurveda/` |
| **Multimodal Fusion** | Phase 12 Fusion Engine, Lineage & Uncertainty Ceilings | `src/lib/fusion/` |

---

## 3. Audit of Existing AI Modules & Contracts

### 3.1 Historical / Prototype Edge Functions (Deprecated / Unsafe)
Inspection of `supabase/functions/` revealed two early prototype functions:
1. `supabase/functions/ayurveda-chat/index.ts`:
   - Directly invoked OpenAI `gpt-4o` with arbitrary user messages.
   - Lacks grounding, citation verification, prompt-injection defenses, and verifiable knowledge retrieval.
2. `supabase/functions/analyze-skin/index.ts`:
   - Accepts base64 facial images and instructs `gpt-4o` to perform direct clinical diagnostics (e.g., severity ratings, disease flags, and direct face-to-Dosha mapping).
   - **Forensic Status:** Strictly identified as obsolete prototype artifacts. These directly violate Phase 10, 11, 12, and 13 safety boundaries. They will not be used as authoritative references.

### 3.2 Target Contracts Established in Architecture Documents
Inspection of `docs/engineering/api/` revealed target specifications drafted during Phase 05:
- `RAG-CONTRACT.md`: Specifies retrieval query schema, minimum cosine similarity threshold ($\ge 0.75$), match gating ($\ge 2$ matches), and system prompt isolation.
- `EXPLAINABILITY-CONTRACT.md`: Specifies 7 explainability questions, observed signals, modality contribution weights, harmonic agreement index, and explicit negative medical boundaries.
- `AI-SAFETY-CONTRACT.md`: Specifies a 5-stage untrusted output validation pipeline (Structural Zod parser, Enumeration/Range checks, Prohibited Medical Vocabulary Scanner, Citation Authenticity Gate, Toxic Botanical Scanner).

---

## 4. Upstream Phase Contracts Preserved

Phase 13 strictly consumes, without modifying or reinterpreting, upstream contract invariants:

1. **Phase 10 (CV Readiness):**
   - Output: `CVResult` with states `READY`, `WARNING`, or `REJECTED`.
   - Invariant: Face quality and pose checks are strictly observational; they never produce medical conclusions.
2. **Phase 11 (Ayurvedic Intelligence Foundation):**
   - Output: `AyurvedicInterpretationSet` with concept IDs, provenance types (`CLASSICAL_SOURCE`, `PROJECT_RESEARCH`), and rule versions.
   - Invariant: Observables are contextual signals; "redness = Pitta" and "dryness = Vata" direct collapse is strictly prohibited.
3. **Phase 12 (Multimodal Fusion & Uncertainty):**
   - Output: `FusionResult`, `FusionAuditTrace`, `EvidenceLineageSource`.
   - Invariant: Respects qualitative confidence ceilings (`LOW`, `MODERATE`), treats uncorroborated single-source signals conservatively, and strictly preserves `NOT_ASSESSED`, `UNCERTAIN`, and `CONFLICTING` states. Phase 13 must never inflate evidence strength.

---

## 5. Scope Boundary for Phase 13

### In Scope
- Knowledge corpus forensic audit (inventory, hashes, text vs image analysis, LFS verification).
- Dataset qualification (`Updated_Prakriti_With_Features.csv` isolated to Tier 5 computational evidence).
- Explicit 6-Tier Knowledge Source Authority Hierarchy.
- Knowledge Safety Policy & Quarantine Protocols.
- Ingestion pipeline with deterministic content hashing (`sourceId + version + contentHash + parserVersion`).
- Semantic chunking with citation coordinates (book, volume, chapter, section, verse/page).
- Vector store abstraction (in-memory cosine similarity engine + Supabase pgvector schema).
- Hybrid retrieval, metadata filtering, reranking, and evidence selection.
- Verifiable citation-binding engine (100% claim-to-evidence mapping; zero fabricated citations).
- Post-generation claim validation gate and safe fallback when evidence is absent or insufficient.
- XAI explanation engine structured over observations, user context, retrieved evidence, and uncertainty.
- Dual prompt-injection defenses (sanitizing user queries and isolating retrieved chunks as untrusted data).
- Comprehensive test matrix (RAG-001 to RAG-030+) and zero regressions on Phase 06–12 test suites.

### Out of Scope
- Re-architecting Phase 10 CV or Phase 12 Fusion.
- Training ML classifiers on the Prakriti CSV dataset.
- Direct face-to-Dosha diagnostic inference.
- Medical disease classification or clinical treatment prescribing.
- Unrestricted medical chatbot interactions.
