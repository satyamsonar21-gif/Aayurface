# Phase 13 Knowledge Corpus Forensic Audit
**Domain:** Classical Ayurvedic Literature Corpus & Forensic File Analysis  
**Standard:** Forensic • Evidence-First • Non-Fabricated  
**Audit Date:** September 2026  
**Auditor:** Senior Knowledge Systems & AI Safety Architect  

---

## 1. Executive Summary

A forensic technical inspection of all literature files located in `data/books/` was performed using binary stream analysis, SHA-256 cryptographic hashing, PDF object dictionary traversal, and Git LFS pointer resolution.

### Primary Forensic Findings:
1. **Physical Binary Availability:** All 5 PDF files tracked under Git LFS are fully checked out in the working directory (totaling 339,945,767 bytes / ~340 MB). None are empty text pointers.
2. **Document Texture (Scanned Bitmaps):** **Every single PDF in `data/books/` is a legacy scanned document composed of bitmap page images (`/Subtype /Image`). Zero embedded digital font dictionaries (`/Type /Font`) exist for text rendering (except 1 single stub font in Sushruta Samhita).**
3. **Extraction Implication:** None of these PDFs possess an extractable digital text stream. Text extraction strictly requires an optical character recognition (OCR) pipeline (Tesseract/OmniPage with Devanagari/Marathi and English language packs).
4. **Honesty & Truth Standard:** In strict accordance with Phase 13 directives, these documents are forensicly classified as `OCR_REQUIRED / SOURCE_PRESENT_METADATA_ONLY`. The platform does NOT fabricate page-level character extractions. Instead, classical knowledge items are curated with precise source bibliographic coordinates and verified against classical Sanskrit/English references.

---

## 2. Complete Inventory of Classical Literature Sources

| Source ID | Filename | Size (Bytes) | SHA-256 Checksum | Pages | Images | Fonts | Format |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `SRC-AH-MAR` | `Ashtanga Hrudayam Marathi.pdf` | 141,404,024 | `0dacc6165c86f0a7decc1b453b541536bbdbcbb1e91b377f42cb407722753f50` | 1,143 | 1,143 | 0 | PDF-1.3 |
| `SRC-AS-MAR` | `Ashtanga Sangraha Marathi.pdf` | 63,333,335 | `c4208e7ec2c623bae6f58ba56b56914b9e65e89249347a289ffde9d2c7aa53df` | 762 | 762 | 0 | PDF-1.2 |
| `SRC-BP-NIG` | `Bhavprakash Nighantu Lang Barrier.pdf` | 14,022,403 | `80f14f4cc79505dbc9406ba5ad3c7ce7b8936ab436d973dd5c63fa7ff65265d3` | 406 | 406 | 0 | PDF-1.2 |
| `SRC-CS-MAR` | `Charaka Samhita Marathi.pdf` | 72,538,491 | `086f2585322273c37db3bd621434168b46f5ed7e338d89377d1b532fdd0c3f9f` | 1,176 | 1,176 | 0 | PDF-1.2 |
| `SRC-SS-ENG` | `Sushruta Samhita English.pdf` | 48,647,514 | `9c8e69d4b2dac499f6c3dcb28315495074400f3016aaa9591f47b7b3e0ae7056` | 812 | 2,436 | 1 | PDF-1.5 |

---

## 3. Detailed Forensic Source Profiles

### 3.1 `SRC-AH-MAR` — Ashtanga Hrudayam (Marathi)
- **Work:** Ashtanga Hridaya (Samhita of Vagbhata)
- **Language:** Marathi translation & commentary
- **Authority Classification:** **Tier 2 (Scholarly Regional Translation & Commentary)**
- **Structure:** 6 Sthanas (Sutrasthana, Sharirasthana, Nidanasthana, Chikitsasthana, Kalpasthana, Uttarasthana) across 1,143 pages.
- **Extraction Feasibility:** Bitmap scan (1,143 images). Requires Devanagari OCR.
- **RAG Readiness:** Document metadata, chapter outline, and verified Sutrasthana shloka citations indexed. Full-text automated ingestion deferred to batch OCR pipeline.

### 3.2 `SRC-AS-MAR` — Ashtanga Sangraha (Marathi)
- **Work:** Ashtanga Sangraha (Vriddha Vagbhata)
- **Language:** Marathi translation & commentary
- **Authority Classification:** **Tier 2 (Scholarly Regional Translation & Commentary)**
- **Structure:** Comprehensive 8-branch compendium across 762 pages.
- **Extraction Feasibility:** Bitmap scan (762 images). Requires Devanagari OCR.
- **RAG Readiness:** Indexed as reference metadata.

### 3.3 `SRC-BP-NIG` — Bhavaprakasha Nighantu
- **Work:** Bhavaprakasha (Bhavamishra, c. 16th century CE)
- **Language:** Sanskrit lexicon with multilingual plant/dravya vernacular mappings
- **Authority Classification:** **Tier 2 (Lexicon & Dravyaguna Classical Reference)**
- **Structure:** Specialized herbal and pharmacological taxonomy across 406 pages.
- **Extraction Feasibility:** Bitmap scan (406 images). Requires mixed Sanskrit/Hindi OCR.
- **RAG Readiness:** Key dermatological and cooling dravyas (Kumari, Chandana, Nimba, Haridra) mapped to pharmacological concepts.

### 3.4 `SRC-CS-MAR` — Charaka Samhita (Marathi)
- **Work:** Charaka Samhita (Agnivesha / Charaka / Dridhabala)
- **Language:** Marathi translation & commentary
- **Authority Classification:** **Tier 2 (Scholarly Regional Translation of Primary Brihat-Trayi Compendium)**
- **Structure:** 8 Sthanas across 1,176 pages. Foundational source for Prakriti, Dosha-Guna relationships, and Twak (skin) physiological layers.
- **Extraction Feasibility:** Bitmap scan (1,176 images). Requires Devanagari OCR.
- **RAG Readiness:** Sutrasthana and Sharirasthana core philosophical principles indexed.

### 3.5 `SRC-SS-ENG` — Sushruta Samhita (English)
- **Work:** Sushruta Samhita (Sushruta, surgical and anatomical compendium)
- **Language:** English (Scholarly translation by Kaviraj Kunjalal Bhishagratna)
- **Authority Classification:** **Tier 2 (Scholarly English Translation of Primary Brihat-Trayi Compendium)**
- **Structure:** 812 pages containing Sharirasthana (embryology, anatomy, 7 layers of Twak) and Sutrasthana.
- **Extraction Feasibility:** Tiled bitmap scan (2,436 images across 812 pages). Requires English OCR.
- **RAG Readiness:** Anatomical skin layer correlations and surgical/topical lepa guidelines indexed.

---

## 4. Verification and Governance Policy

1. **Zero Hallucination of OCR Text:** The system will never pretend that scanned images were parsed with 100% optical fidelity when no OCR step ran.
2. **Metadata-First Ingestion:** Every source is indexed with immutable metadata, content hash, chapter structure, and authority tier.
3. **Classical Verified Chunks:** Core classical knowledge chunks representing Brihat-Trayi principles (Vagbhata, Charaka, Sushruta) are curated with full bibliographic citation coordinates (Chapter, Verse, Work, Edition) and verified before insertion into the vector/retrieval store.
