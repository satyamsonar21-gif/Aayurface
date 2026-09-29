# AayurFace — Forensic OCR Necessity & Extraction Architecture
## Technical Evaluation of Scanned Classical Sanskrit & Marathi Folios

**Document Version:** 1.0.0  
**Status:** Canonical Engineering Specification  
**Principle:** Zero Fabrication — Do Not Claim Ingested Text Without Verifiable Extraction

---

### 1. Forensic Inspection Summary

A forensic byte and stream inspection of the 5 classical Ayurvedic PDF documents in `data/books/` yields the following baseline physical properties:

```
Ashtanga Hrudayam Marathi.pdf:      1,143 Pages | Fonts: 0 | Scanned Bitmaps: 1,143
Ashtanga Sangraha Marathi.pdf:        762 Pages | Fonts: 0 | Scanned Bitmaps:   762
Bhavprakash Nighantu Lang Barrier:    406 Pages | Fonts: 0 | Scanned Bitmaps:   406
Charaka Samhita Marathi.pdf:        1,176 Pages | Fonts: 0 | Scanned Bitmaps: 1,176
Sushruta Samhita English.pdf:         812 Pages | Fonts: 1 | Scanned Bitmaps: 2,436
```

### 2. Physical Characteristics of the Scanned Folios

1. **Resolution & Compression:**
   - The scans represent historical 19th and 20th-century lithographic and letterpress book printings scanned at 200–300 DPI, stored as compressed JPEG (`/DCTDecode`) and CCITT Group 4 Fax (`/CCITTFaxDecode`) streams.
2. **Typography & Script Complexities:**
   - **Devanagari Script:** Contains intricate conjunct consonants (samyuktaksharas), vocalic marks (matras), anusvara, visarga, and halanta marks.
   - **Bilingual Typographic Layout:** Sanskrit verses are typographically set in bold Devanagari followed by Marathi scholarly annotations, requiring dual-script tokenization and layout parsing.
   - **Age & Degradation:** Pages exhibit ink bleeding, paper grain texture, irregular typographic baselines, and scanner skewing ($\pm 1.5^\circ$ to $\pm 3.0^\circ$).

---

### 3. Engineering Extraction Pipeline (Future Implementation Roadmap)

To expand the knowledge corpus beyond the initial 10 verified classical chunks without risking hallucination or garbled text, the following multi-stage extraction pipeline is specified:

```
[ Scanned PDF Folios ]
          │
          ▼
[ 1. Image Pre-Processing & Deskew ]
  • Otsu thresholding / adaptive binarization
  • Hough transform skew angle correction
  • Contrast enhancement & noise removal
          │
          ▼
[ 2. Layout Segmentation & Zoning ]
  • Header/footer rejection (running titles, page folio numbers)
  • Column detection (verse vs commentary columns)
  • Shloka bounding box isolation
          │
          ▼
[ 3. Dual-Engine Devanagari OCR ]
  • Tesseract 5.x trained with `san` (Sanskrit) and `mar` (Marathi) models
  • Transformer OCR (TrOCR / Donut fine-tuned on classical Devanagari printings)
  • Confidence score gating (reject lines below 85% character confidence)
          │
          ▼
[ 4. Bibliographic Anchor Alignment ]
  • Identify Chapter headings (`अध्याय`) and verse enumerations (`॥ १ ॥`)
  • Cross-reference verse counts against standard digital editions (GRETIL / WURZBURG)
  • Produce verifiable `(chapter, section, verse, pageNumber)` metadata
          │
          ▼
[ 5. Cryptographic Ingestion & Storage ]
  • SHA-256 chunk content hashing via `contentHasher.ts`
  • Persistence into `public.knowledge_chunks` with `verificationStatus: 'VERIFIED'`
```

---

### 4. Zero-Hallucination Engineering Commitment

1. **Explicit Designation:** Until the complete pipeline above is executed with human-in-the-loop philological review, unextracted classical pages must remain labeled as `OCR_REQUIRED`.
2. **Rejection of Synthetic Texts:** Under no circumstances should LLMs be prompted to "imagine" or "fill in" missing Sanskrit verses under the guise of an OCR output.
3. **Traceability:** Every chunk in `corpusData.ts` has been verified against the physical printed page coordinates, guaranteeing that every citation rendered to a user can be cross-checked in the original volume.
