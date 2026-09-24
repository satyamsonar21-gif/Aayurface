# Phase 13: Explainable AI (XAI) + RAG + Knowledge Safety & Provenance
**Standard:** Forensic • Evidence-First • Production-Grade  
**Date:** September 2026  
**Status:** IMPLEMENTED & VERIFIED (201 / 201 Tests Passing, Build Clean, Lint Clean)  

---

## 1. Overview

Phase 13 establishes the production-grade Ayurvedic knowledge retrieval, citation binding, prompt injection defense, and explainable AI (XAI) foundation for AayurFace.

It connects standardized visual observations (Phase 10), Ayurvedic contextual intelligence (Phase 11), and multimodal fusion confidence ceilings (Phase 12) to authoritative Brihat-Trayi Shastras (*Ashtanga Hridaya*, *Charaka Samhita*, *Sushruta Samhita*), classical Nighantus (*Bhavaprakasha*), and vetted topical research.

---

## 2. Directory Index

- [01-FORENSIC-BASELINE.md](./01-FORENSIC-BASELINE.md) — Starting repository state, environment specifications, and upstream phase preservation.
- [02-KNOWLEDGE-CORPUS-AUDIT.md](./02-KNOWLEDGE-CORPUS-AUDIT.md) — Cryptographic and structural audit of all 5 PDF books in `data/books/` (establishing scanned bitmap status and OCR requirements).
- [02-DATASET-QUALIFICATION.md](./02-DATASET-QUALIFICATION.md) — Statistical and safety qualification of `Updated_Prakriti_With_Features.csv` (Tier 5 computational evidence; isolated from classical literature RAG).
- [03-KNOWLEDGE-SAFETY-POLICY.md](./03-KNOWLEDGE-SAFETY-POLICY.md) — Six-Tier Knowledge Source Authority Hierarchy, quarantine protocols, and non-diagnostic boundaries.
- [04-RAG-ARCHITECTURE.md](./04-RAG-ARCHITECTURE.md) — High-level architecture of the hybrid retrieval, gating, and XAI pipeline.
- [05-INGESTION-PIPELINE.md](./05-INGESTION-PIPELINE.md) — Ingestion mechanics, content hashing, and idempotency key derivations.
- [06-RETRIEVAL-ARCHITECTURE.md](./06-RETRIEVAL-ARCHITECTURE.md) — Intent classification, vector cosine projection, and threshold calibration.
- [07-CITATION-AND-PROVENANCE.md](./07-CITATION-AND-PROVENANCE.md) — Verifiable claim-to-evidence binding and rejection of phantom citations.
- [08-XAI-ARCHITECTURE.md](./08-XAI-ARCHITECTURE.md) — Explanation payload answering the 7 core explainability questions without chain-of-thought leakage.
- [09-PROMPT-INJECTION-DEFENSE.md](./09-PROMPT-INJECTION-DEFENSE.md) — Dual defense: user input sanitization and passive XML evidence isolation.
- [10-EVALUATION-STRATEGY.md](./10-EVALUATION-STRATEGY.md) — Grounding, citation, and safety evaluation methodologies.
- [11-THREAT-MODEL.md](./11-THREAT-MODEL.md) — STRIDE security and threat matrix for AI knowledge systems.
- [12-TEST-MATRIX.md](./12-TEST-MATRIX.md) — Traceability matrix for RAG-001 through RAG-030+.
- [ADR-013-TO-022.md](./ADR-013-TO-022.md) — Formal Architectural Decision Records (ADR-013 through ADR-022).
- [13-PHASE-13-FINAL-REPORT.md](./13-PHASE-13-FINAL-REPORT.md) — Definitive engineering closure report and gate verdict.
