# ADR-FE-011: Transparent AI Uncertainty & Low-Agreement Presentation

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Context:**  
AI models frequently exhibit overconfidence. When multimodal signals clash (e.g. face scan indicates Pitta heat while quiz indicates Vata dryness), pretending high certainty degrades clinical credibility and user safety.

**Decision:**  
The UI transparently surfaces calibrated confidence tiers (High, Moderate, Low) and triggers the **Low-Agreement Protocol** ($A < 0.60$), capping confidence $<60\%$ and suppressing generative herbal formulations in favor of safe standard lifestyle guidance.

**Consequences:**  
* Communicates scientific honesty without causing anxiety.
* Protects user safety by eliminating risky herbal recommendations during signal divergence.

**Truth Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`
