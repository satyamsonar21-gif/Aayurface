# AayurFace — Architecture Specification
## Architectural Risk Register & Mitigation Blueprint

**Phase:** Phase 02 — Target System Architecture, ADRs & Implementation Blueprint  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION  
**Authority:** Principal Software Architect, Security & Privacy Architect, AI/ML Architect  

---

### 1. Risk Evaluation Methodology

Architectural risks are evaluated using a standard qualitative matrix:
* **Probability:** Low / Moderate / High
* **Impact:** Low / Moderate / High / Critical
* **Detection:** Automated telemetry, integration test, or human audit
* **Mitigation:** Concrete architectural control or boundary mechanism

---

### 2. Architectural Risk Register

| Risk ID | Risk Description | Probability | Impact | Detection Mechanism | Architectural Mitigation & Control | Owner / Area | Status |
|---|---|---|---|---|---|---|---|
| **RISK-001** | **Computer Vision Lighting Sensitivity:** Varying consumer lighting alters apparent skin reflectance and erythema index. | High | High | Client capture gateway ROI luma histogram check. | Reject frames with ROI luminance $< 80$ or $> 220$; enforce client-side lighting guide before capture button enables. | CV Lead | **MITIGATED IN ARCHITECTURE** |
| **RISK-002** | **Indian Skin Tone Algorithmic Bias:** Misinterpreting baseline melanin (Fitzpatrick III–VI) as vascular erythema. | High | Critical | Benchmark audits against synthetic/clinical darker skin tone datasets. | Decouple $L^*$ (melanin) from $a^*$ (erythema) in CIELAB color space; test and calibrate against Fitzpatrick III–VI datasets. | AI/ML Architect | **MITIGATED IN ARCHITECTURE** |
| **RISK-003** | **Multimodal Disagreement / Conflicting Signals:** Visual signals contradict constitutional quiz or lifestyle data. | Moderate | High | Pairwise cosine similarity matrix; harmonic agreement index $A < 0.60$. | Assign `LOW_AGREEMENT`, mathematically cap confidence $< 60\%$, display amber advisory card, and prompt user to retake capture or review quiz. | AI/ML Architect | **MITIGATED IN ARCHITECTURE** |
| **RISK-004** | **Uncalibrated Confidence Scores:** Stating false high certainty on noisy or incomplete input data. | Moderate | High | Discrepancy between stated confidence and downstream expert labels. | Deterministic multi-dimensional formula: $\text{Confidence} = Q_{cap} \times C_{input} \times A \times 100\%$. No arbitrary LLM self-confidence. | Solution Architect | **MITIGATED IN ARCHITECTURE** |
| **RISK-005** | **LLM Generative Hallucination:** GPT-4o fabricates ungrounded herbal formulations or non-existent Sanskrit verses. | Moderate | Critical | Automated citation cross-referencing against `knowledge_chunks` table. | Constrained RAG pipeline; mandatory retrieval threshold ($s \ge 0.75$); safe limitation fallback on retrieval miss; strict JSON schema validation. | AI/ML Architect | **MITIGATED IN ARCHITECTURE** |
| **RISK-006** | **Classical Knowledge Translation Inaccuracy:** Flawed text chunking introduces out-of-context herbal contraindications. | Low | High | Ayurvedic practitioner review during administrative knowledge ingestion. | Admin ingestion workflow requires manual verification of chapter/verse tags and English/Devanagari dual text alignment. | Domain Analyst | **MITIGATED IN ARCHITECTURE** |
| **RISK-007** | **Prompt Injection via Free-Text Input:** Malicious user prompt overrides safety filters or extracts system instructions. | Moderate | High | Automated prompt injection penetration tests; Sentry alert on anomalous output. | XML delimiter encapsulation (`<user_concern>`), HTML entity stripping, strict length caps (500 chars), and system prompt immunity directives. | Security Architect | **MITIGATED IN ARCHITECTURE** |
| **RISK-008** | **Biometric Facial Capture Data Leak:** Captured user facial images exposed via public URL or storage misconfiguration. | Low | Critical | Automated CI storage policy linter; daily bucket configuration audit. | Private S3 bucket with zero public reads; HMAC-signed temporary URLs (TTL 15m); client-to-storage direct upload; server-side encryption. | Security Architect | **MITIGATED IN ARCHITECTURE** |
| **RISK-009** | **Biometric Retention Regulatory Liability:** Storing raw facial images creates DPDP Act 2023 / GDPR compliance liability. | Moderate | High | Audit logging of storage bucket object ages. | Architecture supports immediate-purge policy post-feature-extraction (DEC-004); longitudinal tracking operates on numerical vectors only. | Compliance Lead | **OPEN POLICY (DEC-004)** |
| **RISK-010** | **Commercial AI Vendor Lock-in:** OpenAI model deprecation, price hike, or unexpected API behavioral shift. | Moderate | Moderate | Automated synthetic test suite evaluating model completion quality weekly. | Abstract interfaces (`IAiReasoningEngine`); pinned model versions (`gpt-4o-2024-08-06`); isolated adapter layer allowing alternative provider swap. | Principal Architect | **MITIGATED IN ARCHITECTURE** |
| **RISK-011** | **OpenAI API Cost Overrun (Denial of Wallet):** Bot spam or excessive user scans exhausting cloud inference budget. | High | High | Realtime cost tracking telemetry; automated alert when hourly spend exceeds limit. | Configurable rate-limiting middleware (DEC-006: 5 scans/user/hour); IP-based throttling; payload size limits; authenticated-only analysis access. | DevOps / Finance | **MITIGATED IN ARCHITECTURE** |
| **RISK-012** | **High Analysis Pipeline Latency:** End-to-end processing exceeds 40s on flaky mobile connections, causing user drop-off. | Moderate | Moderate | Realtime latency histogram tracking across each pipeline stage. | Supabase Realtime progress streaming provides live feedback; Edge Functions execute in parallel where possible; strict 45s hard timeout. | Backend Architect | **MITIGATED IN ARCHITECTURE** |
| **RISK-013** | **PostgreSQL Connection Pool Exhaustion:** Traffic spikes overload Supabase database connections during viral growth. | Low | High | Supabase connection pool metric alarms (pgBouncer pool utilization > 80%). | Connection pooling via pgBouncer; Edge Functions use stateless HTTPS API calls rather than persistent direct database connections. | Platform Architect | **MITIGATED IN ARCHITECTURE** |
| **RISK-014** | **Accumulated S3 Storage Egress Costs:** Storing high-resolution uncompressed selfies permanently scales storage bills. | Moderate | Moderate | Cloud storage metrics dashboard tracking bucket size growth. | Client-side JPEG compression prior to upload ($\le 500\text{ kB}$); automated 30-day lifecycle purge rule; optional immediate-purge mode. | DevOps Lead | **MITIGATED IN ARCHITECTURE** |
| **RISK-015** | **Realtime WebSocket Drop on Mobile Sleep:** Mobile browser backgrounding kills WebSocket connection during analysis. | High | Low | Client heartbeat monitor detecting WebSocket connection state. | Automated client-side fallback to polling (`GET /api/v1/analysis/:id` every 5s) if WebSocket disconnects for $\ge 8$ seconds. | Frontend Architect | **MITIGATED IN ARCHITECTURE** |
| **RISK-016** | **Absence of Ground-Truth Clinical Data:** Early multimodal fusion operates on hypothesis weights without clinical validation. | High | High | Inter-modality agreement rate monitoring; feedback collection on results page. | Configurable fusion weight architecture (DEC-005); isolation of Research Phase for triple-practitioner consensus labeling and calibration. | Research Lead | **OPEN / RESEARCH VALIDATION** |
| **RISK-017** | **Regulatory Misclassification as Medical Device:** Regulatory bodies interpret skin analysis as unapproved diagnostic software. | Low | Critical | Legal review of marketing materials and user-facing copy. | Non-diagnostic invariant (`BR-AI-001`); permanent persistent disclaimers; neutral morphological language; mandatory 24-hour patch test directive. | Legal / Compliance | **MITIGATED IN ARCHITECTURE** |
| **RISK-018** | **Migration Regressions from Existing Prototype:** Replacing mock auth and routing breaks existing prototype pages. | High | Moderate | Continuous integration build verification (`tsc -b`, `oxlint`, Vitest suites). | 14-milestone phased migration blueprint; non-destructive incremental replacement; feature-flagged routing during transition. | Principal Architect | **MITIGATED IN ARCHITECTURE** |
