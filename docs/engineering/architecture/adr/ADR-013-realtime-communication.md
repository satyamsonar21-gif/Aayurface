# Architecture Decision Record: ADR-013
## Realtime Status Communication: Supabase Realtime Channels with Automated Polling Fallback

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Deciders:** Staff Frontend Architect, Staff Backend Architect, Platform/SRE Architect  
**Technical Area:** Client-Server State Synchronization  

---

### 1. Context
During the 8 to 25 second asynchronous analysis pipeline, the frontend must display granular progress updates to the user (e.g., "Analyzing facial redness...", "Querying classical texts...", "Balancing Tridosha...").

### 2. Problem
Selecting a real-time event communication mechanism that provides instant updates without creating high database polling load, while remaining resilient when mobile connections drop.

### 3. Options Evaluated
* **Option A: Aggressive Client HTTP Polling:** Client sends `GET /analysis/:id` every 1,000ms.
* **Option B: Server-Sent Events (SSE):** One-way streaming over HTTP connection.
* **Option C: Supabase Realtime Channels with Automated Polling Fallback (Selected):** WebSocket connection subscribing to database Change Data Capture (CDC) events, falling back to 5-second polling if disconnected.

### 4. Decision
Adopt **Option C: Supabase Realtime Channels with Automated Polling Fallback**.
* The client subscribes to a scoped Supabase Realtime channel (`analysis:${analysisId}`).
* As the backend Edge Function updates the `stage` column in `scan_results`, PostgreSQL pushes the change to the client in real time.
* If the WebSocket drops for $\ge 8$ seconds, the client activates an automated polling fallback (`GET /api/v1/analysis/:id` every 5 seconds).

### 5. Rationale
* **Zero Additional Server:** Leverages the existing Supabase infrastructure without needing dedicated WebSocket servers.
* **Reduced Database Load:** Eliminates thousands of redundant polling queries during normal operations.
* **Mobile Robustness:** Polling fallback guarantees that even if cellular handoffs drop the WebSocket, the analysis still completes visually for the user.

### 6. Consequences
* *Positive:* Fluid, responsive UI animations, minimal server load, automatic recovery on mobile networks.
* *Negative:* Realtime channels consume concurrent connection quotas on Supabase free/pro tiers.

### 7. Risks & Mitigations
* *Risk:* Concurrent connection exhaustion during traffic spikes.
* *Mitigation:* Client unbinds and terminates channel subscription immediately upon transitioning to `COMPLETED` or `FAILED`.

### 8. Evidence
Phase 00 reconnaissance confirmed Supabase Realtime is functional in the target environment.

### 9. Revisit Conditions
Revisit if concurrent active users streaming scans exceed 10,000 simultaneous connections.
