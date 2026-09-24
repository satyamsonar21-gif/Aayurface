# Phase 13 Retrieval Architecture & Threshold Calibration
**Domain:** Hybrid Search, Intent Classification & Grounding Gating  
**Standard:** Forensic • Adversarial • Production-Grade  
**Date:** September 2026  

---

## 1. Multi-Stage Retrieval Pipeline

```text
USER QUERY
    │
    ▼
[1. Query Normalization & Intent Classification]
    │  (Intent: AYURVEDIC_CONCEPT | SKIN_WELLNESS | INGREDIENT | SAFETY | etc.)
    ▼
[2. User Query Sanitization]
    │  (Mitigate prompt injection; strip formatting escapes)
    ▼
[3. Vector Cosine Search]
    │  (Compare unit vector against corpus; cosine threshold >= 0.40)
    ▼
[4. Multi-Tier Metadata Filtering]
    │  (Exclude Quarantined/Rejected; filter by Min Authority Tier; filter by Language/Tags)
    ▼
[5. Reranking & Diversity Control]
    │  (Prioritize Tier 1/2 Shastras; ensure topical safety inclusion)
    ▼
[6. Grounding Gating Check]
    ├── Matches >= 2: PASS GATING (Assemble evidence & Proceed to Grounded Generation)
    └── Matches < 2:  FAIL GATING (Trigger Safe Fallback: "Insufficient verified evidence...")
```

---

## 2. Intent Classification Taxonomy

The retrieval pipeline dynamically determines query intent via `classifyQueryIntent`:
- `SAFETY`: Patch testing, topical allergies, skin sensitivities.
- `INGREDIENT`: Botanical dravyas (Sandalwood/Chandana, Aloe/Kumari, Neem/Nimba, Turmeric/Haridra).
- `PRAKRITI_CONTEXT`: Constitutional inquiries (strictly separated from facial imagery).
- `DOSHA_CONTEXT`: Imbalance queries, Guna associations (Ushna, Ruksha, Snigdha).
- `DINACHARYA`: Daily skin hygiene, cleansing routines, face washing.
- `SKIN_WELLNESS`: Complexion, surface moisture, shine, redness-like appearance.
- `SOURCE_LOOKUP`: Direct bibliographic inquiries (Charaka, Sushruta, Vagbhata, shlokas).
- `GENERAL_CHAT`: Non-specific greetings or general inquiries.

---

## 3. Threshold Calibration & Grounding Gating

### 3.1 Cosine Similarity Calibration ($\text{Threshold} = 0.40$):
- In semantic embedding spaces using term frequency projections, compound queries (e.g. "Pitta heat and cooling sandalwood") distribute weights across multiple concepts.
- Calibration evidence demonstrates that exact multi-concept matches score $0.80 - 0.95$, while relevant corroborating classical passages score $0.42 - 0.65$.
- Unrelated questions (e.g. modern technology or financial terms) score $\le 0.05$, cleanly falling below the $0.40$ cutoff.

### 3.2 Evidence Gating Requirement:
- High-confidence grounded generation strictly requires at least **two** distinct qualifying chunks ($\ge 2$).
- If fewer than two verified chunks meet the threshold, `gatingPassed = false` and `fallbackTriggered = true`.
- Under no circumstances does the system fabricate filler text or guess when evidence is scarce.
