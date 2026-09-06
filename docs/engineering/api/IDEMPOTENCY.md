# Operational Contract: Mutation Idempotency Standard
## IETF Idempotency-Key Protocol, Replay Detection & Cache Semantics

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Network Reliability & Mutation Safety  
**Status:** `TARGET ARCHITECTURE / PROPOSED (REQUIRES IMPLEMENTATION)`  
**Authority:** Principal Backend Architect, Distributed Systems Architect  

---

## 1. The Idempotency Gateway Protocol

To protect expensive AI analysis pipelines, payment operations, and habit tracking logs from duplicate execution caused by mobile network retries or double-clicks:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    IDEMPOTENCY GATEWAY EXECUTION FLOW                       │
├─────────────────────────────────────────────────────────────────────────────┤
│   [ Client POST Request with `Idempotency-Key: <uuid>` ]                    │
│                     │                                                       │
│                     ▼                                                       │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ Check Gateway Idempotency Cache: `idempotency:{userId}:{key}`       │   │
│   └─────────────────┬─────────────────┬─────────────────┬───────────────┘   │
│                     │                 │                 │                   │
│        Cache MISS   │   IN-FLIGHT     │   COMPLETED     │   PAYLOAD         │
│        (New Key)    │   (Processing)  │   (Cached OK)   │   MISMATCH        │
│                     ▼                 ▼                 ▼                   ▼
│   ┌─────────────────┐ ┌─────────────┐ ┌───────────────┐ ┌─────────────────┐ │
│   │ Store 'PENDING' │ │ Return 409  │ │ Return Cached │ │ Return 422      │ │
│   │ Execute Handler │ │ Conflict    │ │ 202/201 Resp  │ │ Unprocessable   │ │
│   │ Cache Output    │ │ (Retry-After│ │ (Header:      │ │ (Hash Mismatch) │ │
│   │ TTL: 120s       │ │  2 seconds) │ │  Replay: true)│ │                 │ │
│   └─────────────────┘ └─────────────┘ └───────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Idempotency Specification Rules

1. **Header Format:** `Idempotency-Key: <string>` (UUIDv4 recommended; 16–64 ASCII characters).
2. **Scope:** Strictly bound to caller identity `(auth.uid(), idempotency_key)`. Cross-user key collisions are impossible.
3. **Payload Hash Verification:** The gateway stores `request_payload_sha256 = SHA256(requestBody)`. If a subsequent request arrives with the same key but different body parameters, the gateway returns `422 Unprocessable Entity` (`IDEMPOTENCY_PAYLOAD_MISMATCH`).
4. **Time-to-Live (TTL):** Cached idempotency records expire after **120 seconds**.
5. **Mandatory Endpoints:** `POST /api/v1/analyses`, `POST /api/v1/reports/compile`, `POST /api/v1/routines/items/:id/track`.
