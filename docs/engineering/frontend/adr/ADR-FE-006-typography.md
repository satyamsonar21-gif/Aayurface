# ADR-FE-006: Dual Typography Hierarchy (Cormorant Garamond + Manrope)

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Context:**  
The product aesthetic requires 50% luxury, 30% Ayurvedic character, and 20% modern technology. Current prototype fonts (`Playfair/Poppins`) do not meet the editorial luxury standard.

**Decision:**  
We standardize on **Cormorant Garamond** for editorial display titles and classical verses, paired with **Manrope** for clean application UI, forms, and data tables.

**Consequences:**  
* Delivers an authentic editorial luxury feel while ensuring high readability on mobile screens.
* Requires font preloading for `Cormorant Garamond` and `Manrope` to eliminate layout shift (CLS).

**Truth Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`
