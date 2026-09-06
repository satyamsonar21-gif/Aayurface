# AayurFace — Architecture Specification
## Ayurvedic Intelligence & Structured Domain Reasoning Architecture

**Phase:** Phase 02 — Target System Architecture, ADRs & Implementation Blueprint  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION  
**Authority:** Ayurvedic Domain Systems Analyst, AI/ML Architect  

---

### 1. Architectural Separation of Ayurvedic Intelligence

Ayurvedic wellness logic in AayurFace is explicitly decoupled into five distinct architectural concerns to prevent domain rules from scattering into UI components or becoming entangled with external LLM prompts:

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      1. CURATED AYURVEDIC KNOWLEDGE BASE                        │
│  Classical literature (Charaka, Sushruta, Bhavaprakasha) vectorized via pgvector│
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                     2. DETERMINISTIC CONSTITUTIONAL REASONING                   │
│  Maps phenotypic quiz inputs & CV visual signals to normalized Tridosha vectors │
│  (Vata: Dryness/Roughness, Pitta: Redness/Heat, Kapha: Sebum/Firmness)          │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                       3. PERSONALIZATION & GOAL MATCHING                        │
│  Filters herbal formulations and rituals by user goals (Skin Health, Sleep)     │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                       4. DETERMINISTIC SAFETY & ETHICAL GUARDS                  │
│  • Mandatory 24-hour patch test advisory on 100% of topical herbs               │
│  • Serious condition escalation rule (Referral to certified dermatologist)      │
│  • Medical disclaimer validation ("Wellness intelligence, not a diagnosis")     │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                       5. PRESENTATION & LOCALIZATION LAYER                      │
│  Renders structured XAI insights in user's selected language (English / Hindi)  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Tridosha Signal Mapping & Phenotypic Dimensions

Ayurveda conceptualizes physiological and skin tendencies through the Tridosha framework (Vata, Pitta, Kapha). The intelligence layer maps empirical observations to these axes:

| Ayurvedic Dosha | Primary Element / Attribute | Observable Visual Signals (Tier 2 CV) | Questionnaire Phenotypic Signals | Environmental Aggravation | Classical Balancing Rituals (Dinacharya) |
|---|---|---|---|---|---|
| **Vata** | Air & Space (*Vayu & Akasha*)<br>Dry, cold, light, rough | Elevated GLCM surface roughness, micro-flakiness, under-eye shadow contrast | Slender frame, dry skin, irregular digestion, cold sensitivity | Dry climates, high stress, air conditioning, lack of sleep | Gentle hydration, sesame/almond oil nourishment, warm herbal steams |
| **Pitta** | Fire & Water (*Tejas & Jala*)<br>Hot, sharp, oily, reactive | Elevated CIELAB $a^*$ micro-vascular redness, localized erythema | Medium athletic frame, heat sensitivity, sharp digestion | Hot humid climates, intense sunlight, spicy diet | Cooling aloe vera, rose water, sandalwood, neem pacification |
| **Kapha** | Earth & Water (*Prithvi & Jala*)<br>Heavy, cold, moist, stable | High specular reflectance (sebum shine), enlarged pore clusters | Solid frame, oily T-zone, calm temperament, slow digestion | Cold damp weather, sedentary lifestyle, high-lipid diet | Clarifying cleansers, gentle dry exfoliation, triphala toning |

---

### 3. Dynamic Ritucharya (Seasonal) & Dinacharya Adaptation

The intelligence architecture supports seasonal and daily context injection:
* **Dinacharya (Daily Cycle):** Generates time-slotted routines categorized strictly into **Morning** (Cleansing, toning, sun protection), **Evening** (Nourishing, repair, oil massage), and **Weekly** (Deep herbal face masks, steam).
* **Ritucharya (Seasonal Cycle):** Modifies recommendation scoring based on user's geographic climate (e.g., in hot/dry summers, Pitta cooling recommendations receive positive scoring multipliers; in cold/dry winters, Vata nourishing oils are prioritized).

---

### 4. Non-Diagnostic Boundary & Ethical Guardrails

AayurFace is strictly designed as an **AI-Assisted Holistic Wellness Intelligence Platform**, not a diagnostic medical device:
1. **No Medical Claims:** The system shall never assert that an Ayurvedic remedy "cures", "treats", or "eradicates" any skin disease.
2. **Standardized Disclaimer:** Every analysis result and recommendation card permanently features the disclaimer: *"AayurFace provides AI-assisted wellness insights based on classical Ayurvedic principles. This is not a medical diagnosis. Consult a qualified dermatologist or physician for clinical concerns."*
3. **Mandatory Patch Test Rule:** Every topical formulation recommendation incorporates a prominent safety directive requiring a 24-hour patch test behind the ear prior to application.
