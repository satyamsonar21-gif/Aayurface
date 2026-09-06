# AayurFace — Architecture Specification
## Component Architecture (C4 Level 3) — Frontend & Backend Layers

**Phase:** Phase 02 — Target System Architecture, ADRs & Implementation Blueprint  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION  
**Authority:** Staff Frontend Architect, Staff Backend Architect  

---

### 1. Frontend Component Architecture

The frontend application follows a strict layered architecture to prevent business logic from leaking into UI presentation components.

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION LAYER (Views / Pages)                    │
│   LandingPage  │  AuthPages  │  OnboardingWizard  │  CaptureView  │  ResultsView│
│   DashboardView│  HistoryView│  ProgressView      │  SettingsView │  AdminView  │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           FEATURE MODULES (Bounded Contexts)                    │
│   auth/       │ onboarding/ │ capture/    │ analysis/   │ routines/             │
│   history/    │ progress/   │ voice/      │ settings/   │ admin/                │
│   (Each feature contains: components/, hooks/, types/, api/, utils/)            │
└──────────────────┬─────────────────────────────────────┬────────────────────────┘
                   │                                     │
                   ▼                                     ▼
┌──────────────────────────────────────┐ ┌────────────────────────────────────────┐
│     DOMAIN & SERVER STATE LAYER      │ │         SHARED UI & DESIGN SYSTEM      │
│   • AuthContext / Session Store      │ │   • Button, Input, Card, Modal, Badge  │
│   • TanStack React Query (Cache)     │ │   • Ayurvedic Design Tokens (Tailwind) │
│   • CaptureGateway State Machine     │ │   • Lucide Icons, Framer Motion anims  │
│   • i18next Localization Store       │ │   • Screen Reader Live Regions (ARIA)  │
└──────────────────┬───────────────────┘ └────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                             API & CLIENT INFRASTRUCTURE                         │
│   • apiClient (Typed Fetch Wrapper with Authorization Bearer header injection)   │
│   • supabaseClient (Managed Auth and Realtime Subscription Client)              │
│   • mediaPipeClient (WebAssembly Face Mesh Runner & Frame Evaluator)            │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### Frontend Layers & Responsibilities:
1. **Presentation Layer (`src/pages/*`):** Page-level container components that assemble feature modules, handle route parameters, and configure layout shells.
2. **Feature Modules (`src/features/*`):** Self-contained domain slices. Each slice encapsulates its private components, custom React hooks, validation schemas, and API client calls.
3. **Domain & Server State Layer (`src/stores/*`, TanStack React Query):** Manages server-side cache invalidation, active user authentication state, real-time pipeline status listeners, and client-side finite state machines.
4. **Shared UI & Design System (`src/components/ui/*`, `src/index.css`):** Reusable, accessible UI primitives styled with Tailwind CSS Ayurvedic heritage tokens (Deep Terracotta, Sage, Jade, Warm Cream).
5. **API & Client Infrastructure (`src/lib/*`):** Centralized HTTP transport, Supabase client initialization, MediaPipe WebAssembly loader, and correlation ID generators.

---

### 2. Backend Component Architecture (Supabase Edge Tier)

Supabase Edge Functions operate on the Deno runtime and adhere to an enterprise layered service pattern:

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           TRANSPORT & ROUTING LAYER                             │
│   Deno.serve HTTP Handler  ──►  CORS Middleware  ──►  Rate-Limiting Middleware  │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION & AUTHORIZATION MIDDLEWARE                  │
│   • Extracts Bearer JWT from Authorization header                                │
│   • Invokes supabase.auth.getUser() to verify signature & retrieve claims       │
│   • Injects verified `auth.uid()` and `user_role` into RequestContext           │
│   • Rejects unauthenticated callers with HTTP 401; unauthorized with HTTP 403   │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          INPUT VALIDATION & DESERIALIZATION                     │
│   • Zod Schema Validation (strips unknown fields, enforces types)               │
│   • Quarantines free-text inputs against prompt injection                       │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                             DOMAIN SERVICES LAYER                               │
│                                                                                 │
│   ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐    │
│   │ ImageProcessingSvc  │  │   FusionEngineSvc   │  │  KnowledgeRagSvc    │    │
│   │ • ROI extraction    │  │ • Weighted vector   │  │ • Embedding query   │    │
│   │ • Numerical signals │  │ • Agreement scoring │  │ • pgvector search   │    │
│   └──────────┬──────────┘  └──────────┬──────────┘  └──────────┬──────────┘    │
│              │                        │                        │               │
│              └───────────────────┬────┴────────────────────────┘               │
│                                  │                                              │
│                                  ▼                                              │
│                     ┌─────────────────────────┐                                │
│                     │   AiReasoningXaiSvc     │                                │
│                     │ • GPT-4o Prompt Builder │                                │
│                     │ • Safety & Ethics Guard │                                │
│                     │ • Schema-Enforced Parse │                                │
│                     └─────────────────────────┘                                │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          DATA ACCESS & ADAPTER LAYER                            │
│   • ScanResultRepository (Persists immutable analysis snapshots)                │
│   • KnowledgeChunkRepository (Executes pgvector similarity queries)              │
│   • StorageAdapter (Generates time-limited signed URLs, deletes purged images)  │
│   • OpenAiAdapter (Encapsulates OpenAI SDK with retry logic & timeout guards)   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### Backend Layer Invariants:
1. **Zero Unauthenticated Access:** No domain service executes without passing through the Authentication Middleware.
2. **Context Isolation:** Domain services receive a strongly typed `RequestContext` containing the verified user ID. Domain logic never reads identity parameters from request payloads.
3. **Repository Abstraction:** SQL queries and storage operations are encapsulated inside repository classes, enabling unit testing via mocked repositories.
