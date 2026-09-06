# Architecture Decision Record: ADR-007
## AI Model Abstraction: Model-Agnostic Interfaces & Pinned Versioning

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Deciders:** AI/ML Architect, Principal Software Architect  
**Technical Area:** AI Integration & Vendor Decoupling  

---

### 1. Context
AayurFace leverages commercial Large Language Models (specifically OpenAI GPT-4o) for grounded synthesis and explainable wellness reasoning. Direct hardcoded vendor calls create technical debt and vendor lock-in.

### 2. Problem
Preventing third-party LLM provider lock-in, insulating core application logic from upstream model deprecations, and establishing reproducible, auditable AI completions.

### 3. Options Evaluated
* **Option A: Direct Vendor SDK Integration:** Import `@openai/sdk` directly into UI and Edge Functions; invoke model names directly.
* **Option B: Model-Agnostic Interface with Version Pinning (Selected):** Abstract domain logic behind `IAiReasoningEngine` and `ICVFeatureExtractor` interfaces; pin specific snapshot model identifiers in configuration.
* **Option C: Custom Self-Hosted Open-Source LLM (Llama 3 on dedicated GPU):** Host an open-source model directly.

### 4. Decision
Adopt **Option B: Model-Agnostic Interface with Version Pinning**.
Business logic interacts exclusively with abstract TypeScript interfaces. The concrete OpenAI adapter invokes pinned model snapshots (e.g., `gpt-4o-2024-08-06`) rather than rolling alias tags (`gpt-4o`). Every generated analysis records the exact model ID, prompt version, and execution timestamp in its metadata.

### 5. Rationale
* **Zero Disruption Provider Swapping:** If Anthropic Claude 3.5 Sonnet or a regional open-source model demonstrates superior performance or lower cost, only the adapter layer requires updating.
* **Auditability & Traceability:** Pinned versions prevent silent output drift caused by upstream provider model updates.

### 6. Consequences
* *Positive:* Clean architecture, zero vendor lock-in, complete reproducibility of historical analyses.
* *Negative:* Requires maintaining adapter wrappers and explicit configuration records.

### 7. Risks & Mitigations
* *Risk:* Upstream provider deprecates a pinned model version.
* *Mitigation:* Automated weekly evaluation test suites detect deprecation notices 90 days before provider sunset.

### 8. Evidence
Prior prototype experience showed silent quality shifts when using unpinned foundation models.

### 9. Revisit Conditions
Revisit when an open-weights multilingual Indian language model (such as Sarvam AI or Bhashini) achieves parity with GPT-4o for classical Ayurvedic reasoning.
