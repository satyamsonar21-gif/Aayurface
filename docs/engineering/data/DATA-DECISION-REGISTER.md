# AayurFace — Database Architecture Specification
## Master Data Decision Register (Active & Open Technical Decisions)

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Software Architect, Principal Database Architect  

---

### 1. Active & Open Data Decision Register

| Decision ID | Decision Topic | Status | Considered Alternatives | Trade-Offs & Architectural Impact | Owner | Review Milestone |
|---|---|---|---|---|---|---|
| **DEC-004** | Biometric Facial Image Retention Period | **OPEN DECISION** | • Option A: Immediate purge post-extraction.<br/>• Option B: Rolling 30 days. | Option A minimizes privacy liability but eliminates visual comparison; Option B enables monthly before/after tracking but retains biometric assets longer. | Privacy Officer & Product Lead | Milestone 08 |
| **DEC-005** | Biometric Capture Ingestion Architecture | **CONFIRMED** | • Option A: Client single frame upload via signed S3 PUT.<br/>• Option B: Continuous WebRTC streaming. | Confirmed Option A: Eliminates massive server bandwidth costs; client Wasm runs quality checks locally in RAM; zero video streaming to cloud. | Computer Vision Architect | Milestone 08 |
| **DEC-008** | Offline Operational Support | **CONFIRMED** | • Option A: Offline AI analysis.<br/>• Option B: Online-only analysis with cached client views. | Confirmed Option B: Running multimodal fusion, pgvector, and LLM locally is technically unfeasible in mobile browser; offline mode caches past results only. | Staff Frontend Architect | Milestone 06 |
| **DEC-010** | Clinical Expert Study Sequencing | **CONFIRMED** | • Option A: Pre-MVP blocking study.<br/>• Option B: Post-MVP isolated research enclave. | Confirmed Option B: Allows launching consumer wellness MVP safely while clinical validation and inter-rater consensus proceed in parallel in Milestone 18. | Solution Architect | Milestone 18 |
| **SEC-DEC-003** | Ephemeral Pre-Signed Upload URL TTL | **PROPOSED** | • 5 minutes vs 15 minutes vs 60 minutes. | Proposed 15 minutes: Accommodates slow cellular mobile networks while minimizing the window for URL interception or replay. | Data Security Architect | Milestone 08 |
| **SEC-DEC-007** | Cryptographic Shared Report Link TTL | **PROPOSED** | • 24 hours vs 7 days vs 30 days. | Proposed 7 days: Sufficient for Ayurvedic practitioner consultation review without creating permanently dangling public links. | Data Security Architect | Milestone 14 |
| **DATA-DEC-01** | Primary Key Standard for Operational Entities | **PROPOSED** | • Random UUIDv4 vs Time-Sorted UUIDv7. | Proposed UUIDv7: Reduces B-tree index fragmentation by 90% and optimizes cache locality on high-volume tables. | Principal Database Architect | Milestone 04 |
| **DATA-DEC-02** | Multimodal Fusion Weight Calibration | **PROPOSED** | • Static weights ($0.40, 0.35, 0.25$) vs Dynamic learned weights. | Proposed versioned `fusion_configurations` table starting with baseline hypothesis ($0.40, 0.35, 0.25$) to allow empirical tuning without code deploys. | AI Data Architect | Milestone 11 |
