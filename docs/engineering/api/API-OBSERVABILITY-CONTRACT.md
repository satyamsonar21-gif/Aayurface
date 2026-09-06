# Operational Contract: API Observability & Telemetry Standard
## Distributed Tracing, Structured Logging & PII Scrubbing Rules

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Telemetry & System Observability  
**Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`  
**Authority:** Platform/SRE Architect, Security Architect  

---

## 1. Structured Logging & Distributed Tracing

Every incoming HTTP request is assigned a unique `X-Request-ID` and standard W3C `traceparent` header propagated across the API gateway, background workers, and database transactions:

```json
{
  "timestamp": "2026-09-03T20:30:00.125Z",
  "level": "INFO",
  "requestId": "req_018e3a2b8c4d7ef0",
  "traceId": "4bf92f3577b34da6a3ce929d0e0e4736",
  "actorId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f80",
  "actorRole": "authenticated",
  "httpMethod": "POST",
  "path": "/api/v1/analyses",
  "statusCode": 202,
  "durationMs": 78,
  "clientIpSubnet": "192.168.1.0/24",
  "userAgentHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```

---

## 2. Absolute Logging Prohibitions (Zero-Leakage Telemetry)

Under zero circumstances may APM logs, stack traces, or console outputs record:
1. **Raw Biometric Imagery:** Base64 image strings, raw pixel buffers, or facial landmark arrays.
2. **Cryptographic Secrets:** Plaintext passwords, JWT authorization tokens, Supabase service role keys, or AWS KMS keys.
3. **Signed URLs:** Full HMAC signed S3 URLs containing query parameters.
4. **Voice Audio Data:** Audio byte arrays or raw microphone recording streams.
5. **Direct Personal Identifiers:** Full un-redacted email addresses, phone numbers, or complete IP addresses.
