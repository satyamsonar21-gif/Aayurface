# ADR-API-005: Universal Error Handling Standard & Taxonomy

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Context:**  
Inconsistent error formats across endpoints degrade mobile client error handling and risk leaking stack traces, SQL errors, or internal secrets to malicious actors.

**Decision:**  
All error responses adhere to a unified, RFC 7807-inspired JSON structure: `{ error: { code, message, details, requestId, retryable } }`. All backend exceptions are caught by global middleware, mapped to domain error codes, and scrubbed of internal technical details before transmission.

**Consequences:**  
* Guaranteed consistent error parsing for all web and mobile client views.
* Zero internal stack trace or database constraint leakage to public clients.

**Truth Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`
