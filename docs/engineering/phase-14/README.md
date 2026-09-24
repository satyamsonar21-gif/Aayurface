# Phase 14: Personalization & Recommendation Intelligence Engine

Welcome to the engineering documentation directory for **Phase 14** of AayurFace.

## Directory Contents

| Document | Purpose |
| :--- | :--- |
| [PHASE-14-FORENSIC-CLOSURE-REPORT.md](./PHASE-14-FORENSIC-CLOSURE-REPORT.md) | Independent forensic verification report covering all 19 audit sections, adversarial tests, and closure gate verdict. |
| [PHASE-14-FINAL-REPORT.md](./PHASE-14-FINAL-REPORT.md) | Comprehensive engineering closure report, architecture audit, test matrix, and verification ledger. |
| [ADR-023-TO-028.md](./ADR-023-TO-028.md) | Architectural Decision Records ADR-023 through ADR-028 governing rule determinism, evidence gating, confidence ceilings, patch test invariants, user exclusions, and audit traceability. |

## Quick Verification

```bash
# Run the complete test suite (238 tests across 14 files)
npx vitest run

# Run Phase 14 tests in isolation (37 tests)
npx vitest run src/lib/personalization/personalization.test.ts

# Run production build check
npm run build

# Run linting check
npm run lint
```
