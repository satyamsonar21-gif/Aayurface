# Architecture Decision Record: ADR-014
## Observability Architecture: Structured Correlation Logging with Biometric Data Redaction

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Deciders:** Platform/SRE Architect, Security Architect  
**Technical Area:** Observability, Telemetry & Compliance  

---

### 1. Context
Monitoring a production wellness intelligence pipeline requires distributed tracing, error tracking, and performance telemetry across client and serverless tiers. However, logging facial images or sensitive health data violates privacy laws (DPDP Act 2023, GDPR).

### 2. Problem
Establishing complete operational visibility into pipeline latencies and failure modes while guaranteeing that biometric imagery and sensitive PII are never persisted in log management platforms.

### 3. Options Evaluated
* **Option A: Unstructured `console.log()` Calls:** Ad-hoc string logging. (High risk of leaking base64 image strings or passwords).
* **Option B: Full APM Agent (Datadog / New Relic):** Heavyweight agent deployment.
* **Option C: Structured JSON Logging with Automated Redaction & Correlation IDs (Selected):** Standardized JSON schema, client-generated `x-correlation-id`, and deterministic redaction filters intercepting biometric and credential payloads.

### 4. Decision
Adopt **Option C: Structured JSON Logging with Automated Redaction & Correlation IDs**.
* Every request carries an `x-correlation-id` passed through from client to Edge Functions.
* Logs are emitted as structured JSON objects containing timestamp, level, correlationId, service, duration, and error codes.
* All loggers pass payloads through a deterministic sanitizer that replaces image base64 data, buffers, passwords, and API keys with redaction placeholders.

### 5. Rationale
* **Auditability Without Privacy Violation:** SRE teams can trace a failed scan across the entire pipeline using `correlationId` without ever viewing the user’s facial image.
* **Rapid Root-Cause Analysis:** JSON format allows instant querying, filtering, and automated anomaly alerting in Logflare/Datadog.

### 6. Consequences
* *Positive:* Safe, searchable logs, zero risk of biometric leaks, instant correlation across tiers.
* *Negative:* Developers must use the standard logger utility rather than native `console.log()`.

### 7. Risks & Mitigations
* *Risk:* A developer accidentally logs a raw image buffer in a new service.
* *Mitigation:* Automated CI linter checks flag and block raw `console.log()` calls; edge middleware applies global response redaction.

### 8. Evidence
Phase 00 forensic audit identified missing correlation IDs and unredacted logging in prototype functions.

### 9. Revisit Conditions
Revisit if distributed tracing via OpenTelemetry is required across multi-cloud infrastructure.
