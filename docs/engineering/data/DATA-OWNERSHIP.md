# AayurFace — Database Architecture Specification
## Data Ownership Architecture & Server-Derived Identity Governance

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Data Security Architect  

---

### 1. The Server-Side Identity Invariant

A fundamental vulnerability identified during the Phase 00 reconnaissance of `supabase/functions/analyze-skin/index.ts` is that the Edge Function accepted `userId` from the request body (`const { userId } = await req.json()`). In the target data architecture, this practice is completely eradicated:

> [!CRITICAL]
> **The Server-Side Identity Derivation Invariant**  
> Under NO circumstances shall any database query, API route, or background worker accept or trust a client-supplied user identifier (`request.body.userId`, query parameter `?userId=...`, or path variable) as proof of ownership or authorization.  
> The server **MUST** derive identity exclusively from the cryptographically verified JWT claim (`auth.uid()`). Any client request that supplies a mismatched `userId` in the body or URL shall be immediately rejected with HTTP 403 Forbidden or HTTP 404 Not Found.

---

### 2. Comprehensive Entity Ownership Framework

Every persistent database entity has an unambiguous, mathematically enforced owner:

| Entity Name | Owning Identity Column | Identity Source | Ownership Model | Cross-User Access Permitted? |
|---|---|---|---|---|
| `profiles` | `id` | `auth.uid()` | Direct User Ownership (1:1) | **STRICTLY PROHIBITED** |
| `user_preferences` | `user_id` | `auth.uid()` | Direct User Ownership (1:1) | **STRICTLY PROHIBITED** |
| `consents` | `user_id` | `auth.uid()` | Direct User Ownership (1:N) | **STRICTLY PROHIBITED** (Admin read audit only) |
| `questionnaire_responses` | `user_id` | `auth.uid()` | Direct User Ownership (1:N) | **STRICTLY PROHIBITED** |
| `lifestyle_contexts` | `user_id` | `auth.uid()` | Direct User Ownership (1:N) | **STRICTLY PROHIBITED** |
| `captures` | `user_id` | `auth.uid()` | Direct User Ownership (1:N) | **STRICTLY PROHIBITED** |
| `capture_quality_metrics` | `captures.user_id` | `auth.uid()` | Inherited via `capture_id` | **STRICTLY PROHIBITED** |
| `analysis_jobs` | `user_id` | `auth.uid()` | Direct User Ownership (1:N) | **STRICTLY PROHIBITED** |
| `scan_results` | `user_id` | `auth.uid()` | Direct User Ownership (1:N) | **STRICTLY PROHIBITED** |
| `visual_observations` | `scan_results.user_id`| `auth.uid()` | Inherited via `scan_id` | **STRICTLY PROHIBITED** |
| `multimodal_fusions` | `scan_results.user_id`| `auth.uid()` | Inherited via `scan_id` | **STRICTLY PROHIBITED** |
| `recommendation_items` | `scan_results.user_id`| `auth.uid()` | Inherited via `scan_id` | **STRICTLY PROHIBITED** |
| `routines` | `user_id` | `auth.uid()` | Direct User Ownership (1:N) | **STRICTLY PROHIBITED** |
| `routine_items` | `routines.user_id` | `auth.uid()` | Inherited via `routine_id` | **STRICTLY PROHIBITED** |
| `routine_tracking` | `user_id` | `auth.uid()` | Direct User Ownership (1:N) | **STRICTLY PROHIBITED** |
| `progress_checkpoints` | `user_id` | `auth.uid()` | Direct User Ownership (1:N) | **STRICTLY PROHIBITED** |
| `shared_reports` | `user_id` | `auth.uid()` | User-Owned (Public Shareable)| **READ-ONLY VIA TOKEN** |
| `questionnaire_templates` | N/A (System) | N/A | System Owned | **PUBLIC READ** |
| `fusion_configurations`| N/A (System) | N/A | System Owned | **INTERNAL READ** |
| `knowledge_*` Tables | N/A (Public Domain) | N/A | Editorial / Public Domain | **PUBLIC READ** |
| `research_subjects` | N/A (Research Enclave)| N/A | Research Enclave | **RESTRICTED TO RESEARCH ROLE** |
| `expert_annotations` | `practitioner_id` | `auth.uid()` | Practitioner Owned | **RESTRICTED (Double-Blind)** |
| `consensus_labels` | N/A (Research Enclave)| N/A | Research Benchmark | **RESTRICTED TO RESEARCH ROLE** |
| `security_audit_events`| N/A (Security Vault) | N/A | Platform Security Vault | **ADMIN SECURITY READ ONLY** |
| `deletion_tombstones` | N/A (Governance) | N/A | System Governance Vault | **SYSTEM ONLY** |

---

### 3. Anti-Enumeration 404 Invariant

When an authenticated user requests a user-owned resource by identifier (`GET /api/v1/analysis/{id}`):
* If the resource does not exist in the database: Return `HTTP 404 Not Found`.
* If the resource exists but belongs to a different user: **Return `HTTP 404 Not Found`** (never `HTTP 403 Forbidden`).
* **Security Rationale:** Returning `403` confirms to an attacker that a given UUID exists in the system, enabling brute-force tenant enumeration. Returning `404` conceals all cross-tenant existence.
