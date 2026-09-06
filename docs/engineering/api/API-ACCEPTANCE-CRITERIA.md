# Quality Contract: API Acceptance Criteria
## Given / When / Then Behavior Specifications for Core Endpoints

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Quality Assurance & Contract Testing  
**Status:** `AUTHORITATIVE ACCEPTANCE CRITERIA (PLANNED TEST SPECIFICATIONS)`  
**Authority:** QA Architect, Principal Backend Architect  

---

## 1. AC-ANL-01: Asynchronous Analysis Orchestration

```gherkin
Scenario: Authenticated user with valid capture and consents initiates analysis
  Given the caller is an authenticated user with a valid Supabase JWT ("user-123")
  And "user-123" has active "FACIAL_BIOMETRIC_PROCESSING" and "WELLNESS_DATA_PROCESSING" consents
  And "user-123" owns an approved capture session ("cap-456") with image uploaded to S3
  And "user-123" has not exceeded the hourly rate limit of 5 scans
  When the user sends POST /api/v1/analyses with:
    """json
    {
      "captureSessionId": "cap-456"
    }
    """
  And the request includes header "Idempotency-Key: idem-789"
  Then the response status code must be 202 Accepted
  And the response body must contain "analysisId", "jobId", and "status": "QUEUED"
  And a row must be inserted into "analysis_jobs" with status "QUEUED"
  And zero OpenAI API keys or internal credentials must be exposed in the response
  And the operation must be traceable via "X-Request-ID"
```

---

## 2. AC-SEC-01: Cross-User Resource Access Defense (Anti-BOLA)

```gherkin
Scenario: User A attempts to view User B's completed analysis results
  Given User A is authenticated with JWT identity "user-A"
  And User B owns a completed analysis result with ID "anl-B-999"
  When User A sends GET /api/v1/analyses/anl-B-999
  Then the response status code must be 404 Not Found
  And the error code must be "RESOURCE_NOT_FOUND"
  And the response must not reveal whether "anl-B-999" exists
  And a security violation event must be logged to "security_audit_events"
```

---

## 3. AC-IDEM-01: Network Retry Idempotency Verification

```gherkin
Scenario: Client sends duplicate analysis request due to network timeout
  Given an analysis request with "Idempotency-Key: idem-dup-1" was already accepted (202 Accepted)
  When the client sends an identical POST /api/v1/analyses request within 120 seconds with the same Idempotency-Key
  Then the response status code must be 202 Accepted
  And the response header must contain "Idempotent-Replay: true"
  And exactly ONE background analysis job must exist in "analysis_jobs"
  And zero duplicate AI inference workflows must be dispatched
```
