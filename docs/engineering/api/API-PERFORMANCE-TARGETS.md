# Operational Contract: API Performance & Latency Targets
## Service Level Indicators, Latency Budgets & Benchmarking Invariants

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** System Performance & Scalability  
**Status:** `TARGET ARCHITECTURE OBJECTIVES (REQUIRES LOAD TESTING & PRODUCTION BENCHMARKING)`  
**Authority:** Platform/SRE Architect, Performance Engineer  

---

## 1. Latency Target Budgets (Service Level Objectives)

> [!NOTE]
> **Performance Classification Notice:** The figures below represent **ARCHITECTURAL TARGET OBJECTIVES**. They do not constitute measured production benchmarks until formal load and stress testing are executed in Phase 06/07.

| Metric Identifier | Target Endpoint / Subsystem Scope | Target Latency Budget (P95) | Target Throughput (RPS) | Validation Status |
|---|---|---|---|---|
| **SLO-API-01** | Synchronous Profile Queries (`GET /api/v1/profile`) | $\le 100\text{ ms}$ | 500 RPS | `TARGET (REQUIRES LOAD TEST)` |
| **SLO-API-02** | Routine Home Screen Loading (`GET /api/v1/routines/active`) | $\le 50\text{ ms}$ | 1,000 RPS | `TARGET (REQUIRES LOAD TEST)` |
| **SLO-API-03** | Signed S3 Upload URL Issuance (`POST /api/v1/captures/upload-url`)| $\le 100\text{ ms}$ | 200 RPS | `TARGET (REQUIRES LOAD TEST)` |
| **SLO-API-04** | Async Analysis Job Creation (`POST /api/v1/analyses`) | $\le 150\text{ ms}$ | 100 RPS | `TARGET (REQUIRES LOAD TEST)` |
| **SLO-API-05** | Total Async Analysis Pipeline (`POST` $\rightarrow$ `COMPLETED`) | $\le 8.0\text{ seconds}$ | 20 Concurrent Jobs | `PROPOSED (REQUIRES AI LOAD TEST)` |
| **SLO-API-06** | pgvector Cosine Search (`knowledge_chunks`) | $\le 20\text{ ms}$ | 250 RPS | `TARGET (REQUIRES LOAD TEST)` |
| **SLO-API-07** | Conversational Chat Turn (`POST /api/v1/voice/chat`) | $\le 2.0\text{ seconds}$ | 50 Concurrent Turns | `PROPOSED (REQUIRES AI LOAD TEST)` |
| **SLO-API-08** | Asynchronous PDF Report Compilation | $\le 4.0\text{ seconds}$ | 10 Concurrent Compiles | `PROPOSED (REQUIRES WORKER BENCHMARK)`|
