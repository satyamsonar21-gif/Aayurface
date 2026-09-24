# Phase 13 Explainable AI (XAI) Contract Architecture
**Domain:** Transparent Reasoning, Multi-Modality Traceability & Negative Boundaries  
**Standard:** Forensic • Adversarial • Production-Grade  
**Date:** September 2026  

---

## 1. The Seven Core Explainability Questions

In accordance with `docs/engineering/api/EXPLAINABILITY-CONTRACT.md`, every analysis and grounded explanation produced by AayurFace must answer seven transparent questions:

1. **What was observed?**
   - Standardized physical signals from Phase 10 computer vision (surface hue, texture uniformity, shine, dryness-like appearance).
2. **What user context was provided?**
   - User-reported skin baseline, self-reported Prakriti context, and lifestyle factors (hydration, sleep).
3. **Which modality contributed and what fusion state exists?**
   - Phase 12 Multimodal Fusion results (`interpretationState`, qualitative `evidenceStrength`, `conflictState`, harmonic agreement).
4. **What evidence supports it?**
   - Retrieved classical Brihat-Trayi shlokas and verified botanical research items.
5. **Where does evidence agree or conflict?**
   - Clear articulation of congruence across modalities and structured divergence notes between classical sources.
6. **What scientific limitations exist?**
   - Ambient lighting variance, consumer camera sensor noise, and the inherent subjectivity of self-reported questionnaires.
7. **What does the result NOT mean?**
   - Explicit negative medical boundaries: **NOT** a disease diagnosis, **NOT** a face-to-Dosha diagnosis, and **NOT** a medical prescription.

---

## 2. Prohibition of Chain-of-Thought Leakage

- Explanations are anchored strictly around **structured evidence** and **modality contributions**.
- The system **NEVER** exposes internal system prompts, developer instructions, or fabricated "AI thought processes" to users.
- Explanations use simple, warm, non-clinical language suitable for consumer wellness while maintaining rigorous citation traceability.
