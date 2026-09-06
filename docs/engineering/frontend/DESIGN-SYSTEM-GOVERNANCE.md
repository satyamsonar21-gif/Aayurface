# AayurFace — Design System Specification
## Design System Governance, Token Enforcement & Anti-AI-Look Rules

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Date:** 2026-09-03  
**Status:** AUTHORITATIVE GOVERNANCE STANDARD  
**Authority:** Design Systems Architect, QA Architect  

---

## 1. Zero Hardcoded CSS Rule

* **Enforcement:** Components must **never** use arbitrary Tailwind values (e.g. `bg-[#123456]` or `p-[13px]`) or inline `style={{ ... }}` blocks for colors, typography, or spacing.
* **Semantic Token Exclusivity:** All layout and styling must strictly reference pre-compiled design system tokens (`bg-brand-primary`, `text-text-primary`, `p-space-4`).
* **Automated Linter Rule:** An Oxlint / Stylelint rule will fail CI builds if un-tokenized hex colors or arbitrary pixel values are detected in `src/components/` or `src/features/`.

---

## 2. Token Ownership & Versioning Lifecycle

1. **Token Ownership:** Design tokens are owned exclusively by the Design Systems Architect under `src/tokens/`.
2. **Breaking Token Changes:** Modifying existing token keys requires an ADR and a phased component migration.
3. **Additive Tokens:** New semantic aliases may be added in minor patches without breaking downstream components.
