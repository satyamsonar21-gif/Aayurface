# AayurFace — Risk Management Registry
## Phase 05 API & Backend Architecture Risk Register

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Date:** 2026-09-03  
**Status:** ACTIVE RISK REGISTER  
**Authority:** Risk Analyst, Security Architect, Principal Backend Architect  

---

## 1. Risk Evaluation Matrix

Risks are quantified using a standard $5 \times 5$ Risk Matrix:
* **Severity (1–5):** 1 (Negligible) to 5 (Catastrophic)
* **Probability (1–5):** 1 (Rare) to 5 (Frequent)
* **Risk Score:** $\text{Score} = \text{Severity} \times \text{Probability}$ (1–25)

---

## 2. API & Backend Risk Register

| Risk ID | Risk Description | Pre-Mitigation Score (Sev $\times$ Prob) | Mitigation Controls Specified in Phase 05 | Post-Mitigation Score (Sev $\times$ Prob) | Status |
|---|---|---|---|---|---|
| **RSK-API-01** | **BOLA / IDOR Exploitation:** Malicious caller queries or mutates another user's biometric scan or health history by guessing UUIDs. | $5 \times 4 = 20$ (Critical) | • Gateway drops client `userId` headers.<br/>• Server derives identity from RS256 JWT `auth.uid()`.<br/>• Enforces Kernel RLS + uniform `404 Not Found`. | $5 \times 1 = 5$ (Low) | **MITIGATED IN DESIGN** |
| **RSK-API-02** | **Denial-of-Wallet (LLM Cost Surge):** Automated scripts flood `/api/v1/analyses` causing uncontrolled OpenAI bill inflation. | $4 \times 4 = 16$ (High) | • Multi-tier sliding-window rate limiting (5 analyses/user/hour).<br/>• Mandatory `Idempotency-Key` headers.<br/>• Daily platform cost circuit breakers. | $3 \times 1 = 3$ (Low) | **MITIGATED IN DESIGN** |
| **RSK-API-03** | **Unvalidated AI Medical Hallucination:** LLM outputs clinical disease diagnoses or prescription drugs. | $5 \times 3 = 15$ (High) | • 5-stage untrusted output validation pipeline.<br/>• Medical regex keyword blocking.<br/>• Citation foreign-key grounding verification. | $4 \times 1 = 4$ (Low) | **MITIGATED IN DESIGN** |
| **RSK-API-04** | **Prompt Injection in RAG Chunks:** Malicious content injected into knowledge base overrides system instructions. | $4 \times 3 = 12$ (Moderate) | • Retrieved chunks wrapped in untrusted data tags.<br/>• System prompt instruction primacy.<br/>• Dual-scholar sign-off on knowledge ingestion. | $3 \times 1 = 3$ (Low) | **MITIGATED IN DESIGN** |
| **RSK-API-05** | **Biometric Data Leakage via Telemetry:** Application loggers accidentally record raw base64 images or EXIF data. | $5 \times 3 = 15$ (High) | • Zero-leakage telemetry rules in `API-OBSERVABILITY-CONTRACT.md`.<br/>• Automated PII/biometric log scrubber middleware. | $5 \times 1 = 5$ (Low) | **MITIGATED IN DESIGN** |
| **RSK-API-06** | **Worker Queue Starvation / Deadlock:** Background AI workers crash mid-execution leaving jobs orphaned in `analysis_jobs`. | $3 \times 3 = 9$ (Moderate) | • PostgreSQL `FOR UPDATE SKIP LOCKED` claim queries.<br/>• 60-second lock expiration and automatic zombie worker reclaim. | $2 \times 1 = 2$ (Low) | **MITIGATED IN DESIGN** |
| **RSK-API-07** | **Inaccurate High-Confidence Output during Modality Clash:** System produces confident recommendations when face scan clashes with quiz. | $4 \times 3 = 12$ (Moderate) | • Harmonic Agreement Index $A$ gating.<br/>• Low-Agreement Protocol capping confidence $<60\%$.<br/>• Suppression of generative herbal recipes. | $3 \times 1 = 3$ (Low) | **MITIGATED IN DESIGN** |
