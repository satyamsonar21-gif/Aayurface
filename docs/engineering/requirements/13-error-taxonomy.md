# AayurFace — Engineering Requirements Specification
## Document 13: Standardized Error Taxonomy & Handling Specifications

**Phase:** Phase 01 — Requirements Engineering, Formalization & Complete Traceability  
**Date:** 2026-09-03  
**Status:** FORMAL ENGINEERING CONTRACT  
**Authority:** DevOps/SRE Engineer, Backend Architect, QA/Test Architect  

---

### 1. Error Handling Invariants

1. **Zero Stack Traces to Users:** The client application shall NEVER display raw technical stack traces, database schema details, or third-party error dumps to end-users.
2. **Actionable Correction:** Every user-facing error message must tell the user: (a) what happened in plain language, and (b) what specific action they should take next.
3. **Structured Diagnostics:** Server-side logs must capture technical diagnostics with correlation IDs while guaranteeing zero exposure of biometric facial data.

---

### 2. Standardized Error Taxonomy Table

| Error Code | Error Category | User-Facing Display Message | Developer Diagnostic / Cause | Retryable? | Log Level | Security Action |
|---|---|---|---|---|---|---|
| **ERR-AUTH-001** | `AUTH_ERROR` | "Invalid email or password. Please try again." | Invalid password hash comparison in Supabase Auth. | Yes | WARN | Increment failed login attempt counter. |
| **ERR-AUTH-002** | `AUTH_ERROR` | "Your session has expired. Please sign in again." | Expired JWT and refresh token revocation. | Yes | INFO | Invalidate local storage session. |
| **ERR-AUTH-003** | `AUTHORIZATION_ERROR`| "You do not have permission to view this resource." | `auth.uid()` does not match requested resource ownership. | No | WARN | Log security audit event; check IP. |
| **ERR-CONS-001** | `CONSENT_ERROR` | "Biometric processing consent is required to scan your face." | User attempted capture without active consent record. | Yes | INFO | Block capture endpoint. |
| **ERR-CAM-001** | `CAMERA_ERROR` | "Camera access was denied. Please enable camera permissions in your browser settings." | `NotAllowedError` thrown by MediaDevices API. | Yes | INFO | Display browser permission guide. |
| **ERR-CAM-002** | `CAMERA_ERROR` | "Camera not found. Please connect a webcam or camera device." | `NotFoundError` thrown by MediaDevices API. | Yes | WARN | Offer manual image upload alternative. |
| **ERR-CAP-001** | `CAPTURE_QUALITY_ERROR`| "Lighting is too low. Move to a well-lit area facing a natural light source." | Frame ROI mean luminance $< 80$. | Yes | DEBUG | None. |
| **ERR-CAP-002** | `CAPTURE_QUALITY_ERROR`| "Image is blurry. Please hold steady while capturing." | Frame Laplacian variance $< \tau_{blur}$. | Yes | DEBUG | None. |
| **ERR-CAP-003** | `CAPTURE_QUALITY_ERROR`| "Multiple faces detected. Ensure only one person is in the frame." | Face mesh detector identified $> 1$ face. | Yes | DEBUG | None. |
| **ERR-UPL-001** | `UPLOAD_ERROR` | "Unable to upload your capture. Please check your internet connection." | S3/Storage upload timeout or 5xx response. | Yes | ERROR | Retry upload with backoff (max 3x). |
| **ERR-FUS-001** | `FUSION_ERROR` | "Mixed evidence detected across your inputs. Your result is presented with cautious confidence." | Inter-modality agreement $A < 0.60$. | Yes | INFO | Present Low Agreement advisory card. |
| **ERR-KNOW-001**| `KNOWLEDGE_ERROR` | "Specific classical citations are currently unavailable. General Ayurvedic guidance has been provided." | `pgvector` similarity search returned 0 matches $\ge 0.75$. | No | WARN | Fall back to vetted core principles. |
| **ERR-AI-001** | `AI_INFERENCE_ERROR` | "We encountered an issue generating your detailed guidance. Our team has been notified." | OpenAI API timeout or rate-limit HTTP 429. | Yes | ERROR | Alert on-call SRE if rate $> 2\%$. |
| **ERR-RATE-001**| `RATE_LIMIT_ERROR` | "You have reached the maximum number of scans for this hour. Please try again shortly." | User exceeded 5 analyses per hour threshold. | No | WARN | Enforce HTTP 429 with `Retry-After`. |
| **ERR-NET-001** | `NETWORK_ERROR` | "Network connection lost. Please check your internet." | Client-side network offline event. | Yes | INFO | Cache form progress in local storage. |
