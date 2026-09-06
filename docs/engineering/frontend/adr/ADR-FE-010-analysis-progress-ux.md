# ADR-FE-010: Honest Stage-Based Analysis Polling

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Context:**  
Fabricating a fake 0–100% progress timer creates false certainty and frustrates users when backend AI processing experiences transient delays.

**Decision:**  
The analysis waiting screen reflects the **Actual Backend Processing Stage** returned by `GET /api/v1/analyses/:id/status`, polled at 1.5-second intervals via TanStack Query.

**Consequences:**  
* Builds user trust through transparent, non-deceptive UI state progression.
* Handles timeouts and background navigation gracefully.

**Truth Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`
