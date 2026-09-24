# Phase 13 Citation Binding & Provenance Architecture
**Domain:** Verifiable Citation Mapping, Hallucination Prevention & Auditability  
**Standard:** Forensic • Adversarial • Production-Grade  
**Date:** September 2026  

---

## 1. Citation Binding Invariants

1. **Retrieved-Only Citation Rule:** A generated statement may only cite an `evidenceId` that was legitimately retrieved during the current request's retrieval step.
2. **Zero Tolerance for Hallucinated Citations:** If an LLM hallucinates an arbitrary or non-existent citation ID (e.g. `ev-phantom-999`), the post-generation validator rejects the response and triggers fallback.
3. **Bibliographical Traceability:** Every user-facing citation must present full coordinates:
   - Primary Work Title (e.g. *Ashtanga Hridaya*, *Charaka Samhita*, *Sushruta Samhita*)
   - Sthana (e.g. *Sutrasthana*, *Sharirasthana*)
   - Chapter & Adhyaya Title
   - Verse Number (where verified in classical critical editions)
   - Original Page Number
   - Authority Tier (`TIER_1_CLASSICAL_PRIMARY` through `TIER_4_PROJECT_RESEARCH`)
   - Verification Status (`VERIFIED`)

---

## 2. Citation Binding Pipeline

```text
GENERATED CLAIMS
       │
       ▼
[bindCitationsToClaims]
       │
       ├── Cited ID in Retrieved Evidence? ──► YES ──► BIND CITATION & MARK SUPPORTED
       │
       └── Cited ID Missing or Phantom?   ──► NO  ──► REJECT CITATION & MARK UNSUPPORTED
                                                      (Flag hallucination & Trigger Fallback)
```

---

## 3. Claim Support Status Taxonomy

- `SUPPORTED`: Claim is directly corroborated by one or more retrieved verified evidence items.
- `PARTIALLY_SUPPORTED`: Contextual inference aligns with evidence, but certain nuances require qualification.
- `CONFLICTING`: Retrieved classical sources offer diverging views on the topic.
- `INSUFFICIENT_EVIDENCE`: Available retrieved text is too sparse to substantiate the statement.
- `UNSUPPORTED`: Claim lacks retrieved evidence or cited a non-existent citation ID. (Excluded from user payloads).
