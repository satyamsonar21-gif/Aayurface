# Architecture Decision Record: ADR-002
## Frontend Stack Architecture: React & Vite Single-Page Application (SPA)

**Status:** ACCEPTED WITH OPEN DECISION (DEC-001)  
**Date:** 2026-09-03  
**Deciders:** Staff Frontend Architect, Principal Software Architect  
**Technical Area:** Client Framework & Build Toolchain  

---

### 1. Context
The repository currently utilizes `react@^19.2.8`, `react-dom@^19.2.8`, `vite@^8.2.0`, and `tailwindcss@^4.3.3`. A speculative recommendation in Phase 01 suggested downgrading to React 18 LTS due to presumed ecosystem incompatibility. In Phase 01-C, this was reclassified as Open Decision DEC-001.

### 2. Problem
Determine whether to maintain the current React 19.2.8 toolchain or execute a planned downgrade to React 18 LTS, and whether to preserve the Vite SPA architecture or migrate to a server-rendered framework like Next.js.

### 3. Options Evaluated
* **Option A: Retain React 19.2.8 + Vite v8 (Conditionally Selected):** Keep the modern React compiler foundation; verify prospective package compatibility (MediaPipe, Recharts, React-PDF) during Milestone 01.
* **Option B: Downgrade to React 18 LTS + Vite:** Revert `package.json` to React 18 LTS to guarantee legacy package peer-dependency satisfaction.
* **Option C: Migrate to Next.js App Router:** Complete rewrite to full-stack Next.js with Server-Side Rendering (SSR).

### 4. Decision
1. **Retain the Vite SPA Architecture:** Reject Next.js. AayurFace is a client-heavy, interactive camera application that gains minimal value from server-side rendering but would suffer from high rewrite risk and vendor lock-in.
2. **Conditionally Retain React 19.2.8 (DEC-001):** Keep React 19.2.8 in `package.json` through Milestone 01. Execute a formal toolchain compatibility check against `@mediapipe/face_mesh`, `recharts`, and `@react-pdf/renderer`. If blocking peer-dependency errors cannot be cleanly resolved, execute an immediate controlled downgrade to React 18.3.x.

### 5. Rationale
`npx vite build` currently executes cleanly in 2.54 seconds, producing an optimized 261 kB JS bundle. Downgrading preemptively without empirical peer-dependency conflict evidence introduces unnecessary churn and regresses the project to older React compiler paradigms.

### 6. Consequences
* *Positive:* Zero migration downtime, modern compiler performance, fast HMR in Vite v8.
* *Negative:* Requires careful dependency audit when adding prospective visualization and PDF libraries.

### 7. Risks & Mitigations
* *Risk:* Third-party library fails under React 19.
* *Mitigation:* Pin dependencies; execute downgrade to React 18 LTS during Milestone 01 if blockers emerge.

### 8. Evidence
`package.json` inspection; successful `npx vite build` execution in 2.54s with zero React runtime errors.

### 9. Revisit Conditions
Revisit immediately if npm install of MediaPipe or Recharts generates unresolvable React 19 peer-dependency blocking errors during Milestone 01.
