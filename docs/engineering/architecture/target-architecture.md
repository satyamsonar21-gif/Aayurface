# AayurFace — Target System Architecture
## Comprehensive Architectural Blueprint & Core Principles

**Phase:** Phase 02 — Target System Architecture, ADRs & Implementation Blueprint  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION  
**Authority:** Principal Software Architect, Staff Backend Architect, Staff Frontend Architect, AI/ML Architect, Security Architect  

---

### 1. Executive Architectural Summary

AayurFace is designed as a **Modular Monolithic Web Application** coupled with a **Serverless Asynchronous Intelligence Pipeline**. It bridges ancient Ayurvedic physiological typologies (Tridosha: Vata, Pitta, Kapha) with modern computer vision, multi-signal feature extraction, calibrated statistical fusion, and retrieval-augmented generative reasoning.

The target architecture replaces the unauthenticated client-side prototype identified in Phase 00 with a hardened, privacy-first, scientifically grounded system:
1. **Client Tier:** A highly responsive React/Vite single-page application executing an ephemeral client-side capture quality gateway (MediaPipe Face Mesh in WebAssembly) to guarantee capture standardization before any image leaves the browser.
2. **Backend & Identity Tier:** Supabase Managed Services (PostgreSQL 15+, Supabase Auth with bcrypt, Row-Level Security on 100% of tables) coupled with event-driven Supabase Edge Functions (Deno runtime) for orchestration, rate-limiting, and validation.
3. **Intelligence & Processing Tier:** A decoupled 2-tier computer vision pipeline separating image quality validation from deterministic feature extraction, feeding a configurable multimodal fusion engine, `pgvector` semantic retrieval over classical literature, and constrained generative reasoning with strict non-diagnostic boundary enforcement.
4. **Storage & Privacy Tier:** Zero-public-access S3-compatible private object storage with short-lived cryptographic signed URLs (TTL $\le 15$ minutes) and support for immediate-purge biometric data minimization.

---

### 2. Core Architectural Principles

The AayurFace target architecture strictly adheres to 20 foundational engineering principles:

1. **Security by Design:** Security controls (authentication, authorization, encryption, input sanitization) are architectural primitives, never post-hoc additions.
2. **Privacy by Design & Biometric Minimization:** Facial images are sensitive biometric data; the architecture is designed to support applicable data-protection obligations (including DPDP Act 2023 principles and GDPR Art. 9; formal legal/compliance review required). Continuous video streams are processed ephemerally in volatile RAM; only single quality-approved frames are uploaded; longitudinal tracking operates on derived numerical vectors (`VisualObservations`), making raw image retention optional.
3. **Principle of Least Privilege:** Clients, edge workers, and database roles possess the minimum permissions required to perform their discrete functions.
4. **Strict User-Data Ownership:** Users strictly own their biometric captures, health inputs, and analysis records. The backend derives authorization exclusively from cryptographically verified session context (`auth.uid()`). Client-supplied user identifiers are never trusted.
5. **Server-Side Secret Isolation:** Third-party API credentials (including `OPENAI_API_KEY`) reside exclusively in encrypted server-side secret stores and are never bundled, transmitted, or accessible to client environments.
6. **AI Output Treated as Untrusted:** Generative model outputs are treated as untrusted user input. All responses must undergo schema validation, safety filtering, and deterministic non-diagnostic boundary checks before rendering.
7. **Explainability by Default (XAI):** Every insight must provide a structured 5-part explanation citing observed features, context variables, agreement metrics, classical meaning, and explicit medical disclaimers.
8. **Confidence-Aware Inference:** The system must never manufacture false certainty. Input discrepancies automatically lower confidence, assign `LOW_AGREEMENT`, and display prominent uncertainty advisories.
9. **Model Abstraction & Vendor Independence:** Application business logic interacts with AI and CV models through stable provider-agnostic interfaces. Upstream model changes or vendor migrations must not necessitate application redesign.
10. **Versioned AI & Pipeline Artifacts:** Every analysis snapshot immutable pins the exact version metadata of the CV model, feature extractor, fusion weights, prompt template, knowledge corpus, and schema that generated it.
11. **Modular Architecture & High Cohesion:** Components are grouped into 26 distinct bounded contexts with explicit interfaces. Cross-module data access occurs via defined service contracts, preventing architectural tangling.
12. **Testability at Every Boundary:** Architectural layers are decoupled via dependency injection and contract interfaces, enabling automated unit testing, mock service execution, and deterministic integration tests.
13. **Comprehensive Observability without Biometric Leaks:** Structured logs, correlation IDs (`x-correlation-id`), latency metrics, and failure telemetry are captured universally, while biometric image data, passwords, and sensitive PII are automatically redacted.
14. **Reliability & Graceful Degradation:** External dependency failures (AI timeouts, vector search misses, camera denials) degrade gracefully to safe, informative fallbacks rather than unhandled application crashes or blank screens.
15. **Accessibility as a First-Class Citizen:** All user interfaces strictly conform to WCAG 2.1 Level AA standards, ensuring complete keyboard operability, minimum 4.5:1 text contrast, and full screen-reader live region support.
16. **Pluggable Internationalization:** UI labels, questionnaires, and synthetic outputs utilize a decoupled localization runtime (i18next) supporting English (`en`), Hindi (`hi`), and regional Indian languages without UI logic modification.
17. **Maintainability & Strict Type Safety:** The entire codebase enforces strict TypeScript compilation (`tsc -b --noEmit`) with zero `any` evasions, accompanied by automated linting and formatting.
18. **Controlled Scalability:** Scalability is achieved through stateless serverless compute, database indexing, and asynchronous job queuing rather than premature microservice sprawl.
19. **Evidence-Driven Engineering:** Architectural decisions derive from empirical benchmarks, repository evidence, and validated research, never from speculative assumptions.
20. **No Premature Microservices:** AayurFace avoids distributed service operational complexity during early stages. It deploys as a clean modular monolith that can selectively decompose into specialized microservices only when justified by scale.

---

### 3. Architecture Style Evaluation

We evaluated five architectural styles against AayurFace's functional and operational profile:

| Architectural Style | Development Velocity | Operational Complexity | AI / CV Processing Fit | Security & Isolation | Cost Profile | Evolutionary Path | Evaluation |
|---|---|---|---|---|---|---|---|
| **A. Monolithic Architecture** | High initial | Low | Poor (Heavy CV in monolith bloats deployment) | Moderate | Low | Difficult to scale AI independently | Rejected (Tightly couples web UI to heavy AI dependencies) |
| **B. Modular Monolith + Serverless Intelligence (Selected)** | **Very High** | **Low to Moderate** | **Excellent** (Stateless edge workers handle compute-heavy AI) | **High** (RLS + Edge Function isolation) | **Optimal** (Pay-per-execution serverless) | **Seamless** (Modules can be extracted if needed) | **ACCEPTED (ADR-001)** |
| **C. Microservices Architecture** | Low (High coordination overhead) | Very High (Distributed tracing, K8s, service mesh) | Good | High | High (Baseline infrastructure costs) | Native | Rejected (Premature optimization for current team scale) |
| **D. Serverless-Heavy (Pure FaaS)** | Moderate | High (Cold starts, state coordination) | Moderate (Memory limits on large models) | High | Low initially, unpredictable at scale | Moderate | Rejected (Cold starts harm real-time camera feedback) |
| **E. Hybrid Cloud / On-Premise** | Low | Very High | Excellent | Maximum | Very High | Complex | Rejected (Unnecessary infrastructure overhead for wellness web app) |

#### Architectural Style Selection: Modular Monolith + Serverless Intelligence Pipeline
AayurFace adopts **Style B**:
* The **Frontend** is organized as a modular client-side monolith with feature-based directory isolation, shared design primitives, and a unified state architecture.
* The **Backend** utilizes Supabase Managed PostgreSQL as the central relational and vector store, with business logic and AI orchestration encapsulated in **Supabase Edge Functions** (stateless Deno workers).
* The **Computer Vision** computation is bifurcated: lightweight real-time landmarking and quality gating run in the client's browser (WebAssembly), while intensive numerical feature extraction and AI synthesis run asynchronously on edge workers.

---

### 4. High-Level Architectural Topology

```text
┌───────────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT TIER (Browser)                              │
│                                                                                   │
│   React 19 / Vite SPA  ──►  i18next Localization  ──►  Tailwind Heritage Design   │
│            │                                                                      │
│            ▼                                                                      │
│   Client-Side MediaPipe Face Mesh Gateway (WebAssembly / Volatile RAM Only)       │
│   [Single Face, Centering, Distance, Lighting, Sharpness Checks]                  │
└──────────────────────────┬────────────────────────────┬───────────────────────────┘
                           │ HTTPS / WSS (JWT Bearer)   │ Direct Encrypted Upload
                           ▼                            ▼
┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐
│       SERVERLESS COMPUTE TIER        │     │         PRIVATE STORAGE TIER         │
│      (Supabase Edge Functions)       │     │          (Supabase Storage)          │
│                                      │     │                                      │
│   • analyze-multimodal Orchestrator  │     │   Bucket: `facial-captures`          │
│   • submit-questionnaire Service     │     │   • Strict Private Access (No Public)│
│   • submit-lifestyle Service         │     │   • Signed Upload/Download URLs      │
│   • ayurveda-chat Assistant          │     │   • TTL: 15 Minutes                  │
│   • generate-pdf-report Worker       │     │   • Auto-Purge / Retention Lifecycle │
└──────────────────┬───────────────────┘     └──────────────────┬───────────────────┘
                   │                                            │
                   ▼                                            │
┌────────────────────────────────────────────────────────┐      │
│                 DATABASE & PERSISTENCE TIER            │      │
│               (Supabase Managed PostgreSQL 15+)        │◄─────┘
│                                                        │
│   • Relational Domain Tables (profiles, consents, ...) │
│   • Row-Level Security (RLS) Enforced on 100% Tables   │
│   • pgvector Extension (1536-dim text-embedding-3)     │
│   • Supabase Realtime Engine (Change Data Capture)     │
└──────────────────┬─────────────────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────────────────┐
│               EXTERNAL AI & INTELLIGENCE TIER          │
│                                                        │
│   • OpenAI API (Pinned Model: gpt-4o-2024-08-06)       │
│   • OpenAI Embeddings (text-embedding-3-small)         │
│   • Classical Ayurvedic Corpus Knowledge Base          │
└────────────────────────────────────────────────────────┘
```
