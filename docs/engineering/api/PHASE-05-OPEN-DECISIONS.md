# AayurFace — Open Architectural Decisions Registry
## Phase 05 Open Decisions & Carried-Forward Registries

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Date:** 2026-09-03  
**Status:** AUTHORITATIVE OPEN DECISIONS REGISTRY  
**Authority:** Principal Software Architect, Privacy Officer, Legal Counsel  

---

## 1. Carried-Forward & Active Open Decisions

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ACTIVE OPEN ARCHITECTURAL DECISIONS                      │
├─────────┬───────────────────────────────────┬──────────────┬────────────────┤
│ ID      │ Title                             │ Status       │ Target Phase   │
├─────────┼───────────────────────────────────┼──────────────┼────────────────┤
│ DEC-004 │ Biometric Raw Image Purge Policy  │ OPEN DECISION│ Phase 06 / Pre │
│ DEC-010 │ Post-MVP Expert Research Enclave  │ ACCEPTED DEFER│ Milestone 18   │
│ DEC-012 │ LLM Provider Redundancy (Anthropic)│ PROPOSED     │ Phase 06 / MVP │
│ DEC-013 │ Redis vs PostgreSQL Job Queueing  │ TARGET (PG)  │ Phase 06       │
└─────────┴───────────────────────────────────┴──────────────┴────────────────┘
```

### DEC-004: Biometric Raw Facial Image Purge Policy
* **Description:** Decision between **Immediate Ephemeral Purge** (raw facial JPEG in S3 is purged immediately upon successful feature vector extraction, within ~60 seconds) versus **30-Day Rolling Retention** (raw image retained for 30 days to support user visual comparisons, then auto-purged via S3 lifecycle).
* **Current Status:** `OPEN DECISION (REQUIRES PRODUCT & LEGAL REVIEW)`.
* **API Impact:** `SECURE-UPLOAD-CONTRACT.md` and `CAPTURE-API-CONTRACT.md` support both policies via configurable S3 bucket lifecycle tags.

### DEC-010: Post-MVP Expert Research Enclave
* **Description:** Deferral of double-blind practitioner consensus infrastructure (`research.*` schema) to Milestone 18 post-MVP.
* **Current Status:** `ACCEPTED DEFERRAL (TARGET / POST-MVP)`.
* **API Impact:** `RESEARCH-API-CONTRACT.md` is fully specified but isolated from MVP deployment pipelines.

### DEC-012: LLM Provider Redundancy & Multi-Provider Fallback
* **Description:** Integrating Anthropic Claude 3.5 Sonnet as a warm secondary failover if OpenAI GPT-4o encounters a service degradation.
* **Current Status:** `PROPOSED (EVALUATING COST & IMPLEMENTATION OVERHEAD)`.
* **API Impact:** `RETRY-TIMEOUT-POLICY.md` accounts for upstream circuit breaking.

### DEC-013: Queue Engine Architecture (PostgreSQL vs Redis BullMQ)
* **Description:** Adopting PostgreSQL `FOR UPDATE SKIP LOCKED` for early production (<10,000 daily scans) vs deploying a dedicated Redis instance for BullMQ.
* **Current Status:** `TARGET (POSTGRESQL SKIP LOCKED FOR MVP)`.
