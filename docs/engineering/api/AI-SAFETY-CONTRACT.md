# Internal Contract: AI Output Validation & Safety Boundaries
## Untrusted AI Payload Validation, Prohibited Term Scrubbing & Grounding Verification

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** AI Safety & Output Governance  
**Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`  
**Authority:** Security Architect, AI Platform Architect, Compliance Officer  

---

## 1. The 5-Stage Untrusted Output Validation Pipeline

All generative output from LLMs (OpenAI GPT-4o) is treated as **Untrusted External Input** and must pass through five sequential gates before reaching database persistence or client payloads:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    5-STAGE AI OUTPUT VALIDATION PIPELINE                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. Structural Schema Validation (Zod JSON Mode Parser)                      │
│    • Rejects unparseable JSON, missing required keys, or invalid types.     │
│                                                                             │
│ 2. Enumeration & Range Validation                                           │
│    • Asserts dosha strings match ('VATA' | 'PITTA' | 'KAPHA').              │
│    • Asserts percentages sum to exactly 100.0% (±0.01 tolerance).           │
│                                                                             │
│ 3. Prohibited Medical Vocabulary Scanner (Regex Engine)                     │
│    • Rejects clinical disease names: `erythema multiforme`, `cystic acne`,   │
│      `rosacea`, `dermatitis`, `psoriasis`, `pathology`, `infection`.        │
│    • Rejects pharmaceutical prescription drugs: `isotretinoin`,             │
│      `tretinoin`, `spironolactone`, `doxycycline`, `hydrocortisone`.        │
│                                                                             │
│ 4. Citation & Grounding Authenticity Gate                                   │
│    • Asserts cited `knowledge_chunk_id` exists in database and is 'ACTIVE'. │
│    • Blocks hallucinated or fabricated classical shlokas.                   │
│                                                                             │
│ 5. Toxic Botanical & Dosage Safety Scanner                                  │
│    • Asserts herbal recommendations exclude schedule-prohibited herbs       │
│      (e.g., Aconitum, Gloriosa superba) and adhere to cosmetic lepa dosages.│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Recovery & Retry Semantics for AI Validation Failures

```text
Validation Gate Failure
       │
       ├── Attempt 1 Failure ──► Automated Retry with Structured Correction Prompt
       │                         ("Your response contained prohibited medical term X...")
       │
       └── Attempt 2 Failure ──► Terminate Pipeline & Trigger Deterministic Safe Fallback
                                 (Standard Static Ayurvedic Guidelines; Log Incident)
```
