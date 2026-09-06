# AayurFace — Security Architecture Specification
## Security Observability, Event Telemetry & Data Redaction

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Security Architect, Platform/SRE Architect, Observability Lead  

---

### 1. The Observability Security Invariant

System telemetry is essential for diagnosing operational anomalies and triaging incidents. However, unconstrained logging frequently becomes the #1 vector for accidental biometric and credential leaks:

> [!CRITICAL]
> **Anti-Logging Biometric & Credential Rule**  
> Under NO circumstances shall application or debug logs contain plain-text passwords, password hashes, access tokens, refresh tokens, private API keys, raw facial image binaries, base64 strings, or unredacted health questionnaire details.  
> All log events pass through an automated regex and allowlist redaction pipeline prior to serialization.

---

### 2. Segregated Logging Architecture

Telemetry is physically segregated into three isolated operational streams:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ STREAM 1: APPLICATION & APM LOGS                                            │
│ Focus: Request latencies, error traces, HTTP status codes.                  │
│ Sensitivity: Internal. Retention: 30 days rolling.                          │
│ Policy: Zero PII; zero biometric data; user IDs masked or hashed.           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ STREAM 2: SECURITY & THREAT TELEMETRY LOGS                                  │
│ Focus: Failed authentications, rate-limit trips, WAF blocks, injection hits.│
│ Sensitivity: Confidential. Retention: 90 days rolling.                      │
│ Policy: Anonymized IP subnets, correlation IDs, threat signatures.          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ STREAM 3: IMMUTABLE AUDIT LOG VAULT (WORM)                                  │
│ Focus: Consent mutations, admin actions, account deletions, RLS denials.    │
│ Sensitivity: High Confidentiality. Retention: 365 days minimum.             │
│ Policy: Cryptographically chained; tamper-evident; write-once-read-many.    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 3. Formal Security Events Catalog

| Security Event Name | Severity Tier | Monitored Trigger Condition | Payload Allowlist Restrictions | Retention Period | Real-Time Alerting Rule |
|---|---|---|---|---|---|
| `AUTH_LOGIN_SUCCESS` | INFO | User successfully completes authentication. | `user_id`, `auth_method` (email/OAuth), `ip_subnet`. | 90 days | None. |
| `AUTH_LOGIN_FAILURE` | WARNING | Invalid credentials supplied at login. | `email_hash`, `reason`, `ip_subnet`. **Zero password text.** | 90 days | Alert if $\ge 5$ failures/min from same IP. |
| `AUTH_PASSWORD_RESET` | NOTICE | Password reset requested or completed. | `email_hash`, `action_state`, `timestamp`. | 180 days | High-volume anomaly alert. |
| `AUTH_SESSION_REVOKED`| NOTICE | User signs out or global session revoked. | `user_id`, `revocation_scope`. | 90 days | None. |
| `AUTHZ_DENIED` | WARNING | User attempts to access unauthorized route. | `user_id`, `target_endpoint`, `role`. | 180 days | Alert if $\ge 10$ denials from same user. |
| `RLS_DENIED` | HIGH | Cross-tenant database access attempt. | `user_id`, `target_table`, `target_id`. | 365 days | Alert on any occurrence (potential IDOR). |
| `OBJECT_SIGNED_URL_CREATED` | INFO | S3 pre-signed upload/download URL generated. | `user_id`, `object_uuid`, `ttl_seconds`. **Zero signed URL in logs.** | 90 days | None. |
| `ANALYSIS_REQUESTED` | INFO | User initiates camera skin analysis. | `user_id`, `scan_uuid`, `correlation_id`. | 90 days | None. |
| `ANALYSIS_RATE_LIMITED` | WARNING | User exceeds proposed 5 scans/hour baseline. | `user_id`, `current_count`, `window_reset_at`. | 90 days | Alert if systemic spike across tenants. |
| `AI_OUTPUT_REJECTED` | HIGH | LLM output fails Zod schema or medical guard. | `scan_uuid`, `violation_reason`, `model_version`. | 180 days | Pager alert if error rate $> 2\%$. |
| `PROMPT_INJECTION_DETECTED` | HIGH | Input contains prompt injection signatures. | `user_id`, `injection_pattern_type`, `sanitized_length`. | 365 days | Security Slack alert on occurrence. |
| `RAG_SOURCE_REJECTED` | WARNING | Retrieval query failed cosine similarity gate. | `query_vector_id`, `top_similarity_score`. | 90 days | Informational dashboard metric. |
| `ADMIN_ACTION` | HIGH | Administrator executes privileged mutation. | `admin_id`, `action_type`, `target_uuid`, `justification`. | 365 days (WORM) | Immediate Slack / Audit event broadcast. |
| `RESEARCH_EXPORT` | HIGH | Research dataset batch exported. | `researcher_id`, `record_count`, `dataset_version`. | 365 days (WORM) | Senior compliance sign-off alert. |
| `ACCOUNT_DELETION_REQUESTED` | HIGH | User initiates account & biometric purge. | `tenant_hash`, `purge_task_id`, `timestamp`. | 365 days (WORM) | SRE confirmation notification. |

---

### 4. Automated Redaction Pipeline Specifications

The centralized logger implements an interceptor pipeline executing three mandatory sanitization stages:
1. **Regex String Scrubber:** Intercepts string fields matching:
   * Base64 Images: `/(data:image\/[a-zA-Z]*;base64,)[^\s"]+/g` $\rightarrow$ `[IMAGE_BASE64_REDACTED]`
   * Passwords: `/("password"|"passwd"|"token"|"secret")\s*:\s*"[^"]+"/gi` $\rightarrow$ `"$1": "[REDACTED]"`
   * Bearer Tokens: `/Bearer\s+[A-Za-z0-9\-\._~\+\/]+=*/g` $\rightarrow$ `Bearer [TOKEN_REDACTED]`
2. **Payload Size Guard:** Any log payload exceeding 16 KB is truncated to prevent buffer-bloat denial-of-service against the log forwarder.
3. **Correlation Propagation:** Every log line permanently retains the request's `x-correlation-id` to enable unified distributed tracing across client, edge, and database tiers without exposing user identity.
