# AayurFace — Backend & API Architecture Specification
## API Versioning Strategy & Deprecation Lifecycle Policy

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Date:** 2026-09-03  
**Status:** AUTHORITATIVE ARCHITECTURAL STANDARD  
**Authority:** Principal Backend Architect, API Architect, Release Manager  

---

## 1. Versioning Strategy Evaluation & Decision

To support independent evolution of the web application, mobile SPA clients, and edge services without forcing disruptive, synchronized client updates, AayurFace evaluated three standard versioning strategies:

| Strategy | Evaluation | Decision |
|---|---|---|
| **1. URI Path Versioning (`/api/v1/`)** | **Optimal:** Highly visible in gateway routing rules, CDN edge routing, WAF inspection, access logs, and client code. Unambiguous across browser and mobile HTTP clients. | **SELECTED FOR PRODUCTION** |
| **2. Custom Request Header (`X-API-Version: 1.0`)** | **Poor:** Invisible in browser address bars; complicates edge caching; breaks standard cURL/REST exploration; prone to client omission. | **REJECTED** |
| **3. Content Negotiation (`Accept: application/vnd.aayurface.v1+json`)** | **Poor:** High complexity for mobile/web developers; difficult to debug in browser network inspectors; poor gateway routing support. | **REJECTED** |

---

## 2. Breaking vs Non-Breaking Changes

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    API CHANGE COMPATIBILITY RULES                           │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ NON-BREAKING (Permitted in v1)       │ BREAKING (Requires v2 Major Release) │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ • Adding new optional request fields │ • Removing or renaming an endpoint   │
│ • Adding new response payload fields │ • Removing or renaming existing fields│
│ • Adding new endpoints               │ • Changing field data types or scales│
│ • Relaxing input validation rules    │ • Adding mandatory request fields    │
│ • Adding new error detail structures │ • Altering enum values/meanings      │
│ • Rate limit adjustments             │ • Modifying HTTP success status codes│
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 3. Deprecation, Sunset & Migration Lifecycle

When a breaking architectural change or schema overhaul necessitates a new major API version (e.g., `/api/v2/`):

```text
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ ACTIVE (v1)  │ ──► │ DEPRECATED   │ ──► │ SUNSET (90d) │ ──► │ TERMINATED   │
│ Normal traffic│     │ Header notice│     │ Error warning│     │ 410 Gone     │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

1. **Phase 1: Deprecation Notice (Day 0–60):**
   * The legacy endpoint continues normal operation.
   * Responses include standard IETF deprecation headers:
     ```http
     Deprecation: @1798761600
     Sunset: Wed, 01 Jul 2026 00:00:00 GMT
     Link: </api/v2/analyses>; rel="successor-version"
     ```
2. **Phase 2: Active Migration Window (Day 61–90):**
   * Developer dashboard alerts and telemetry logs identify active legacy callers.
3. **Phase 3: Sunset & Termination (Day 90+):**
   * Legacy endpoint permanently returns `410 Gone`:
     ```json
     {
       "error": {
         "code": "API_VERSION_SUNSET",
         "message": "The /api/v1/analyses endpoint has been sunset. Please upgrade to /api/v2/analyses.",
         "details": { "sunsetDate": "2026-07-01T00:00:00.000Z" },
         "retryable": false
       }
     }
     ```
