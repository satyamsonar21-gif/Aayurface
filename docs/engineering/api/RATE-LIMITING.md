# Operational Contract: Rate Limiting & Denial-of-Wallet Defenses
## Sliding-Window Rate Limit Tiers, Abuse Protection & Header Standards

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Traffic Management & Cost Governance  
**Status:** `TARGET ARCHITECTURE / PROPOSED (REQUIRES PRODUCTION BENCHMARKING)`  
**Authority:** Security Architect, Platform Architect, FinOps Analyst  

---

## 1. Multi-Tier Rate Limiting Architecture

To defend against brute-force credential stuffing, Denial-of-Wallet (uncontrolled LLM bill inflation), and resource starvation, the edge gateway enforces sliding-window rate limit counters:

| Tier Identifier | Target Endpoint Scope | Rate Limit Policy | Tracking Key | Status Classification |
|---|---|---|---|---|
| **Tier 1: Public Anonymous** | `/auth/v1/*`, `/api/v1/shares/:token` | 60 requests / minute | Client IP Subnet (`/24`) | `TARGET` |
| **Tier 2: Authenticated General** | `/api/v1/profile`, `/api/v1/routines`, `/api/v1/history` | 300 requests / minute | `auth.uid()` | `TARGET` |
| **Tier 3: AI Analysis Orchestration**| `POST /api/v1/analyses` | **5 analyses / user / hour** | `auth.uid()` | **`PROPOSED POLICY / REQUIRES VALIDATION`** |
| **Tier 4: Biometric Upload URLs** | `POST /api/v1/captures/upload-url` | 10 upload URLs / user / hour | `auth.uid()` | `PROPOSED / REQUIRES VALIDATION` |
| **Tier 5: Conversational Voice/Chat**| `POST /api/v1/voice/chat` | 30 turns / user / hour | `auth.uid()` | `PROPOSED / REQUIRES VALIDATION` |
| **Tier 6: PDF Report Compilation** | `POST /api/v1/reports/compile` | 5 compilations / user / hour | `auth.uid()` | `PROPOSED / REQUIRES VALIDATION` |

---

## 2. Standard Rate Limit Response Headers

On all gateway responses:

```http
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1798761600
```

When rate limit is exceeded (`429 Too Many Requests`):

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 1420
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1798761600
```

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "You have reached the maximum hourly limit for facial wellness analyses. Please try again later.",
    "details": [
      {
        "issue": "Exceeded 5 analyses per hour window.",
        "retryAfterSeconds": 1420
      }
    ],
    "requestId": "req_rate_01",
    "retryable": true
  }
}
```
