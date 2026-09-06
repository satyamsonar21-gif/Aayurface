# Operational Contract: Error Handling & Fault Taxonomy
## Standard Error Envelope, HTTP Status Mappings & Zero-Leakage Policies

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Error Governance  
**Status:** `AUTHORITATIVE CONTRACT STANDARD`  
**Authority:** Principal Backend Architect, Security Architect  

---

## 1. Standard Error Envelope (RFC 7807 Inspired)

All error responses across all `/api/v1/*` endpoints conform to a single, immutable JSON envelope:

```typescript
export interface StandardErrorEnvelope {
  error: {
    code: string;           // Machine-readable domain error code (e.g. 'RATE_LIMIT_EXCEEDED')
    message: string;        // Human-readable, non-technical message for UI display
    details?: Array<{       // Structured parameter/field level issues
      field?: string;
      issue: string;
    }>;
    requestId: string;      // Traceable correlation identifier
    retryable: boolean;     // Whether client can safely retry the operation
  };
}
```

---

## 2. HTTP Status Code & Error Code Taxonomy

| HTTP Status | Primary Error Code | Meaning & Trigger Scenario | Retryable? |
|---|---|---|---|
| **400 Bad Request** | `MALFORMED_REQUEST_SYNTAX` | Unparseable JSON, illegal characters. | No |
| **401 Unauthorized** | `AUTH_TOKEN_INVALID` / `AUTH_TOKEN_EXPIRED` | Missing, expired, or corrupted JWT bearer token. | No (Re-login) |
| **403 Forbidden** | `CONSENT_REQUIRED` / `INSUFFICIENT_PERMISSIONS` | Caller lacks consent scope or admin role. | No |
| **404 Not Found** | `RESOURCE_NOT_FOUND` | Requested entity does not exist or caller does not own it (anti-BOLA). | No |
| **409 Conflict** | `ILLEGAL_STATE_TRANSITION` / `IDEMPOTENCY_CONFLICT` | Out-of-order state update or concurrent mutation. | No |
| **413 Payload Too Large** | `FILE_SIZE_EXCEEDED` | Upload image exceeds 5MB limit. | No |
| **422 Unprocessable** | `INVALID_INPUT_SCHEMA` | Zod validation failure on request fields. | No |
| **429 Too Many Requests** | `RATE_LIMIT_EXCEEDED` | Exceeded 5 analyses/hr or API request rate limits. | Yes (After delay) |
| **500 Internal Error** | `INTERNAL_SERVER_ERROR` | Unhandled backend exception (Scrubbed). | Yes |
| **502 Bad Gateway** | `AI_PROVIDER_ERROR` | Upstream OpenAI or external model API failure. | Yes |
| **503 Unavailable** | `SERVICE_MAINTENANCE` | Database connection pool saturation or scheduled downtime. | Yes |
| **504 Gateway Timeout** | `UPSTREAM_TIMEOUT` | Background worker exceeded execution deadline. | Yes |

---

## 3. Zero-Leakage Policy

Under zero circumstances may an error response contain:
1. Raw SQL error messages, table names, or PostgreSQL constraint names.
2. Server file system paths, stack traces, or line numbers.
3. OpenAI/LLM raw system prompts, API keys, or provider tokens.
4. S3 internal bucket names, AWS access keys, or HMAC signatures.
5. Personal identifiers or health details belonging to other users.
