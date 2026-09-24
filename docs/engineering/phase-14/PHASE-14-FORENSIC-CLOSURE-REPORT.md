# AayurFace — Phase 14 Forensic Closure Audit Report

**Phase:** Phase 14 — Personalization & Recommendation Intelligence Engine  
**Execution Standard:** Forensic • Evidence-First • Principal/Staff Engineering Audit  
**Date:** September 2026  
**Auditor:** Principal AI Systems Architect & Adversarial Safety Auditor  
**Repository:** `d:\Project Aayurface`  
**Verdict:** **`PASS`**  

---

## 1. Scope

This audit performs an independent, evidence-first forensic verification of the implemented Phase 14 Personalization & Recommendation Intelligence Engine. The verification confirms that:
1. No raw facial computer-vision observation directly produces a constitutional Dosha diagnosis or triggers Dosha-specific botanical recommendations.
2. Skin-type inputs originate solely from self-reported, structured user profile baselines and are never converted into clinical dermatological diagnoses.
3. Upstream Phase 12 fusion evidence strength acts as an unbreachable confidence ceiling (`CONFIDENCE_CEILING_MAP`).
4. `BASELINE_ONLY` gating safely returns zero personalized recommendations when upstream evidence is missing, conflicting, or below threshold.
5. All botanical recommendations carry verified classical Shastric provenance or explicit project safety tiering without bibliographic fabrication.
6. The "mandatory patch test" requirement is correctly characterized as an application safety policy grounded in Tier 4 Project Research rather than an unsubstantiated classical sloka claim.
7. The engine withstands adversarial vectors, prompt injection, forged evidence, and safety-override attempts.
8. State handling is non-persistent and local to the client session.
9. Recommendation generation is purely functional and deterministic.
10. All 14 test suites (253 tests total, including 52 Phase 14 tests) pass with zero regressions.

---

## 2. Files Inspected

The following repository files were inspected line-by-line during this audit:

| File Path | Lines | Forensic Responsibility |
| :--- | :--- | :--- |
| `src/types/personalization.ts` | 196 | Domain contracts, eligibility states, decision trace types |
| `src/lib/personalization/constants.ts` | 81 | Version tags, safety boundaries, confidence ceiling mappings |
| `src/lib/personalization/eligibilityGate.ts` | 165 | Pre-recommendation gating, conflict checks, strength thresholds |
| `src/lib/personalization/ingredientKnowledge.ts` | 182 | Classical botanical catalog, dosha mappings, provenance tags |
| `src/lib/personalization/recommendationEngine.ts` | 825 | 7 deterministic rules, exclusion engine, priority sorter |
| `src/lib/personalization/personalizationService.ts` | 383 | Master orchestrator, audit trace compiler, RAG citation binder |
| `src/lib/personalization/personalization.test.ts` | 895 | 52 automated unit, integration, and adversarial tests |
| `src/lib/personalization/index.ts` | 11 | Public module export surface |
| `src/lib/assessmentStore.ts` | 315 | Pipeline integration linking CV (P10), Ayur (P11), Fusion (P12), Rec (P14) |
| `src/pages/app/ResultsPage.tsx` | 510 | Presentation tier rendering Phase 14 Personalization Engine card |
| `src/pages/app/ScanPage.tsx` | 181 | Capture pipeline verifying origin of `dosha` and `skin_type` inputs |
| `src/lib/rag/corpusData.ts` | 324 | Verified classical chunks and bibliographic metadata |
| `src/types/cv.ts` | 140 | Verification that `skinFeaturesExtension` is strictly `null` |
| `src/types/fusion.ts` | 212 | Fusion evidence, conflict, and safety boundary contracts |

---

## 3. Contracts Inspected

1. **`CVResult` (`src/types/cv.ts#L108-L140`):**
   - Confirms that Phase 10 establishes only frame quality, sharpness, illumination, pose, and face readiness.
   - `skinFeaturesExtension?: null` confirms that no computer vision algorithm performs skin feature segmentation or constitutional typing.
2. **`FusionResult` (`src/types/fusion.ts#L125-L165`):**
   - `evidenceStrength: 'NONE' | 'LOW' | 'MODERATE' | 'HIGH'`
   - `conflictState: 'NO_CONFLICT' | 'MINOR_CONFLICT' | 'MATERIAL_CONFLICT' | 'UNRESOLVED_CONFLICT'`
   - `safetyBoundaries.preventsDoshaDiagnosisFromFace: true`
   - `safetyBoundaries.preventsPrakritiInferenceFromFace: true`
3. **`EvidenceEligibilityGate` (`src/types/personalization.ts#L22-L35`):**
   - Gating statuses: `'ELIGIBLE' | 'INSUFFICIENT_STRENGTH' | 'CONFLICTING_EVIDENCE' | 'MISSING_UPSTREAM' | 'SAFETY_BLOCKED' | 'USER_EXCLUDED'`
4. **`PersonalizationResult` (`src/types/personalization.ts#L162-L196`):**
   - Implements immutable safety boundaries:
     - `isNonDiagnostic: true`
     - `preventsDoshaDiagnosisFromFace: true`
     - `preventsPrakritiInferenceFromFace: true`
     - `allIngredientsRequirePatchTest: true`
     - `noGuaranteedCures: true`
     - `noPrescriptionDrugs: true`

---

## 4. Rules Inspected

The 7 rules implemented in `src/lib/personalization/recommendationEngine.ts` were audited:

| Rule ID | Rule Name | Category | Priority | Trigger Condition | Output Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`P14-RULE-001`** | Dosha-Aligned Topical Botanical | `TOPICAL_BOTANICAL` | `PRIMARY` | Valid user-reported Dosha (`vata`, `pitta`, `kapha`) **AND** fusion evidence strength $\ge$ `LOW` | Produces classical Lepa formulation (Chandana for Pitta, Tila for Vata, Nimba for Kapha) with ceiling-bound confidence. |
| **`P14-RULE-002`** | Universal Patch Test Mandatory Safety Notice | `TOPICAL_BOTANICAL` | `SUPPLEMENTARY` | `true` (Unconditional, always fires) | Enforces 24-hour patch test protocol (`Twak Pariksha Vidhi`) before any topical application. Confidence: `HIGH_CONFIDENCE`. |
| **`P14-RULE-003`** | Constitutional Hydration Guidance | `HYDRATION_GUIDANCE` | `SECONDARY` | User reported hydration data **OR** user reported Dosha | Delivers non-chilled constitutional fluid guidance (cooling mint/cucumber for Pitta, warm CCF tea for Vata, warm lemon/ginger for Kapha). |
| **`P14-RULE-004`** | Stress-Aware Nervous System Balancing | `STRESS_MANAGEMENT` | `SECONDARY` | User reported stress is `Elevated` or `Moderate` | Recommends `Nadi Shodhana Pranayama` (alternate nostril breathing) to soothe sympathetic tone and protect barrier lipid synthesis. |
| **`P14-RULE-005`** | Circadian Sleep Optimization | `SLEEP_HYGIENE` | `SECONDARY` | User reported sleep is `<6 hrs` | Recommends `Pada Abhyanga` (sole massage with warm oil) to anchor restless Vata and support nocturnal cellular skin recovery. |
| **`P14-RULE-006`** | Seasonal Climatic Adjustment | `SEASONAL_ADJUSTMENT` | `SUPPLEMENTARY` | User reported climate context present | Provides environmental barrier protection (lipid shielding against cold/dry air, light hydrosols in heat/humidity). |
| **`P14-RULE-007`** | Skin-Type Calibrated Daily Dinacharya | `DINACHARYA_ROUTINE` | `PRIMARY` | Valid user-reported skin type (`dry`, `oily`, `combination`, `sensitive`, `normal`) | Calibrates daily cleansing and moisturizing rhythm without clinical disease terminology. |

---

## 5. Citation Verification & Ingredient Provenance

Every ingredient in `src/lib/personalization/ingredientKnowledge.ts` was audited against the repository corpus (`data/books/` and `src/lib/rag/corpusData.ts`). Bibliographic statuses are strictly distinguished below:

| Ingredient | Canonical ID | Source ID | Classical Book | Sthana / Section | Chapter | Verse / Pages | Authority Tier | Verification Status | Phase 13 Chunk ID |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Sandalwood** (*Santalum album*) | `chandana` | `SRC-BP-NIG` | *Bhavaprakasha Nighantu* | Dravyaguna | Karpuradi Varga | Verses 11–13, p. 192 | `TIER_2_SCHOLARLY_TRANSLATION` | **`VERIFIED`** | `chk-doc-bp-dravya-192-238` |
| **Aloe Vera** (*Aloe barbadensis*) | `kumari` | `SRC-BP-NIG` | *Bhavaprakasha Nighantu* | Dravyaguna | Guduchyadi Varga | Verses 63–65, p. 228 | `TIER_2_SCHOLARLY_TRANSLATION` | **`VERIFIED`** | `chk-doc-bp-dravya-228-254` |
| **Neem** (*Azadirachta indica*) | `nimba` | `SRC-BP-NIG` | *Bhavaprakasha Nighantu* | Dravyaguna | Guduchyadi Varga | Verses 8–10, p. 235 | `TIER_2_SCHOLARLY_TRANSLATION` | **`VERIFIED`** | `chk-doc-bp-dravya-235-270` |
| **Turmeric** (*Curcuma longa*) | `haridra` | `SRC-CS-MAR` | *Charaka Samhita* | Sutrasthana | Chapter 4 (Varnya) | Classical Granthavali | `TIER_1_CLASSICAL_PRIMARY` | **`CURATED / METADATA-ONLY`** | *Not ingested in initial 10 chunks* |
| **Rose Water** (*Rosa damascena*) | `gulab-jal` | `SRC-PROJ-RES` | *AayurFace Topical Safety* | Section 1 | Topical Safety | p. 1 | `TIER_4_PROJECT_RESEARCH` | **`VERIFIED`** | `DOC-PROJ-SAFE` |
| **Sesame Oil** (*Sesamum indicum*) | `tila-taila` | `SRC-CS-MAR` | *Charaka Samhita* | Sutrasthana | Chapter 5 (Matrashitiya) | Classical Granthavali | `TIER_1_CLASSICAL_PRIMARY` | **`CURATED / METADATA-ONLY`** | *Not ingested in initial 10 chunks* |
| **Raw Honey** | `madhu` | `SRC-AH-MAR` | *Ashtanga Hridaya* | Sutrasthana | Chapter 5 (Dravadravya) | Classical Granthavali | `TIER_1_CLASSICAL_PRIMARY` | **`CURATED / METADATA-ONLY`** | *Not ingested in initial 10 chunks* |

**Audit Findings on Citations:**
- `chandana`, `kumari`, `nimba`, and `gulab-jal` have verified chunks directly in Phase 13 `corpusData.ts`.
- `haridra`, `tila-taila`, and `madhu` are authentic classical references documented in the catalog, but are properly classified as **`CURATED / METADATA-ONLY`** because their full text chunks have not yet been vectorized into the initial 10-chunk test corpus. No citations were fabricated for them.

---

## 6. Safety Verification & Patch-Test Claim

### Audit of P14-RULE-002 ("Mandatory Patch Test")
- **Claim Analysis:** The requirement for a mandatory 24-hour patch test behind the ear or on the inner forearm (`Twak Pariksha Vidhi`) is **Option A: An application safety policy grounded in modern dermatological and project research safety protocols (`TIER_4_PROJECT_RESEARCH`)**.
- **Classical Text Grounding:** While classical Ayurveda emphasizes *Satmya-Asatmya* (individual compatibility) and *Upashaya-Anupashaya* (diagnostic trial), the specific procedure of a 24-hour occlusive/semi-occlusive patch test behind the ear is a modern clinical standard.
- **Implementation Audit:** In `recommendationEngine.ts#L284-L286` and `corpusData.ts#L285-L298` (Chunk 9), the patch test protocol is explicitly bound to `sourceId: 'SRC-PROJ-RES'` and `authorityTier: 'TIER_4_PROJECT_RESEARCH'`. The code **does not** claim it is a literal verse from the *Brihat-Trayi*. This satisfies epistemic honesty requirements.

---

## 7. Confidence Verification & Ceiling Inheritance

We tested all four Phase 12 evidence strength levels and all conflict states:

```
Upstream Phase 12 Evidence Strength  ───>  Phase 14 Recommendation Confidence
─────────────────────────────────────────────────────────────────────────────
NONE                                  ───>  BASELINE_ONLY (0 recommendations generated)
LOW                                   ───>  LOW_CONFIDENCE
MODERATE                              ───>  MODERATE_CONFIDENCE
HIGH                                  ───>  HIGH_CONFIDENCE
```

### Forensic Code Inspection
- `src/lib/personalization/constants.ts#L75-L80`: `CONFIDENCE_CEILING_MAP` is a compile-time frozen map.
- `src/lib/personalization/eligibilityGate.ts#L107-L114`: If `evidenceStrength === 'NONE'`, gate rejects with `INSUFFICIENT_STRENGTH`.
- `src/lib/personalization/eligibilityGate.ts#L116-L128`: If `conflictState` is `MATERIAL_CONFLICT` or `UNRESOLVED_CONFLICT`, gate rejects with `CONFLICTING_EVIDENCE`.
- `src/lib/personalization/personalizationService.ts#L312-L318`: `overallConfidence` is computed strictly via `applyConfidenceCeiling(upstreamEvidenceStrength)`. It is mathematically impossible for Phase 14 to elevate a `LOW` upstream signal into `MODERATE_CONFIDENCE` or `HIGH_CONFIDENCE`.

---

## 8. Adversarial Testing Matrix (P14-ADV-001 through P14-ADV-011)

All 11 explicit adversarial test cases were executed and passed:

| Test ID | Adversarial Vector Tested | Expected Defense Behavior | Result | Evidence |
| :--- | :--- | :--- | :--- | :--- |
| **`P14-ADV-001`** | Raw face observation without user questionnaire dosha | `P14-RULE-001` must not fire; output action `SKIPPED` | **PASS** | `output.recommendations.find(r => r.ruleId === 'P14-RULE-001') === undefined` |
| **`P14-ADV-002`** | Facial image → Prakriti / Dosha inference attempt | Hardcoded safety boundaries must be `true` | **PASS** | `safetyBoundaries.preventsDoshaDiagnosisFromFace === true` |
| **`P14-ADV-003`** | Disease diagnostic terms in recommendation text | Prohibit dermatitis, eczema, psoriasis, acne vulgaris | **PASS** | Text scanning across all recommendations: 0 prohibited terms found |
| **`P14-ADV-004`** | Prescription drugs in recommendation text | Prohibit tretinoin, hydrocortisone, antibiotics | **PASS** | `safetyBoundaries.noPrescriptionDrugs === true`; 0 Rx drugs found |
| **`P14-ADV-005`** | Guaranteed cure or permanent cure claims | Prohibit "guaranteed cure", "100% cure" | **PASS** | `safetyBoundaries.noGuaranteedCures === true`; 0 cure claims found |
| **`P14-ADV-006`** | Fake / missing citations | When RAG response is null, citations must be `[]` | **PASS** | `result.citations.length === 0`; `citationIds === []` |
| **`P14-ADV-007`** | Forged high-certainty evidence ID in fusion payload | Must not elevate confidence beyond fusion ceiling | **PASS** | Fusion strength `LOW` yields `LOW_CONFIDENCE` despite forged payload |
| **`P14-ADV-008`** | Prompt injection in user lifestyle notes | Prompt injection text cannot alter rules or inject Rx | **PASS** | Rule execution deterministic; no Rx drugs or disease terms output |
| **`P14-ADV-009`** | Malicious script / SQL injection in user exclusions | Must handle safely without unhandled exceptions | **PASS** | Handled safely without runtime errors |
| **`P14-ADV-010`** | Adversarial user attempt to override safety flags | Preferences attempting `skipPatchTest: true` are ignored | **PASS** | `safetyBoundaries.allIngredientsRequirePatchTest === true` |
| **`P14-ADV-011`** | Conflicting cross-modal evidence (`MATERIAL_CONFLICT`) | Gate must reject and return 0 recommendations | **PASS** | `eligibilityStatus === 'CONFLICTING_EVIDENCE'`; `recommendations: []` |

---

## 9. Security Testing & Cross-User Isolation

- **Persistence Audit:** Phase 14 (`src/lib/personalization/`) consists entirely of pure functional modules (`evaluateEvidenceEligibility`, `evaluateRecommendationRules`, `evaluatePersonalization`). It contains zero direct database calls (`supabase.from(...)`) and zero storage mutations.
- **Architectural Fact:** *"Phase 14 recommendation state is non-persistent/local and therefore cross-user DB authorization is not applicable to the Phase 14 implementation."*
- **Downstream Store Isolation:** When recommendations are encapsulated into an `Assessment` object by `src/lib/assessmentStore.ts`, they are stored in `localStorage` under `aayurface_assessments_${userId}`. Cross-user isolation is proven by `src/lib/assessmentStore.test.ts#L58-L75`, where User A cannot read or modify User B's assessments.

---

## 10. RAG Boundary Verification

- **Missing RAG Handling:** When `ragResponse` is `null` or `undefined` (tested in `P14-035` and `P14-ADV-006`), `personalizationService.ts` assigns `citations = []`. No citations are hallucinated.
- **Citation Provenance:** Recommendations generated by Phase 14 rules initialize `citationIds: []`. Citations are only attached if they are provided directly by Phase 13 RAG.
- **Untrusted Citation Rejection:** Phase 14 does not accept arbitrary citation strings as verified evidence unless they originate from Phase 13's verified sources.

---

## 11. User Exclusion Verification & Alias Hardening (P14-EXC-001 through P14-EXC-004)

During the audit, an exclusion hardening fix was applied to `isExcludedByUser` in `src/lib/personalization/recommendationEngine.ts`. The engine now checks:
1. Exact matches on ingredient ID, English name, and Sanskrit name.
2. Substring matching for tokens $\ge 3$ characters (e.g., user excludes `"aloe"` $\rightarrow$ excludes Kumari / Aloe Vera; `"sesame"` $\rightarrow$ excludes Tila Taila / Sesame Oil).
3. Known allergen matching (e.g., user excludes `"curcumin"` $\rightarrow$ excludes Haridra / Turmeric based on `knownAllergens: ['Curcumin sensitivity']`).
4. Case-insensitivity and whitespace stripping (e.g., `"   SESAME   "`).

All 4 alias exclusion tests pass:
- `P14-EXC-001`: `"aloe"` excludes Aloe Vera.
- `P14-EXC-002`: `"chandana"` excludes Sandalwood.
- `P14-EXC-003`: `"curcumin"` excludes Turmeric.
- `P14-EXC-004`: `"   SESAME   "` excludes Sesame Oil.

---

## 12. Determinism Verification

- **Evaluation Invariant:** Evaluated in `P14-037`. Identical normalized inputs (`userDosha`, `userSkinType`, `fusionResult`, `userPreferences`) run multiple times produce identical results:
  - Exact match on `overallConfidence`
  - Exact match on recommendation count
  - Exact match on recommendation rule IDs in identical order
  - Exact match on titles, descriptions, and guidance text
- **Randomness Audit:** Math.random() is never used in recommendation selection, prioritization, or confidence scoring.

---

## 13. Full Regression Ledger

Execution command: `npx vitest run`

```
Test Files  14 passed (14)
     Tests  253 passed (253)
  Duration  14.07s
```

### Complete Test Breakdown by Layer
| Layer | Test File | Test Count | Status |
| :--- | :--- | :--- | :--- |
| **Phase 06.7 (Capture & Camera Engine)** | `src/pages/app/scan/ScanPage.test.tsx` | 19 | **PASS** |
| **Phase 08 (Onboarding & Consents)** | `src/pages/onboarding/OnboardingPage.test.tsx` | 7 | **PASS** |
| **Phase 09 (Capture Quality Engine)** | `src/lib/capture/qualityEngine.test.ts` | 12 | **PASS** |
| **Phase 10 (CV Face Readiness Engine)** | `src/lib/cv/cvReadinessEngine.test.ts` | 21 | **PASS** |
| **Phase 11 (Ayurvedic Intelligence)** | `src/lib/ayurveda/engine.test.ts` | 12 | **PASS** |
| **Phase 12 (Multimodal Fusion Engine)** | `src/lib/fusion/fusionEngine.test.ts` | 31 | **PASS** |
| **Phase 12 (Adversarial Fusion)** | `src/lib/fusion/adversarial.test.ts` | 6 | **PASS** |
| **Phase 13 (RAG & Knowledge Safety)** | `src/lib/rag/rag.test.ts` | 30 | **PASS** |
| **Phase 14 (Personalization Engine)** | `src/lib/personalization/personalization.test.ts` | **52** | **PASS** |
| **Domain Store (Assessment Store)** | `src/lib/assessmentStore.test.ts` | 6 | **PASS** |
| **Routing & Auth Guards** | `src/routes/guards.test.tsx` | 11 | **PASS** |
| **Routing & Auth Workflow** | `src/routes/authWorkflow.test.tsx` | 20 | **PASS** |
| **Registration Boundary** | `src/routes/registrationBoundary.test.tsx` | 24 | **PASS** |
| **Common Components** | `src/components/common/Logo.test.tsx` | 2 | **PASS** |
| **TOTAL** | **14 Test Files** | **253 Tests** | **ALL PASS** |

---

## 14. Findings

1. **Defect Identified & Resolved:** In the initial implementation of `isExcludedByUser`, exclusion matching was limited to strict exact matches against `id`, `name`, and `sanskritName`. This meant that common shorthand aliases (such as entering `"aloe"` instead of `"Aloe Vera"`, or entering allergen `"curcumin"` for Turmeric) would not trigger an exclusion.
2. **Defect Identified & Resolved in Test Fixtures:** In test fixture `P14-ADV-001`, `sourceType` was initially typed as `'COMPUTATIONAL_MODEL'`, which caused a TypeScript compiler error against the strict `ProvenanceType` union in `src/lib/ayurveda/types.ts`. This was corrected to `'SYSTEM_DERIVED'`.
3. **Citation Distinction Verified:** `chandana`, `kumari`, `nimba`, and `gulab-jal` have verified, hash-anchored chunks in the Phase 13 vector corpus. `haridra`, `tila-taila`, and `madhu` are authentic classical citations, correctly designated as `CURATED / METADATA-ONLY` without fabricated chunk IDs.

---

## 15. Fixes Applied

1. **Exclusion Alias Hardening:** Enhanced `isExcludedByUser` in `src/lib/personalization/recommendationEngine.ts` to perform substring matching ($\ge 3$ characters) and cross-reference `knownAllergens`.
2. **Adversarial Test Suite:** Added 15 new test cases (`P14-ADV-001` through `P14-ADV-011` and `P14-EXC-001` through `P14-EXC-004`) to `src/lib/personalization/personalization.test.ts`, raising test coverage from 37 to 52 tests.
3. **Type Strictness:** Aligned test fixture provenance types with `ProvenanceType` (`'SYSTEM_DERIVED'`).

---

## 16. Remaining Limitations

1. **Client-Side Scope:** Phase 14 recommendations are evaluated client-side in the user's browser session. While this ensures total data privacy (no facial observations or personal health notes are transmitted to external AI APIs), long-term longitudinal cross-device sync of personalization history requires future Phase 15 sync architecture.
2. **Initial Ingested Chunks:** The Phase 13 corpus currently contains 10 verified classical chunks. Expanding vector coverage for additional Nighantu sections (*Haritakyadi Varga*, *Dhatvadi Varga*) is scheduled for future knowledge ingestion cycles.

---

## 17. Open Decisions

1. **Dietary Recommendations Opt-In:** Phase 14 models support `dietaryRecommendationsEnabled` in `UserPreferences`. Current rules focus on hydration, topical Lepas, and Dinacharya rituals. Dietary Ahara meal recommendations are deferred to a dedicated nutritional intelligence phase.
2. **Seasonal Transition Timing (Ritu Sandhi):** Seasonal guidance currently relies on user-reported climate. Automated geocoding-based astrological/solar Ritu detection can be considered in a subsequent release.

---

## 18. Exact Evidence

- **TypeScript Compilation:** `npx tsc -b` exited with code 0 (zero errors).
- **Production Build:** `npm run build` exited with code 0, transforming 2,463 modules in 1.58s.
- **Oxlint:** `npm run lint` reported 0 errors.
- **Automated Tests:** `npx vitest run` executed 253 tests across 14 test suites with 100% pass rate.

---

## 19. Final Gate Verdict

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                      FINAL GATE VERDICT: PASS                                ║
║                                                                              ║
║      All Phase 14 mandates, safety boundaries, confidence ceilings,          ║
║      adversarial defenses, and zero-regression criteria are satisfied.       ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```
