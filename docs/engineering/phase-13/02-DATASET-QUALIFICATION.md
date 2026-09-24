# Phase 13 Dataset Forensic Qualification
**Subject:** `data/dataset/Updated_Prakriti_With_Features.csv`  
**Domain:** Computational Datasets & Ayurvedic AI Safety Boundary  
**Standard:** Forensic • Adversarial • Evidence-First  
**Date:** September 2026  
**Auditor:** Senior Data & AI Safety Engineer  

---

## 1. Executive Summary

The tabular dataset `data/dataset/Updated_Prakriti_With_Features.csv` was audited forensically to determine its origin, integrity, statistical distribution, and appropriateness for retrieval-augmented generation (RAG) and explainable AI (XAI).

### Forensic Findings:
1. **File Integrity:** 698,653 bytes, SHA-256 `c9748a9baaaab30ac90438d9e8ea2d0a04d0b68baab3e8f6b769e08673e47473`.
2. **Dimension:** 1,200 rows and 30 categorical/text feature columns. Exactly zero missing or empty cells.
3. **Severe Class Imbalance:** The target `Dosha` distribution is heavily skewed:
   - `vata+pitta`: 624 rows (52.0%)
   - `Vata`: 264 rows (22.0%)
   - `Pitta`: 144 rows (12.0%)
   - `Kapha`: 72 rows (6.0%)
   - `pitta+kapha`: 48 rows (4.0%)
   - `vata+kapha`: 48 rows (4.0%)
4. **Data Hygiene Issues:** Inconsistent target casing (`vata+pitta` vs `Vata`, `Pitta`, `Kapha`) and 1 duplicate row pattern.
5. **Provenance & Methodology:** The methodology for assigning `Dosha` labels (e.g., whether certified Ayurvedic clinicians, automated decision trees, or unverified self-report surveys) is completely unstated and unverified in the repository.

---

## 2. Statistical & Attribute Audit

### 2.1 Feature Columns (30 Total)
1. `Body Size`
2. `Body Weight`
3. `Height`
4. `Bone Structure`
5. `Complexion`
6. `General feel of skin`
7. `Texture of Skin`
8. `Hair Color`
9. `Appearance of Hair`
10. `Shape of face`
11. `Eyes`
12. `Eyelashes`
13. `Blinking of Eyes`
14. `Cheeks`
15. `Nose`
16. `Teeth and gums`
17. `Lips`
18. `Nails`
19. `Appetite`
20. `Liking tastes`
21. `Dosha` (Target / Label)
22. `Metabolism Type`
23. `Climate Preference`
24. `Stress Levels`
25. `Sleep Patterns`
26. `Dietary Habits`
27. `Physical Activity Level`
28. `Water Intake`
29. `Digestion Quality`
30. `Skin Sensitivity`

### 2.2 Duplication & Consistency Analysis
- Total Rows: 1,200
- Unique Feature Vectors: 1,199
- Duplicated Records: Exactly 1 row is duplicated once.
- Completeness: 100.0% (36,000 / 36,000 cells populated).

---

## 3. Strict Safety & Governance Boundary

### 3.1 Authority Classification: TIER 5 (Dataset / Computational Evidence)
Under the AayurFace Knowledge Source Authority Hierarchy, this dataset is classified strictly as **Tier 5: Dataset / Computational Evidence**.

### 3.2 Prohibited Usage Policies:
1. **PROHIBITED FROM RAG LITERATURE CORPUS:** Raw rows or text from this CSV file must **NEVER** be ingested into the classical literature vector database or presented as classical Ayurvedic evidence.
2. **PROHIBITED AS CLINICAL TRUTH:** A label in this CSV cannot be cited as clinical proof, authoritative medical consensus, or classical Shastra doctrine.
3. **PROHIBITED AS FACE-TO-DOSHA DIAGNOSIS:** Under no circumstances may features like `Shape of face`, `Complexion`, or `Cheeks` from this dataset be used to justify diagnosing a user's Dosha or Prakriti from facial imagery alone.
4. **NO AUTONOMOUS ML MODEL TRAINING:** In accordance with Phase 13 Section 84, this dataset will not be used for model parameter training or classifier fitting during Phase 13.
5. **PERMITTED USE:** Offline heuristic evaluation, research benchmarking, and testing edge cases in multi-attribute user context processing.
