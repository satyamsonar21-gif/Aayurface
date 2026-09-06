# AayurFace — Observability Specification
## Privacy-Safe Frontend Telemetry, Error Tracking & Event Schema

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Domain:** Frontend Observability & RUM  
**Status:** `TARGET OBSERVABILITY SPECIFICATION`  
**Authority:** Platform/SRE Architect, Security Architect  

---

## 1. Privacy-Safe Telemetry Event Schema

Every analytics event emitted to telemetry pipelines follows a strict, PII-scrubbed schema:

```typescript
export interface FrontendTelemetryEvent {
  eventName: 
    | 'screen_view'
    | 'capture_session_started'
    | 'capture_quality_passed'
    | 'capture_quality_failed'
    | 'analysis_orchestrated'
    | 'analysis_polling_completed'
    | 'recommendation_adopted'
    | 'routine_habit_checked'
    | 'report_downloaded'
    | 'share_link_generated'
    | 'error_boundary_triggered';
  properties: {
    screenName: string;
    correlationId: string;
    durationMs?: number;
    failureReason?: string; // High-level enum only
  };
  clientContext: {
    viewportWidth: number;
    language: string;
    deviceType: 'MOBILE' | 'TABLET' | 'DESKTOP';
  };
}
```

---

## 2. Absolute Telemetry Logging Prohibitions

Loggers and error reporting tools (e.g. Sentry) are strictly configured with client-side before-send filters to drop:
1. Base64 images, raw video frames, or facial mesh coordinate arrays.
2. User email addresses, full names, or plain passwords.
3. JWT authorization tokens or private S3 signed URL query parameters.
4. Voice audio arrays or full verbatim chat transcripts containing private health queries.
