# AayurFace — Engineering Requirements Specification
## Document 15: Phased Release Boundaries (MVP vs. V1 vs. V2 vs. Research)

**Phase:** Phase 01 — Requirements Engineering, Formalization & Complete Traceability  
**Date:** 2026-09-03  
**Status:** FORMAL ENGINEERING CONTRACT  
**Authority:** Product Manager, Principal Product Engineer, Solution Architect  

---

### 1. Phased Scope Overview

To prevent scope creep and ensure scientific rigor, AayurFace enforces four disciplined release boundaries:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        MVP: CORE EVIDENCE ENGINE                       │
│  • Production Build & Type Stabilization                               │
│  • Genuine Supabase Auth (Email + Google OAuth)                        │
│  • Granular Informed Consent & Privacy Engine                          │
│  • English + Hindi Bilingual Support (i18next)                         │
│  • 15-Question Constitutional Questionnaire (V/P/K Vector)             │
│  • Structured Lifestyle Context Intake Form                            │
│  • Client-Side MediaPipe Capture Quality Gateway                       │
│  • Private Supabase Storage Bucket + Signed Upload URLs                │
│  • Server-Side Biometric Feature Extraction                            │
│  • Weighted Multimodal Fusion Engine                                   │
│  • Confidence & Conflict Detection (High / Moderate / Low)             │
│  • 5-Part Explainable AI (XAI) Insight Presentation                    │
│  • Core pgvector RAG Knowledge Grounding & Citation                    │
│  • Personalized Recommendations with Mandatory Patch-Test Warning     │
│  • Morning / Evening / Weekly Personalized Routine View                │
│  • Immutable Analysis History Snapshots in Database                    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    V1: ACCESSIBILITY & UTILITY EXPANSION               │
│  • Regional Languages: Marathi (`mr`), Tamil (`ta`)                    │
│  • Daily Routine Adherence Tracking & Checkboxes                       │
│  • Authenticated PDF Wellness Report Generation & Download             │
│  • Admin Portal: Knowledge Base Ingestion & Health Monitoring          │
│  • Enhanced Camera Guidance & Multi-Browser Optimizations              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    V2: LONGITUDINAL INTELLIGENCE & VOICE               │
│  • 30 / 60 / 90-Day Longitudinal Progress Dashboard (Recharts)         │
│  • Delta Signal Trend Analysis vs. Previous Captures                   │
│  • Web Speech API Multilingual Voice Assistant in Chat                 │
│  • Routine Adherence Notification Reminders                            │
│  • Extended Regional Languages: Telugu (`te`), Bengali (`bn`)          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    RESEARCH / R&D: CLINICAL CONSENSUS                  │
│  • Expert Annotator Portal: Triple-Practitioner Assessment Flow        │
│  • Consensus Adjudication Queue for Gold-Standard Reference Labels    │
│  • Population-Scale Fitzpatrick III–VI Demographic Bias Audits         │
│  • Integration with Microsoft Research Dermatology Foundation Models   │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Detailed Inclusions & Exclusions

| Domain / Feature | MVP (P0) | V1 (P1) | V2 (P2) | Research / R&D | Rationale for Phasing |
|---|---|---|---|---|---|
| **Authentication** | Supabase Auth (Email + Google) | Email Change Flow | MFA / Biometric Passkey | Clinical SSO | MVP requires genuine authentication to eliminate the Phase 00 security hole. |
| **Localization** | English + Hindi | Marathi + Tamil | Telugu + Bengali | Dialect Models | English and Hindi cover the primary Indian target audience initially. |
| **Capture Gateway** | MediaPipe Quality Gateway | Frame Optimization | Low-End Device Fallback | Multi-Spectral Sensor | Client-side quality gating is an essential differentiator for MVP data integrity. |
| **Multimodal Fusion**| Weighted Tri-Modality Fusion | Calibrated Weights | Adaptive Personalized Weights | Bayesian Latent Class | Multimodal fusion is the primary scientific moat; must be in MVP. |
| **Explainable AI** | 5-Part Structured XAI | Signal Detail Expansion | Deep Causal Graphs | Clinical Audit Trail | Transparency is a core PRD requirement; must not be deferred. |
| **Routine Tracking**| Static Routine Display | Daily Completion Logging | Adherence Analytics | Clinical Adherence | Displaying routines is MVP; persistent adherence tracking belongs in V1. |
| **Progress Charts** | Recent Scan Comparison | Basic Progress Timeline | Recharts 30/60/90 Days | Longitudinal Cohorts | Trends require returning users with $\ge 2$ historical analyses. |
| **PDF Generation** | Deferred | Authenticated Client PDF | Server-Side PDF | Clinical Dossier Export | PDF export is high-value for sharing but not a blocker for the core analysis loop. |
| **Voice Assistant** | Deferred | Speech-to-Text Preview | Full Web Speech API Dialog | Conversational Diagnostic | Voice adds complexity with browser permissions; prioritized for V2. |
| **Research Tools** | Deferred | Basic Dataset Export | De-identified Cohorts | Triple-Practitioner Portal | Research consensus workflows require an established user base and clinical partners. |
