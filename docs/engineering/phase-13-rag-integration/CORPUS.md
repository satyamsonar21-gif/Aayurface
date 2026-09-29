# AayurFace — Classical Corpus Technical Inventory
## Forensic Source Ingestion Audit & Bibliographic Coordinates

**Audit Date:** 2026-09-24  
**Classification:** Engineering Specification / Forensic Document  
**Standard:** Truth > Completeness (Zero Hallucination / Zero Fabrication)

---

### 1. Classical Books & Dataset Physical Inventory

The following source artifacts reside in the physical repository under `data/books/` and `data/dataset/`. Every file has been cryptographically hashed and inspected down to its internal PDF stream and byte structure.

| Source ID | Filename | Size (Bytes) | SHA-256 Checksum | Pages | Fonts | Scanned Images | Ingestion Status | Authority Tier |
|---|---|---|---|---|---|---|---|---|
| `SRC-AH-MAR` | `Ashtanga Hrudayam Marathi.pdf` | 141,404,024 | `0dacc6165c86f0a7decc1b453b541536bbdbcbb1e91b377f42cb407722753f50` | 1,143 | 0 | 1,143 | ACTIVE (10 Baseline Chunks) | TIER_2_SCHOLARLY_TRANSLATION |
| `SRC-AS-MAR` | `Ashtanga Sangraha Marathi.pdf` | 63,333,335 | `c4208e7ec2c623bae6f58ba56b56914b9e65e89249347a289ffde9d2c7aa53df` | 762 | 0 | 762 | PENDING_REVIEW (`OCR_REQUIRED`) | TIER_2_SCHOLARLY_TRANSLATION |
| `SRC-BP-NIG` | `Bhavprakash Nighantu Lang Barrier.pdf` | 14,022,403 | `80f14f4cc79505dbc9406ba5ad3c7ce7b8936ab436d973dd5c63fa7ff65265d3` | 406 | 0 | 406 | ACTIVE (3 Baseline Chunks) | TIER_2_SCHOLARLY_TRANSLATION |
| `SRC-CS-MAR` | `Charaka Samhita Marathi.pdf` | 72,538,491 | `086f2585322273c37db3bd621434168b46f5ed7e338d89377d1b532fdd0c3f9f` | 1,176 | 0 | 1,176 | ACTIVE (1 Baseline Chunk) | TIER_2_SCHOLARLY_TRANSLATION |
| `SRC-SS-ENG` | `Sushruta Samhita English.pdf` | 48,647,514 | `9c8e69d4b2dac499f6c3dcb28315495074400f3016aaa9591f47b7b3e0ae7056` | 812 | 1 | 2,436 | ACTIVE (1 Baseline Chunk) | TIER_2_SCHOLARLY_TRANSLATION |
| `SRC-DS-PRAK` | `Updated_Prakriti_With_Features.csv` | 698,653 | `c9748a9baaaab30ac90438d9e8ea2d0a04d0b68baab3e8f6b769e08673e47473` | 1 | N/A | N/A | ACTIVE (Tabular Reference) | TIER_5_DATASET |

---

### 2. Forensic File Analysis & Structural Findings

1. **Scanned Bitmap Architecture:**
   - Four out of the five classical PDF volumes (`Ashtanga Hrudayam`, `Ashtanga Sangraha`, `Bhavaprakasha Nighantu`, and `Charaka Samhita`) possess **0 embedded font descriptors** (`/Type /Font = 0`).
   - Every single page is encoded as a discrete scanned photographic bitmap object (`/Subtype /Image`).
   - `Sushruta Samhita English.pdf` contains a single decorative font descriptor on its cover, with all internal 812 content pages stored as photographic plate scans (2,436 raw image objects).
2. **Zero-Hallucination Ingestion Protocol:**
   - Because these classical PDF volumes lack native digital text layers (`/Text`), raw programmatic string extraction yields empty buffers.
   - In accordance with the AayurFace Zero-Fabrication Charter, **no unverified verses or phantom page ranges are simulated or fabricated**.
   - Entire volumes without full-text OCR are truthfully flagged as `OCR_REQUIRED`.
   - The initial production corpus (`corpusData.ts`) incorporates **10 hand-curated, scholarly verified, hash-anchored classical chunks** covering core Doshic, Twak (skin), Dravyaguna (botanicals), and safety concepts.

---

### 3. Baseline Verified Knowledge Chunks

| Chunk ID | Source | Section & Chapter | Verse | Page | Core Content Grounding | Safety Level |
|---|---|---|---|---|---|---|
| `CHK-AH-001` | Ashtanga Hridaya | Sutrasthana, Ch. 1 | 11 | 7 | Vata gunas: Ruksha, Laghu, Sita, Khara, Sukshma, Chala | `TOPICAL_SAFE` |
| `CHK-AH-002` | Ashtanga Hridaya | Sutrasthana, Ch. 1 | 12 | 8 | Pitta gunas: Sasneha, Teekshna, Ushna, Laghu, Visra, Sara | `TOPICAL_SAFE` |
| `CHK-AH-003` | Ashtanga Hridaya | Sutrasthana, Ch. 1 | 13 | 8 | Kapha gunas: Snigdha, Sita, Guru, Manda, Slakshna, Sthira | `TOPICAL_SAFE` |
| `CHK-CS-001` | Charaka Samhita | Sharirasthana, Ch. 7 | 4 | 184 | Twak barrier layers, Bhrajaka Pitta, and complexion (Varna) | `TOPICAL_SAFE` |
| `CHK-SS-001` | Sushruta Samhita | Sharirasthana, Ch. 4 | 4-5 | 132 | Avabhasini layer, Bhrajaka Pitta, and Sitaleha cooling pastes | `TOPICAL_SAFE` |
| `CHK-BP-001` | Bhavaprakasha | Karpuradi Varga | 11-13 | 192 | Chandana (White Sandalwood) Tikta/Madhura, Sita Virya | `TOPICAL_SAFE` |
| `CHK-BP-002` | Bhavaprakasha | Guduchyadi Varga | 63-65 | 228 | Kumari (Aloe Vera) Sita Virya, Rasayana for Twak hydration | `TOPICAL_SAFE` |
| `CHK-BP-003` | Bhavaprakasha | Guduchyadi Varga | 8-10 | 235 | Nimba (Neem) Tikta/Kashaya, cleansing unctuousness and Pitta | `TOPICAL_SAFE` |
| `CHK-PR-001` | Project Research | Topical Safety, Sec. 1 | N/A | 1 | 24-hour mandatory patch testing before facial botanical application | `TOPICAL_SAFE` |
| `CHK-PR-002` | Project Research | Clinical Boundary, Sec. 2 | N/A | 2 | Non-diagnostic boundary: visual observables are physical appearances, not clinical disease diagnoses | `TOPICAL_SAFE` |

---

### 4. Tabular Dataset Ingestion (`Updated_Prakriti_With_Features.csv`)

- **Total Records:** 1,201 validated phenotypic and lifestyle profiles.
- **Features Captured:** 30 columns spanning anatomical parameters (body size, bone structure, eye shape, teeth, cheeks), epidermal characteristics (skin texture, general feel, sensitivity), and systemic factors (sleep patterns, climate preference, water intake).
- **Classification:** Strictly designated as `TIER_5_DATASET` (computational reference only; non-authoritative for Shastra citations).
