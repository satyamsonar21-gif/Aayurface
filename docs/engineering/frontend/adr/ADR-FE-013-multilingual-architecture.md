# ADR-FE-013: Multilingual Localization & Sanskrit Typography

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Context:**  
AayurFace serves English and Hindi users while authentically presenting classical Ayurvedic verses in Sanskrit (Devanagari script + IAST transliteration).

**Decision:**  
We implement a **3-Tier Localization Strategy** supporting English (`en`), Hindi (`hi`), and Sanskrit (`sa` for classical verses), backed by `i18next` and dedicated font fallback stacks.

**Consequences:**  
* Guarantees accurate rendering of Devanagari ligatures and conjuncts.
* Enables seamless user switching with language persistence.

**Truth Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`
