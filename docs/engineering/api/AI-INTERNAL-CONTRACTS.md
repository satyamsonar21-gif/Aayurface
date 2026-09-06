# Internal Contract: AI Orchestration Pipeline
## Subsystem Boundaries, Data Contracts & AI Execution Flow

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Internal AI Platform  
**Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`  
**Authority:** AI Platform Architect, Computer Vision Architect, Security Architect  

---

## 1. Internal AI Subsystem Topology

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INTERNAL AI SUBSYSTEM ORCHESTRATION                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   [ API Gateway / Job Dispatcher ]                                          │
│                  │                                                          │
│                  │ 1. Claims `analysis_jobs` row (FOR UPDATE SKIP LOCKED)   │
│                  ▼                                                          │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                 AI ORCHESTRATOR BACKGROUND WORKER                   │   │
│   └───────┬──────────────────┬──────────────────┬─────────────────┬─────┘   │
│           │                  │                  │                 │         │
│           │ 2. Signed GET    │ 3. Fetch Data    │ 4. Fetch Data   │         │
│           ▼                  ▼                  ▼                 │         │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐          │         │
│   │ CV Feature   │   │ Intake Quiz  │   │ Lifestyle    │          │         │
│   │ Extractor    │   │ Responses    │   │ Context      │          │         │
│   └───────┬──────┘   └───────┬──────┘   └───────┬──────┘          │         │
│           │                  │                  │                 │         │
│           └──────────────────┼──────────────────┘                 │         │
│                              ▼                                    │         │
│               ┌─────────────────────────────┐                     │         │
│               │   MULTIMODAL FUSION ENGINE  │                     │         │
│               │   Computes V, P, K & Aggr A │                     │         │
│               └──────────────┬──────────────┘                     │         │
│                              ▼                                    │         │
│               ┌─────────────────────────────┐                     │         │
│               │ CONFIDENCE & UNCERTAINTY    │                     │         │
│               │ Bounded Confidence C        │                     │         │
│               └──────────────┬──────────────┘                     │         │
│                              ▼                                    │         │
│               ┌─────────────────────────────┐                     │         │
│               │ CLASSICAL RAG RETRIEVAL     │                     │         │
│               │ pgvector Cosine Search      │                     │         │
│               └──────────────┬──────────────┘                     │         │
│                              ▼                                    │         │
│               ┌─────────────────────────────┐                     │         │
│               │ CONSTRAINED LLM REASONING   │                     │         │
│               │ OpenAI GPT-4o (JSON Mode)   │                     │         │
│               └──────────────┬──────────────┘                     │         │
│                              ▼                                    │         │
│               ┌─────────────────────────────┐                     │         │
│               │ AI SAFETY & ZOD VALIDATION  │                     │         │
│               │ Medical Regex Filter        │                     │         │
│               └──────────────┬──────────────┘                     │         │
│                              │                                    │         │
│                              │ 5. Atomic Persistence              │         │
│                              ▼                                    ▼         │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │           POSTGRESQL DATABASE TRANSACTION (3NF Persistence)         │   │
│   │ • `scan_results`, `visual_obs`, `fusions`, `recommendations`        │   │
│   │ • `UPDATE analysis_jobs SET status = 'COMPLETED'`                   │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Invariants & Security Rules

1. **Zero Browser Connectivity:** Client applications are completely decoupled from internal AI workers, OpenAI endpoints, and pgvector.
2. **Deterministic Data Contracts:** Every internal sub-engine exchanges strongly-typed TypeScript/JSON interfaces validated by Zod.
3. **No Unstructured LLM Data:** LLM outputs must be parsed, validated against Zod schemas, scanned for prohibited medical terms, and transformed into relational 3NF rows before reaching the client or database.
