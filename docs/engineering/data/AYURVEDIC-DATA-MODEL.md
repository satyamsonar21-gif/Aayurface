# AayurFace — Database Architecture Specification
## Ayurvedic Wellness Data Model & Classical Phenotypic Representation

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Ayurvedic Domain Systems Analyst  
**Non-Diagnostic Invariant:** All data structures represent holistic Ayurvedic constitutional tendencies and surface skin characteristics; **DIAGNOSTIC MEDICAL TERMINOLOGY IS STRICTLY PROHIBITED**.  

---

### 1. Conceptual Distinction: Prakriti vs Vikriti

The data architecture formalizes the classical Ayurvedic distinction between baseline constitution and current phenotypic state:
1. **Prakriti (Baseline Constitution):** The user's inherent constitutional doshic balance established at birth, determined primarily via the 15-question intake (`questionnaire_responses`).
2. **Vikriti (Current Phenotypic Imbalance):** Dynamic, transient surface manifestations influenced by climate, stress, sleep, and lifestyle, reflected in real-time computer vision observables (`visual_observations`) and dynamic context (`lifestyle_contexts`).

---

### 2. Physical Doshic Mapping of Visual Observables

Objective computer vision metrics map strictly to classical Ayurvedic surface characteristics (*Gunas*):

| Classical Ayurvedic Characteristic | Primary Physical Signal | Mathematical Metric in Database | Database Column Name | Expected Doshic Attribution |
|---|---|---|---|---|
| **Ruksha (Dryness / Roughness)** | Surface texture micro-relief | GLCM Contrast & Homogeneity | `visual_observations.glcm_contrast` | **Vata Tendency** |
| **Ushna / Rakta (Heat / Redness)**| Facial micro-vascular flush | CIELAB $a^*$ color channel mean | `visual_observations.cielab_a_mean` | **Pitta Tendency** |
| **Snigdha (Oiliness / Luster)** | Specular highlight reflection | Normalized Luma Variance | `visual_observations.luma_mean` | **Kapha Tendency** |
| **Vaivarnya (Pigmentation Delta)**| Melanin patch distribution | Melanin Uniformity Index | `visual_observations.melanin_index` | **Vata-Pitta Tendency** |

---

### 3. Non-Diagnostic Guardrails at the Schema Level

To prevent non-deterministic LLMs or API inputs from introducing clinical disease classifications, the schema enforces database-level constraints:
* **Allowed Tendencies Allowlist:**
  ```sql
  dominant_dosha VARCHAR(20) CHECK (dominant_dosha IN (
      'VATA', 'PITTA', 'KAPHA', 'VATA_PITTA', 'PITTA_KAPHA', 'VATA_KAPHA', 'TRIDOSHIC'
  ))
  ```
* **Strict Vocabulary Prohibition:** Columns storing summaries and rituals are checked via application middleware and database regex triggers to reject clinical terms (`erythema multiforme`, `cystic acne`, `rosacea`, `dermatitis`, `psoriasis`, `pathology`, `infection`).
* **Classical Text Framing:** Recommendations must frame advice around pacifying excess *Dosha* (e.g., *"Cooling Pitta fire with rose water and sandalwood"*), never curing diseases.
