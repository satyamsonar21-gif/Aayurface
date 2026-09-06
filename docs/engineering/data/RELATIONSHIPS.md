# AayurFace — Database Architecture Specification
## Relational Cardinality, Foreign Keys & Dependency Graph

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Data Architect  

---

### 1. Relational Dependency Hierarchy

The entities in AayurFace form a strict acyclic dependency hierarchy across five relational tiers:

```text
TIER 1: AUTHENTICATION & EDITORIAL ROOTS (Independent Tables)
├── auth.users (Managed by Supabase Auth)
├── knowledge_sources (Compendium catalog)
└── fusion_configurations (Master algorithm weights)

TIER 2: CORE USER & KNOWLEDGE DOMAIN ENTITIES
├── profiles (FK -> auth.users)
├── user_preferences (FK -> profiles)
├── consents (FK -> profiles)
├── questionnaire_templates (Master intake version)
└── knowledge_documents (FK -> knowledge_sources)

TIER 3: INTAKE, CAPTURES & KNOWLEDGE CHUNKS
├── questionnaire_responses (FK -> profiles, questionnaire_templates)
├── lifestyle_contexts (FK -> profiles)
├── captures (FK -> profiles)
├── capture_quality_metrics (FK -> captures)
├── analysis_jobs (FK -> profiles, captures)
└── knowledge_chunks (FK -> knowledge_documents)

TIER 4: IMMUTABLE ANALYSIS EXECUTION & RESULTS
├── scan_results (FK -> profiles, captures, analysis_jobs, questionnaire_responses, lifestyle_contexts)
├── visual_observations (FK -> scan_results)
├── multimodal_fusions (FK -> scan_results, fusion_configurations)
└── recommendation_items (FK -> scan_results, knowledge_chunks)

TIER 5: ROUTINES, LONGITUDINAL PROGRESS & SHARING
├── routines (FK -> profiles, scan_results)
├── routine_items (FK -> routines)
├── routine_tracking (FK -> profiles, routine_items)
├── progress_checkpoints (FK -> profiles, scan_results)
└── shared_reports (FK -> profiles, scan_results)
```

---

### 2. Relational Cardinality & Referential Integrity Matrix

| Parent Entity | Child Entity | Cardinality | Foreign Key Column in Child | On Delete Action | On Update Action | Integrity Rationale |
|---|---|---|---|---|---|---|
| `auth.users` | `profiles` | 1 : 1 | `profiles.id` | `CASCADE` | `CASCADE` | User profile is co-terminus with authentication record. |
| `profiles` | `user_preferences` | 1 : 1 | `user_preferences.user_id` | `CASCADE` | `CASCADE` | Preferences exist only while profile exists. |
| `profiles` | `consents` | 1 : N | `consents.user_id` | `CASCADE` | `CASCADE` | Consent history tied to user account lifecycle. |
| `profiles` | `questionnaire_responses` | 1 : N | `questionnaire_responses.user_id` | `CASCADE` | `CASCADE` | Intake responses purged when account deleted. |
| `profiles` | `lifestyle_contexts` | 1 : N | `lifestyle_contexts.user_id` | `CASCADE` | `CASCADE` | Lifestyle logs purged when account deleted. |
| `profiles` | `captures` | 1 : N | `captures.user_id` | `CASCADE` | `CASCADE` | Captures belong strictly to uploading user. |
| `captures` | `capture_quality_metrics` | 1 : 1 | `capture_quality_metrics.capture_id`| `CASCADE` | `CASCADE` | Quality metrics have no meaning without capture. |
| `profiles` | `analysis_jobs` | 1 : N | `analysis_jobs.user_id` | `CASCADE` | `CASCADE` | Background jobs owned by initiating user. |
| `profiles` | `scan_results` | 1 : N | `scan_results.user_id` | `CASCADE` | `CASCADE` | Analysis history purged on account erasure. |
| `captures` | `scan_results` | 1 : 0..1 | `scan_results.capture_id` | `SET NULL` | `CASCADE` | Scan record preserved even if raw image is purged post-extraction (DEC-004). |
| `scan_results` | `visual_observations` | 1 : 1 | `visual_observations.scan_id` | `CASCADE` | `CASCADE` | Observations are direct child component of scan. |
| `scan_results` | `multimodal_fusions` | 1 : 1 | `multimodal_fusions.scan_id` | `CASCADE` | `CASCADE` | Fusion vector is direct child component of scan. |
| `fusion_configurations` | `multimodal_fusions` | 1 : N | `multimodal_fusions.configuration_id`| `RESTRICT` | `RESTRICT` | Cannot delete an active or past fusion configuration. |
| `scan_results` | `recommendation_items` | 1 : N | `recommendation_items.scan_id` | `CASCADE` | `CASCADE` | Recommendations belong to specific scan snapshot. |
| `knowledge_chunks` | `recommendation_items` | 1 : N | `recommendation_items.knowledge_chunk_id` | `RESTRICT` | `RESTRICT` | Cannot delete a classical chunk if cited by a scan. |
| `profiles` | `routines` | 1 : N | `routines.user_id` | `CASCADE` | `CASCADE` | Daily routines purged when account deleted. |
| `routines` | `routine_items` | 1 : N | `routine_items.routine_id` | `CASCADE` | `CASCADE` | Items are structural components of the routine. |
| `routine_items` | `routine_tracking` | 1 : N | `routine_tracking.routine_item_id` | `CASCADE` | `CASCADE` | Adherence logs purged if routine item deleted. |
| `profiles` | `progress_checkpoints` | 1 : N | `progress_checkpoints.user_id` | `CASCADE` | `CASCADE` | Progress history purged on account erasure. |
| `profiles` | `shared_reports` | 1 : N | `shared_reports.user_id` | `CASCADE` | `CASCADE` | Public share links invalidated on account erasure. |
| `knowledge_sources` | `knowledge_documents` | 1 : N | `knowledge_documents.source_id` | `RESTRICT` | `RESTRICT` | Classical sources must not be orphaned. |
| `knowledge_documents` | `knowledge_chunks` | 1 : N | `knowledge_chunks.document_id` | `RESTRICT` | `RESTRICT` | Canonical documents must not be orphaned. |
| `research_subjects` | `expert_annotations` | 1 : N | `expert_annotations.subject_id` | `CASCADE` | `CASCADE` | Annotations evaluate specific research subject. |
| `research_subjects` | `consensus_labels` | 1 : 1 | `consensus_labels.subject_id` | `CASCADE` | `CASCADE` | Reference label belongs to research subject. |
