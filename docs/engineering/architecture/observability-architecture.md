# AayurFace — Architecture Specification
## Observability, Telemetry & Privacy-Preserving Audit Architecture

**Phase:** Phase 02 — Target System Architecture, ADRs & Implementation Blueprint  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION  
**Authority:** Platform/SRE Architect, Security Architect  

---

### 1. Observability Pillars & Architecture Overview

AayurFace enforces comprehensive operational observability across three pillars—**Structured Logs, Aggregated Metrics, and Distributed Traces**—while strictly enforcing automated redaction to prevent biometric facial images or sensitive health PII from leaking into log aggregators.

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           REQUEST CORRELATION FLOW                              │
│                                                                                 │
│   Client SPA (Browser)                                                          │
│   Generates: `x-correlation-id: req_8f1a7b4c9e`                                │
│        │                                                                        │
│        ▼                                                                        │
│   Supabase Edge Function (Middleware)                                           │
│   Injects: `correlationId`, `userId: auth.uid()`, `timestamp`                   │
│        │                                                                        │
│        ├────────────────────────────────┬────────────────────────────────┐      │
│        ▼                                ▼                                ▼      │
│   [Structured JSON Logs]       [Metric Telemetry]              [Audit Event]    │
│   (Winston / Deno Logger)      (Latency, Tokens, Errors)       (DB Admin Log)   │
│        │                                │                                │      │
│        ▼                                ▼                                ▼      │
│   Logflare / Sentry            Datadog / CloudWatch            PostgreSQL Audit │
│   (PII & Images Redacted)      (Anonymized Aggregates)         (Compliance Log) │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Standard Structured Logging Schema

All Edge Functions and backend services emit structured JSON logs formatted according to the following schema:

```json
{
  "timestamp": "2026-09-03T10:15:30.124Z",
  "level": "INFO",
  "correlationId": "req_8f1a7b4c9e",
  "service": "analyze-multimodal",
  "stage": "MULTIMODAL_FUSION",
  "userId": "usr_99f2b1c8",
  "durationMs": 142,
  "metadata": {
    "agreementState": "HIGH_AGREEMENT",
    "agreementScore": 0.88,
    "isDegraded": false,
    "cvVersion": "fe-mediapipe-v1.0.0",
    "fusionVersion": "fusion-alg-v1.0"
  }
}
```

---

### 3. Automated Privacy Redaction Invariant

The logging middleware incorporates deterministic sanitization masks:
1. **Biometric Redaction:** Any field matching `/base64/i`, `/image/i`, `/buffer/i`, or containing data URIs (`data:image/...`) is intercepted and replaced with `"[REDACTED_BIOMETRIC_PAYLOAD]"`.
2. **Credential Redaction:** Passwords, API keys, and JWT signatures are replaced with `"[REDACTED_SECRET]"`.
3. **Health Response Protection:** Free-text chat queries and specific question answer text are stripped from telemetry; only category IDs and numerical vectors are logged.

---

### 4. Operational Telemetry & Health Metrics Matrix

| Metric Name | Type | Unit | Dimension / Tags | Alerting Threshold | Operational Impact |
|---|---|---|---|---|---|
| `analysis.latency.total` | Histogram | Milliseconds | `status`, `stage` | p95 > 35,000 ms | Slow analysis pipeline degrading user experience. |
| `analysis.cv.latency` | Histogram | Milliseconds | `fe_version` | p95 > 3,000 ms | Edge serverless feature extraction bottleneck. |
| `analysis.ai.latency` | Histogram | Milliseconds | `model_version` | p95 > 15,000 ms | OpenAI upstream API degradation or throttling. |
| `analysis.error.rate` | Gauge | Percentage | `error_code` | > 2.0% in 5 min | Service outage or upstream API failure; alerts on-call SRE. |
| `capture.gateway.rejection.rate` | Counter | Count | `reason` (lighting, blur, centering) | > 40% in 15 min | Systematic client capture gateway failure or UI camera issue. |
| `analysis.low_agreement.rate` | Gauge | Percentage | `agreement_state` | > 30% in 1 hour | Potential signal drift or calibration error across modalities. |
| `rag.retrieval.miss.rate` | Counter | Count | `source` | > 5% of queries | Knowledge base gap; indicates need for additional classical citations. |
| `openai.tokens.consumed` | Counter | Count | `model`, `call_type` | Cost budget tracking | Triggers automated cloud budget alerts if burn rate exceeds quota. |
