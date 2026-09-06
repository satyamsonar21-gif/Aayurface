# AayurFace — Engineering Reconnaissance Audit
## Document 03: Build & Runtime Verification Report

**Phase:** Phase 00 — Full Repository & System Reconnaissance  
**Date:** 2026-09-03  
**Auditor:** QA Engineer & DevOps/SRE Engineer  
**Status:** FORENSIC EVIDENCE COLLECTED — DEFECTS CONFIRMED  

---

### 1. Build Verification

#### A. Standard Production Build (`npm run build`)
* **Command:** `npm run build` (`tsc -b && vite build`)
* **Result:** **FAILED** (Exit code 1)
* **Execution Duration:** ~8.8 seconds
* **Compiler Output:**
  ```text
  > project-aayurface@0.0.0 build
  > tsc -b && vite build

  vite.config.ts(14,3): error TS2769: No overload matches this call.
    The last overload gave the following error.
      Object literal may only specify known properties, and 'test' does not exist in type 'UserConfigExport'.
  ```
* **Root Cause Analysis:**
  1. `vite.config.ts` includes a `test: { ... }` block for Vitest.
  2. `vite.config.ts` imports `defineConfig` from `'vite'` rather than `'vitest/config'`.
  3. `tsconfig.node.json` specifies `"types": ["node"]` without referencing Vitest types.
  4. Project reference compilation (`tsc -b`) strictly type-checks `vite.config.ts` and fails on the unrecognized `test` property.
* **Severity:** **CRITICAL** (Blocks CI/CD deployment pipelines).

#### B. Direct Bundler Execution (`npx vite build`)
* **Command:** `npx vite build`
* **Result:** **PASSED** (Exit code 0)
* **Execution Duration:** 2.54 seconds
* **Transformation Summary:** 2360 modules transformed.
* **Bundle Output:**
  * `dist/index.html`: 0.70 kB (gzip: 0.41 kB)
  * `dist/assets/index-D2vpN4Fb.css`: 43.41 kB (gzip: 8.05 kB)
  * `dist/assets/index-BBNkkXoo.js`: 261.39 kB (gzip: 82.68 kB)
  * Vendor chunks created for `lucide-react` (122 kB), `zod` (90 kB), and `mockData` (43 kB).
* **Observation:** The application successfully bundles when TypeScript project-reference checks are bypassed.

---

### 2. Test Suite Execution (`npm test`)

* **Command:** `npm test -- --run`
* **Result:** **PASSED** (Exit code 0)
* **Execution Duration:** 34.88 seconds (Environment initialization: 27.79s, test execution: 83ms)
* **Test Inventory:**
  * Test Files: 1 passed (`src/components/common/Logo.test.tsx`)
  * Tests: 2 passed
    1. `renders the Aayurface text by default` (PASSED)
    2. `hides the text when variant is icon-only` (PASSED)
* **Coverage Reality:**
  * Total unit tests in repository: **2**
  * Business logic covered: **0%**
  * Auth flows covered: **0%**
  * Quality gateway covered: **0%**
  * API / AI Edge functions covered: **0%**
  * RLS policies covered: **0%**

---

### 3. Static Code Analysis (`npm run lint`)

* **Command:** `npm run lint` (`oxlint`)
* **Result:** **PASSED WITH 6 WARNINGS** (Exit code 0)
* **Duration:** 124ms across 40 files
* **Detected Warnings:**
  1. `react-hooks(exhaustive-deps)` at `src/pages/app/LibraryPage.tsx:23`: `useMemo` has unnecessary dependency: `activeTab`.
  2. `react(only-export-components)` at `src/contexts/AuthContext.tsx:177`: Fast refresh warning on `export function useAuth()`.
  3. `eslint(no-unused-vars)` at `src/pages/public/RegisterPage.tsx:41`: Catch parameter `err` is caught but never used.
  4. `eslint(no-unused-vars)` at `src/pages/public/RegisterPage.tsx:54`: Catch parameter `err` is caught but never used.
  5. `eslint(no-unused-vars)` at `src/pages/public/LoginPage.tsx:35`: Catch parameter `err` is caught but never used.
  6. `eslint(no-unused-vars)` at `src/pages/public/LoginPage.tsx:48`: Catch parameter `err` is caught but never used.
* **Security & Reliability Concern:** In `LoginPage` and `RegisterPage`, genuine backend exceptions are discarded without logging or user explanation, presenting static generic fallback messages regardless of the actual failure cause.

---

### 4. Development Runtime Verification

* **Command:** `npx vite --port 5173 --host`
* **Status:** **OPERATIONAL** (Vite v8.2.1 ready in 735 ms)
* **HTTP Probe:** `curl.exe -I http://localhost:5173/` returned `HTTP/1.1 200 OK`.
* **Runtime Behavior Observations:**
  * Application loads properly in standard browser viewports.
  * Navigating across `/`, `/login`, `/register`, `/onboarding`, `/home`, `/library`, `/chat`, `/profile` functions in memory via client-side routing.
  * Critical runtime defects observed during flow simulation:
    1. **Auth state persistence:** Reloading the browser retains whatever mock user JSON was dumped into `localStorage`.
    2. **Scan capture button:** Pressing "Capture" triggers a 3-second animated spinner, captures no webcam frame, and routes to `/results/demo-scan`.
    3. **Results view:** Displays static Unsplash photo and hardcoded `MOCK_SCAN_RESULT`.
    4. **Remedy Detail view:** Navigating to `/library/:remedyId` always loads the first remedy in the mock list due to parameter mismatch (`:remedyId` vs `slug`).
    5. **Chat Assistant:** Responds only to keywords `oily`, `acne`, `routine` via client-side timeout; otherwise outputs a static generic message.
