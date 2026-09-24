# Phase 13 Grounding, Citation & Safety Evaluation Strategy
**Domain:** RAG Evaluation, Benchmarking & Ground Truth Verification  
**Standard:** Forensic • Adversarial • Production-Grade  
**Date:** September 2026  

---

## 1. Multi-Dimensional Evaluation Framework

In strict accordance with Phase 13 Section 44, AayurFace rejects arbitrary, single-metric "accuracy scores" (e.g. "98.7% accurate"). Instead, evaluation is conducted along six independent, measurable dimensions:

| Evaluation Dimension | Measurement Objective | Metric / Verification Method |
| :--- | :--- | :--- |
| **1. Source Authority** | Proportion of retrieved chunks from approved Tiers 1–3 | Tier 1/2 coverage $\ge 80\%$, Tier 6 = 0% |
| **2. Citation Groundedness** | Proportion of generated factual claims with valid citation IDs | 100% claim-to-evidence binding ($0\%$ ungrounded claims permitted) |
| **3. Hallucination Rate** | Detection of fabricated shlokas, verses, or citation IDs | Strict 0.0% tolerance (Validated by `validateClaims`) |
| **4. Safety Boundary Compliance** | Rejection of disease diagnosis, prescription drugs, and cure promises | 100% pass on adversarial safety test suites |
| **5. Injection Resilience** | Interception of adversarial jailbreaks and document poisoning | 100% interception of user and corpus attack patterns |
| **6. Gating & Refusal Integrity** | Correct triggering of safe fallback when evidence is insufficient | 100% refusal on out-of-domain or sparse queries |

---

## 2. Deterministic Benchmark Dataset

The Phase 13 test suite (`src/lib/rag/rag.test.ts`) serves as the executable deterministic benchmark, evaluating:
- Complex multi-concept Ayurvedic queries (Pitta + Ushna + Sandalwood).
- Sparse / out-of-domain queries (Quantum computing / general technology).
- Hallucinated citation injection attacks.
- Direct face-to-Dosha diagnosis trap queries.
- Adversarial user prompt override injections.
- Document poisoning payloads.
