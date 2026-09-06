# Security Contract: Resource Ownership & Anti-BOLA Matrix
## Server-Authoritative Identity, Anti-IDOR Policies & Cross-Tenant Defenses

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Authorization & Data Isolation  
**Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION & PENETRATION TESTING)`  
**Authority:** Security Architect, Principal Backend Architect  

---

## 1. Resource Ownership & Access Policy Matrix

Every persistent entity in AayurFace is governed by strict ownership invariants enforced at both the **Edge Gateway API Layer** and the **PostgreSQL Kernel Row-Level Security (RLS) Layer**:

| Resource / Entity Name | Primary Owner Key | Read Authorization Policy | Write / Update Policy | Delete Authorization Policy | Cross-Tenant Attempt Behavior |
|---|---|---|---|---|---|
| `profiles` | `id` (`= auth.uid()`) | Owner Only (`auth.uid() = id`) | Owner Only | Owner (Cascade Purge) | **`404 Not Found`** |
| `user_preferences` | `user_id` (`= auth.uid()`) | Owner Only | Owner Only | Owner (Cascade Purge) | **`404 Not Found`** |
| `consents` | `user_id` (`= auth.uid()`) | Owner Only | Owner (Append-Only) | Blocked (Immutable Audit) | **`404 Not Found`** |
| `questionnaire_responses`| `user_id` (`= auth.uid()`) | Owner Only | Owner (Append-Only) | Owner (Cascade Purge) | **`404 Not Found`** |
| `lifestyle_contexts` | `user_id` (`= auth.uid()`) | Owner Only | Owner (Append-Only) | Owner (Cascade Purge) | **`404 Not Found`** |
| `captures` | `user_id` (`= auth.uid()`) | Owner & Worker | Owner (Creation Only)| Owner (Cascade Purge) | **`404 Not Found`** |
| `analysis_jobs` | `user_id` (`= auth.uid()`) | Owner & Worker | Worker Only (State) | Owner (Cascade Purge) | **`404 Not Found`** |
| `scan_results` | `user_id` (`= auth.uid()`) | Owner Only | Worker (Creation Only)| Owner (Cascade Purge) | **`404 Not Found`** |
| `visual_observations` | Direct via `scan_results` | Owner Only | Worker Only | Owner (Cascade Purge) | **`404 Not Found`** |
| `multimodal_fusions` | Direct via `scan_results` | Owner Only | Worker Only | Owner (Cascade Purge) | **`404 Not Found`** |
| `recommendation_items` | Direct via `scan_results` | Owner Only | Worker Only | Owner (Cascade Purge) | **`404 Not Found`** |
| `routines` | `user_id` (`= auth.uid()`) | Owner Only | Owner Only | Owner (Cascade Purge) | **`404 Not Found`** |
| `routine_tracking` | `user_id` (`= auth.uid()`) | Owner Only | Owner Only | Owner (Cascade Purge) | **`404 Not Found`** |
| `progress_checkpoints` | `user_id` (`= auth.uid()`) | Owner Only | Engine (Creation Only)| Owner (Cascade Purge) | **`404 Not Found`** |
| `chat_messages` | `user_id` (`= auth.uid()`) | Owner Only | Owner & Assistant | Owner (Cascade Purge) | **`404 Not Found`** |
| `shared_reports` | `user_id` (`= auth.uid()`) | Owner (CRUD) + Anonymous Public (`token`) | Owner Only | Owner Only (Revoke) | Public view if valid token; else `404` |
| `security_audit_events` | System Vault | Security Admin (`admin_sec`)| System Triggers Only | Blocked (Kernel WORM Rule)| **`403 Forbidden`** |
| `research.*` | Isolated Enclave | Researcher (`practitioner`) | Practitioner (Lock) | Blocked (De-Identified Cohort)| **`403 Forbidden`** |

---

## 2. Anti-BOLA / IDOR Defense Rules

1. **Uniform `404 Not Found` Response:** When User A attempts to read or mutate User B's resource (`GET /api/v1/analyses/userB_uuid`), the backend deliberately returns `404 Not Found` rather than `403 Forbidden`. This prevents malicious actors from enumerating valid resource IDs.
2. **Zero Client Header Trust:** Headers such as `X-User-Id`, `X-Target-User`, or body fields specifying `userId` are automatically stripped at the gateway. The entity query is hardcoded to `WHERE id = :param AND user_id = auth.uid()`.
3. **Security Audit Emission:** Any cross-tenant access attempt detected at the gateway or database layer immediately triggers an immutable `RLS_SECURITY_VIOLATION` event recorded in `security_audit_events`.
