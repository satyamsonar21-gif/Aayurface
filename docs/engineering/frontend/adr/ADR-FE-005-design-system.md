# ADR-FE-005: Design System Token Architecture via Tailwind CSS v4

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Context:**  
Maintaining visual consistency and preventing "AI-generated template" appearance requires a strictly governed, semantic token architecture mapped directly to CSS variables.

**Decision:**  
We implement a **Semantic Design Token Architecture** using **Tailwind CSS v4 `@theme` variables**, strictly banning un-tokenized arbitrary CSS and hardcoded colors.

**Consequences:**  
* 100% centralized color, spacing, radius, and elevation governance.
* Enforced via automated linter rules in CI.

**Truth Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`
