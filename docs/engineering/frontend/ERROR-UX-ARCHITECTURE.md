# AayurFace — Error Architecture Specification
## API Error Mapping, User Communication & Fault Recovery Policies

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Domain:** Error Governance & UX Resilience  
**Status:** `AUTHORITATIVE ERROR SPECIFICATION`  
**Authority:** Staff UX Engineer, Principal Frontend Architect  

---

## 1. Phase 05 Error Code to Frontend UX Mapping Matrix

| Phase 05 Error Code | HTTP Status | Frontend UI Presentation | User-Facing Display Message | Recovery Action / Primary CTA |
|---|---|---|---|---|
| `AUTH_TOKEN_EXPIRED` | `401` | Floating Alert Banner | *"Your session has expired. Please sign in again."* | Redirects to `/login?redirect=...` |
| `CONSENT_REQUIRED` | `403` | Inset Modal Dialog | *"Biometric capture consent is required to process facial scans."* | Button: *"Review & Grant Consent"* |
| `RESOURCE_NOT_FOUND` | `404` | Full-Page 404 View | *"We couldn't find the assessment or page you were looking for."*| Button: *"Return to Dashboard"* |
| `IDEMPOTENCY_CONFLICT`| `409` | Inline Warning Toast | *"An identical request is currently processing. Please hold on."*| Automatic 2-second retry wait |
| `FILE_SIZE_EXCEEDED` | `413` | Inline Input Error | *"Image exceeds the 5MB maximum limit. Please choose a smaller file."*| Button: *"Select Different Photo"* |
| `INVALID_INPUT_SCHEMA`| `422` | Inline Field Error | Form field error: *"Please enter a valid value."* | Highlights input field |
| `RATE_LIMIT_EXCEEDED` | `429` | Inset Modal Dialog | *"You have reached the maximum limit of 5 scans per hour. Please rest."*| Displays countdown timer |
| `INTERNAL_SERVER_ERROR`|`500` | Full-Screen Error Boundary| *"Our wellness servers encountered an issue. Please try again shortly."*| Button: *"Retry Request"* |
| `SERVICE_MAINTENANCE` | `503` | Maintenance Banner | *"AayurFace is undergoing scheduled maintenance. Back shortly."* | Auto-recheck every 30s |

---

## 2. Zero-Leakage Presentation Invariant

The frontend global error boundary strictly intercepts all unhandled errors, ensuring that under zero circumstances are raw SQL constraints, AWS S3 bucket paths, OpenAI token errors, or server stack traces rendered on user screens.
