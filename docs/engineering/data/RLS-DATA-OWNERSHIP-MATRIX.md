# AayurFace — Database Architecture Specification
## Row-Level Security (RLS) & Data Ownership Policy Matrix

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Data Security Architect  
**Implementation Notice:** Specifies target database security policies. Implementation and verification will be executed in **MILESTONE 04**.  

---

### 1. Default-Deny Security Kernel Standard

PostgreSQL Row-Level Security operates under an absolute **Default-Deny** principle:
* When RLS is enabled on a table (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`), all `SELECT`, `INSERT`, `UPDATE`, and `DELETE` queries return zero rows or throw permission errors unless explicitly permitted by an active policy.
* If a session context lacks a verified JWT (`auth.uid() IS NULL`), access is immediately rejected.

---

### 2. Comprehensive Entity RLS Policy Matrix

| Entity Name | Owner Key Column | SELECT Policy Expression | INSERT Policy Expression | UPDATE Policy Expression | DELETE Policy Expression | Admin Access | Research Access | System Worker Access | Cross-User Access Permitted? |
|---|---|---|---|---|---|---|---|---|---|
| `profiles` | `id` | `auth.uid() = id` | `auth.uid() = id` | `auth.uid() = id` (Disallows role updates) | `auth.uid() = id` | Read with audit log | Denied | Scoped Service Role | **DENIED** (Empty set / 404) |
| `user_preferences` | `user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | Denied | Denied | Scoped Service Role | **DENIED** |
| `consents` | `user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `false` (Immutable log) | `false` (Tombstone only) | Read with audit log | Denied | Scoped Service Role | **DENIED** |
| `questionnaire_responses` | `user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `false` (Immutable snapshot) | `auth.uid() = user_id` | Denied | De-identified view | Scoped Service Role | **DENIED** |
| `lifestyle_contexts` | `user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `false` (Immutable snapshot) | `auth.uid() = user_id` | Denied | De-identified view | Scoped Service Role | **DENIED** |
| `captures` | `user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` (Retention state only) | `auth.uid() = user_id` | Denied | Denied | Scoped Service Role | **DENIED** |
| `capture_quality_metrics` | via `capture_id` | `EXISTS (SELECT 1 FROM captures c WHERE c.id = capture_id AND c.user_id = auth.uid())` | Service Role / Gateway | `false` (Immutable) | Service Role / Cascade | Denied | De-identified view | Scoped Service Role | **DENIED** |
| `analysis_jobs` | `user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | Service Role / Worker | `auth.uid() = user_id` | Full Read | Denied | Scoped Service Role | **DENIED** |
| `scan_results` | `user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `false` (Immutable snapshot) | `auth.uid() = user_id` | Denied | De-identified view | Scoped Service Role | **DENIED** (Empty set / 404) |
| `visual_observations` | via `scan_id` | `EXISTS (SELECT 1 FROM scan_results s WHERE s.id = scan_id AND s.user_id = auth.uid())` | Service Role / Worker | `false` (Immutable) | Cascade from scan | Denied | De-identified view | Scoped Service Role | **DENIED** |
| `multimodal_fusions` | via `scan_id` | `EXISTS (SELECT 1 FROM scan_results s WHERE s.id = scan_id AND s.user_id = auth.uid())` | Service Role / Worker | `false` (Immutable) | Cascade from scan | Denied | De-identified view | Scoped Service Role | **DENIED** |
| `recommendation_items` | via `scan_id` | `EXISTS (SELECT 1 FROM scan_results s WHERE s.id = scan_id AND s.user_id = auth.uid())` | Service Role / Worker | `false` (Immutable) | Cascade from scan | Denied | Denied | Scoped Service Role | **DENIED** |
| `routines` | `user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | Denied | Denied | Scoped Service Role | **DENIED** |
| `routine_items` | via `routine_id` | `EXISTS (SELECT 1 FROM routines r WHERE r.id = routine_id AND r.user_id = auth.uid())` | `auth.uid() = (SELECT user_id FROM routines WHERE id = routine_id)` | `auth.uid() = (SELECT user_id FROM routines WHERE id = routine_id)` | Cascade from routine | Denied | Denied | Scoped Service Role | **DENIED** |
| `routine_tracking` | `user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | Denied | Denied | Scoped Service Role | **DENIED** |
| `progress_checkpoints` | `user_id` | `auth.uid() = user_id` | Service Role / Worker | `false` (Immutable snapshot) | `auth.uid() = user_id` | Denied | De-identified view | Scoped Service Role | **DENIED** |
| `shared_reports` | `user_id` | `(user_id = auth.uid()) OR (token_hash = hash(input) AND NOT is_revoked AND expires_at > NOW())` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | Denied | Denied | Scoped Service Role | **READ ONLY VIA TOKEN** |
| `questionnaire_templates` | N/A | `true` (Public Read) | `auth.role() = 'admin'` | `auth.role() = 'admin'` | `false` (Immutable) | Full CRUD | Public Read | Public Read | **PUBLIC READ** |
| `fusion_configurations`| N/A | `auth.role() = 'admin'` | `auth.role() = 'admin'` | `false` (Immutable) | `false` (Immutable) | Full CRUD | Read | Read | **ADMIN/INTERNAL ONLY** |
| `knowledge_*` Tables | N/A | `status = 'ACTIVE'` (Public) | `auth.role() = 'admin'` | `auth.role() = 'admin'` | `false` (Deprecated instead) | Full CRUD | Read | Read | **PUBLIC READ (Active)** |
| `research_subjects` | N/A | `auth.role() = 'researcher'` | `auth.role() = 'researcher'` | `false` (Immutable) | `false` | Full CRUD | Full Read | Scoped Service Role | **RESEARCH ONLY** |
| `expert_annotations` | `practitioner_id` | `practitioner_id = auth.uid()` | `practitioner_id = auth.uid()` | `false` (Locked) | `false` | Read Audit | Double-Blind Queue | Scoped Service Role | **BLIND QUEUE ONLY** |
| `consensus_labels` | N/A | `auth.role() = 'researcher'` | Senior Adjudicator / Worker | `false` (Immutable) | `false` | Full CRUD | Full Read | Scoped Service Role | **RESEARCH ONLY** |
| `security_audit_events`| N/A | `auth.role() = 'admin_security'` | Service Role / Trigger | `false` (WORM Rule) | `false` (WORM Rule) | Read Audit | Denied | Scoped Service Role | **SECURITY AUDIT ONLY** |
| `deletion_tombstones` | N/A | Service Role Only | Deletion Worker | `false` (Immutable) | `false` (Permanent) | Read Audit | Denied | Scoped Service Role | **SYSTEM ONLY** |
