# Phase 13 Knowledge Safety Policy & Source Authority Model
**Domain:** AI Governance, Source Hierarchy, Ingestion Safety & Anti-Poisoning  
**Standard:** Forensic • Adversarial • Production-Grade  
**Version:** `aayur-safety-v1.0.0`  
**Date:** September 2026  

---

## 1. Executive Purpose

This document establishes the definitive safety and authority framework governing all retrieval-augmented generation (RAG), evidence citation, explainable AI (XAI), and knowledge ingestion within AayurFace.

---

## 2. Six-Tier Knowledge Source Authority Hierarchy

Knowledge within AayurFace is strictly stratified into six explicit tiers. Authority controls citation labeling, retrieval preference, conflict presentation, and generation constraints:

```text
┌────────────────────────────────────────────────────────────────────────┐
│               AAYURFACE SOURCE AUTHORITY HIERARCHY                     │
├────────────────────────────────────────────────────────────────────────┤
│ TIER 1: Classical Primary Shastra (Brihat-Trayi Sanskrit Texts)        │
│         Charaka Samhita, Sushruta Samhita, Ashtanga Hridaya            │
│                                                                        │
│ TIER 2: Scholarly Translations & Recognized Lexicons                   │
│         Bhishagratna, Murthy, Bhavaprakasha Nighantu, Marathi editions │
│                                                                        │
│ TIER 3: Peer-Reviewed Scientific & Pharmacological Literature          │
│         Indexed phytochemistry, dermatological safety studies          │
│                                                                        │
│ TIER 4: AayurFace Project Research & Ingredient Knowledge              │
│         Vetted cosmetic topical safety, preparation guidelines         │
│                                                                        │
│ TIER 5: Computational Datasets & Tabular Benchmarks                    │
│         Questionnaire datasets (Strictly non-authoritative)            │
│                                                                        │
│ TIER 6: Unverified, External, or Quarantined Sources                   │
│         Web scrapes, user uploads, unvetted references (BLOCKED)       │
└────────────────────────────────────────────────────────────────────────┘
```

### Hierarchy Rules:
1. **Retrieval Preference:** Production user-facing RAG prioritizes Tier 1 and Tier 2 classical evidence, corroborated by Tier 3/4 topical safety knowledge.
2. **Citation Transparency:** Every user-facing citation MUST explicitly state its authority tier and source verification status.
3. **Structured Disagreement:** When two sources disagree (e.g., Charaka vs Sushruta on skin layer naming or Dravya Virya), the system **MUST NEVER** silently choose one. It must present a structured source divergence note.
4. **Dataset Prohibition:** Tier 5 computational data is strictly prohibited from being cited as classical doctrinal truth.
5. **Tier 6 Isolation:** Tier 6 sources are barred from user-facing retrieval.

---

## 3. Knowledge Poisoning & Anti-Contamination Protocol

To prevent malicious document poisoning or accidental instruction contamination during document ingestion, all incoming texts pass through an Ingestion Quarantine Gate:

### 3.1 Prohibited Text Patterns in Ingested Sources:
Documents containing the following strings or adversarial instruction semantics are automatically flagged and quarantined:
- `"IGNORE ALL PREVIOUS INSTRUCTIONS"`
- `"SYSTEM INSTRUCTION OVERRIDE"`
- `"YOU ARE NOW A MEDICAL DOCTOR"`
- `"CLINICALLY PROVEN TO CURE"`
- `"DISREGARD SAFETY DISCLAIMER"`
- Hidden XML/HTML tags mimicking system boundaries (e.g., `<system_prompt>`, `<assistant>`, `[INST]`).

### 3.2 Ingestion Status Lifecycle:
- `PENDING_REVIEW`: Ingested, parsed, and hashed; awaiting security and citation audit.
- `ACTIVE`: Fully verified, passed anti-poisoning scans, eligible for production retrieval.
- `QUARANTINED`: Suspicious instructions, unverified translations, or corrupted metadata detected. Barred from retrieval.
- `REJECTED`: Fails licensing, safety, or cryptographic integrity requirements. Purged from index.

---

## 4. Non-Diagnostic Wellness Boundary & Negative Prohibitions

AayurFace is strictly a non-diagnostic, educational wellness platform. The following operations are strictly blocked by executable validators:

| Prohibited Operation | Rationale | Enforcement Gate |
| :--- | :--- | :--- |
| **Face $\to$ Dosha Diagnosis** | Visual redness, dryness, or shine are contextual observation signals only. Collapsing face image to a Dosha is invalid. | Phase 11 Rule Engine, Phase 12 Fusion, Phase 13 Output Safety Filter |
| **Face $\to$ Prakriti Diagnosis** | Prakriti is determined by birth constitution and lifelong systemic traits, never by transient facial features. | Phase 11 Contract, Phase 12 Invariants, Phase 13 Output Safety Filter |
| **Clinical Disease Diagnosis** | Acne vulgaris, rosacea, eczema, psoriasis, dermatitis, and fungal infections require licensed medical evaluation. | AI Safety Regex & Semantic Prohibited Vocabulary Gate |
| **Prescription Medications** | Tretinoin, isotretinoin, steroids, antibiotics, spironolactone are medical drugs. | AI Safety Prohibited Vocabulary Gate |
| **Guaranteed Cure Claims** | "Cures acne in 7 days", "permanently eradicates redness", "clinically guaranteed". | Claim Validation Gate & Safety Filter |
| **Fabricated Citations** | Hallucinated shlokas, non-existent book chapters, fake URLs, or fabricated verse numbers. | Citation Binding Engine & Hash Verification Gate |
