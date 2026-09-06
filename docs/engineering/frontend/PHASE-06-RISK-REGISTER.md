# AayurFace — Risk Management Registry
## Phase 06 Frontend Architecture & UX Risk Register

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Date:** 2026-09-03  
**Status:** ACTIVE RISK REGISTER  
**Authority:** Risk Analyst, Staff UX Engineer, Frontend Security Architect  

---

## 1. Frontend Risk Register

| Risk ID | Risk Description | Pre-Mitigation Score (Sev $\times$ Prob) | Mitigation Controls Specified in Phase 06 | Post-Mitigation Score (Sev $\times$ Prob) | Status |
|---|---|---|---|---|---|
| **RSK-FE-01** | **Camera Permission Denial Drop-Off:** Users deny camera access and abandon the application entirely. | $4 \times 4 = 16$ (High) | • Pre-permission educational dialog explaining why camera is needed.<br/>• Seamless "Upload Photo" fallback workflow. | $3 \times 1 = 3$ (Low) | **MITIGATED IN DESIGN** |
| **RSK-FE-02** | **Main Thread Jank During Mesh Tracking:** MediaPipe 468-point Wasm landmarking drops UI frame rates on low-end Android devices. | $4 \times 3 = 12$ (Moderate) | • Dedicated Web Worker execution (`ADR-FE-009`).<br/>• Transferable Objects for zero-copy frame passing. | $2 \times 1 = 2$ (Low) | **MITIGATED IN DESIGN** |
| **RSK-FE-03** | **Unsafe AI Markdown / XSS Injection:** Malicious HTML in classical quotes or LLM chat turns executes script injection. | $5 \times 3 = 15$ (High) | • DOMPurify sanitization on all markdown outputs.<br/>• Strict Content Security Policy (`ADR-FE-014`). | $5 \times 1 = 5$ (Low) | **MITIGATED IN DESIGN** |
| **RSK-FE-04** | **Stale Polling Loop After Tab Closure:** Browser tabs left open in background poll `/status` indefinitely, wasting serverless invocations. | $3 \times 3 = 9$ (Moderate) | • TanStack Query window focus and visibility event listeners pause polling when tab is inactive. | $2 \times 1 = 2$ (Low) | **MITIGATED IN DESIGN** |
| **RSK-FE-05** | **User Anxiety from Inconclusive Signals:** Clashing modalities ($A < 0.60$) produce confusing or contradictory recommendations. | $4 \times 3 = 12$ (Moderate) | • Low-Agreement Protocol transparently explaining the divergence and offering dual-balancing gentle guidance. | $3 \times 1 = 3$ (Low) | **MITIGATED IN DESIGN** |
| **RSK-FE-06** | **Inaccessible Contrast Ratios on Muted Gold/Sage:** Low contrast text fails WCAG 2.2 AA on mobile devices in bright sunlight. | $4 \times 3 = 12$ (Moderate) | • Enforced dark charcoal text on cream backgrounds ($>4.5:1$).<br/>• Restrained gold used strictly for non-text borders/accents. | $2 \times 1 = 2$ (Low) | **MITIGATED IN DESIGN** |
