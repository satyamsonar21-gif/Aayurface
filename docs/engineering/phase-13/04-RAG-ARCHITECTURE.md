# Phase 13 RAG, Provenance & Explainable AI Architecture
**Domain:** Retrieval-Augmented Generation, Citation Binding, XAI & AI Safety  
**Standard:** Forensic • Adversarial • Production-Grade  
**Version:** `aayur-rag-arch-v1.0.0`  
**Date:** September 2026  

---

## 1. System Architecture Overview

The Phase 13 Knowledge & Explainability Layer forms the grounded reasoning engine of AayurFace. It connects standardized visual observations (Phase 10), Ayurvedic contextual intelligence (Phase 11), and multimodal fusion confidence (Phase 12) to authoritative Ayurvedic Shastras (Brihat-Trayi) and verified botanical research.

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              PHASE 13 RAG PIPELINE                                     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   USER QUERY / ANALYSIS EXPLANATION REQUEST                                            │
│        │                                                                               │
│        ▼                                                                               │
│   [1. QUERY NORMALIZER & INTENT CLASSIFIER]                                            │
│        │                                                                               │
│        ▼                                                                               │
│   [2. PROMPT INJECTION SANITIZER] (User-side attack mitigation)                       │
│        │                                                                               │
│        ▼                                                                               │
│   [3. HYBRID RETRIEVAL & METADATA FILTER] (Tiers 1-4, Active only, Cosine >= 0.70)     │
│        │                                                                               │
│        ▼                                                                               │
│   [4. RERANKER & EVIDENCE SELECTOR] (Diversity control & Gating: >= 2 chunks)          │
│        │                                                                               │
│   ┌────┴──────────────────────────┐                                                    │
│   │ Gating Passed                 │ Gating Failed (< 2 chunks)                         │
│   ▼                               ▼                                                    │
│ [5. CONTEXT ASSEMBLY]       [5B. DETERMINISTIC SAFE FALLBACK]                          │
│   (Data tags isolation)       ("Insufficient verified evidence...")                    │
│        │                                                                               │
│        ▼                                                                               │
│ [6. GROUNDED LLM GENERATION] (Strict JSON schema, claim-to-chunk binding)              │
│        │                                                                               │
│        ▼                                                                               │
│ [7. POST-GENERATION CLAIM VALIDATOR]                                                   │
│   • Citation Verification (Every cited chunkId exists in retrieved set)                │
│   • Hallucination Rejection (Zero phantom shlokas or ungrounded claims)               │
│        │                                                                               │
│        ▼                                                                               │
│ [8. OUTPUT SAFETY FILTER]                                                              │
│   • Prohibited Medical Vocabulary Gate (Blocks disease names / drugs)                  │
│   • Non-Diagnostic Boundary Gate (Blocks face -> Dosha/Prakriti diagnosis)             │
│   • Guaranteed Cure Gate (Blocks absolute cure promises)                              │
│        │                                                                               │
│        ▼                                                                               │
│ [9. XAI RESPONSE & AUDIT TRACE]                                                        │
│   (Transparent reasoning, evidence lineage, negative medical boundaries)               │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Architectural Components

### 2.1 Content Hashing & Idempotent Ingestion (`contentHasher.ts`)
Ingestion identity is mathematically deterministic:
$$\text{IngestionKey} = \text{SHA256}(\text{sourceId} + \text{sourceVersion} + \text{contentHash} + \text{parserVersion})$$
Re-running ingestion against identical source files yields zero duplicate documents or chunks.

### 2.2 Vector Storage & Retrieval Interface (`vectorStore.ts`)
The vector store supports dual operational modes:
1. **Client / Edge In-Memory Vector Engine:** Uses normalized dot-product (cosine similarity) with metadata filtering for ultra-fast, local, deterministic evaluation and testing.
2. **Server / PostgreSQL pgvector:** Backed by `knowledge_chunks` and `knowledge_embeddings` tables with HNSW index for production scale.

### 2.3 Citation-Binding Engine (`citationEngine.ts`)
Every factual Ayurvedic claim generated must bind to one or more `evidenceId`s. The citation engine:
- Verifies that cited IDs belong to the current retrieval session.
- Constructs formatted bibliographical references with work, sthana, chapter, verse, and authority tier.
- Automatically marks ungrounded statements as `UNSUPPORTED` and purges them from the client payload.

### 2.4 Claim Validation Gate (`claimValidator.ts`)
Acts as a post-generation verification barrier. It assesses the semantic relationship between generated claims and retrieved chunks, classifying each claim as `SUPPORTED`, `PARTIALLY_SUPPORTED`, `CONFLICTING`, or `UNSUPPORTED`. If unsupported claims exceed zero tolerance on critical points, the entire response is rejected in favor of deterministic fallback.

### 2.5 Explainable AI (XAI) Engine (`xaiEngine.ts`)
Conforms to the 7 explainability questions of `EXPLAINABILITY-CONTRACT.md`:
1. What physical signals were observed (from Phase 10)?
2. What user context was provided (skin type, lifestyle)?
3. What multimodal fusion conclusions were derived (from Phase 12)?
4. What classical Shastras support the explanation?
5. Where does evidence agree or conflict?
6. What scientific limitations exist (lighting, self-report subjectivity)?
7. What does the result NOT mean (explicit negative medical boundaries)?
No hidden chain-of-thought is ever exposed or fabricated.

### 2.6 Dual Prompt Injection Defense (`promptDefense.ts`)
1. **User Input Defense:** Strips prompt escape strings, rejects adversarial commands (`"ignore instructions"`, `"act as a doctor"`), and enforces intent boundaries.
2. **Document-Embedded Instruction Neutralization:** Wraps all retrieved text chunks in strict XML boundaries:
   ```xml
   <classical_evidence chunk_id="chunk-101" authority="TIER_1">
   [Untrusted retrieved classical content]
   </classical_evidence>
   ```
   System instructions explicitly mandate that `<classical_evidence>` blocks are passive data and must never be interpreted as instructions.
