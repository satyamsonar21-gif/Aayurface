# AayurFace — Security Architecture Specification
## PostgreSQL Row-Level Security (RLS) Architecture

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Data Architect, Security Architect, Staff Backend Architect  
**Implementation Notice:** This document specifies the target database security architecture. RLS implementation, migration scripts, and test verifications are **PENDING IN MILESTONE 04**.  

---

### 1. The Kernel Multi-Tenancy Architecture

Row-Level Security (RLS) in PostgreSQL provides kernel-level data isolation:
* Even if an application-layer software bug occurs, an edge function forgets a `WHERE` clause, or an API gateway misroutes a request, the database engine kernel physically evaluates each row against the session's security context (`auth.uid()`).
* Queries executing under an authenticated user session physically cannot read, write, or delete rows belonging to other users.

```text
Database Connection Context: `request.jwt.claim.sub = 'usr-123'`
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│ PostgreSQL Query Engine (Kernel Execution)                   │
│ SELECT * FROM scan_results WHERE ...                        │
├─────────────────────────────────────────────────────────────┤
│ Physical RLS Filter Applied Automatically:                   │
│ AND user_id = auth.uid()                                    │
└─────────────────────────────┬───────────────────────────────┘
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼
       Row matches usr-123           Row belongs to usr-999
         [RETURN ROW]                  [PHYSICALLY SUPPRESSED]
                                       (Returns 0 rows)
```

---

### 2. Table Classification & Policy Specifications

| Table Name | Classification | Owner Key | SELECT Policy Expression | INSERT Policy Expression | UPDATE Policy Expression | DELETE Policy Expression | Service-Role Bypass | Admin Access | Failure Behavior |
|---|---|---|---|---|---|---|---|---|---|
| `profiles` | **USER-OWNED** | `id` | `auth.uid() = id` | `auth.uid() = id` | `auth.uid() = id` (Disallows role updates) | `auth.uid() = id` | Allowed | Read with audit log | Empty set / Abort |
| `consents` | **USER-OWNED** | `user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `false` (Immutable append-only log) | `false` (Tombstone only) | Allowed | Read with audit log | Empty set / Abort |
| `questionnaire_responses` | **USER-OWNED** | `user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | Allowed | Denied | Empty set / Abort |
| `lifestyle_contexts` | **USER-OWNED** | `user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | Allowed | Denied | Empty set / Abort |
| `captures` | **USER-OWNED** | `user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `false` (Immutable captures) | `auth.uid() = user_id` | Allowed | Denied | Empty set / Abort |
| `scan_results` | **USER-OWNED** | `user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `false` (Immutable snapshots) | `auth.uid() = user_id` | Allowed | Denied | Empty set / Abort |
| `routines` | **USER-OWNED** | `user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | Allowed | Denied | Empty set / Abort |
| `routine_tracking` | **USER-OWNED** | `user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | Allowed | Denied | Empty set / Abort |
| `shared_reports` | **SHARED** | `user_id` | `token_hash = hash(input) AND (expires_at IS NULL OR expires_at > NOW())` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | Allowed | Denied | Empty set / 404 |
| `knowledge_chunks` | **PUBLIC (VETTED)** | N/A | `true` (Public read for all users) | `auth.role() = 'admin'` | `auth.role() = 'admin'` | `auth.role() = 'admin'` | Allowed | Full CRUD | Empty set on write |
| `research_subjects` | **RESEARCH** | `id` | `auth.role() = 'researcher'` (De-identified view) | `auth.role() = 'researcher'` | `false` | `false` | Allowed | Full CRUD | Empty set / Abort |
| `expert_annotations` | **RESEARCH** | `practitioner_id`| `practitioner_id = auth.uid()` (Double-blind) | `practitioner_id = auth.uid()` | `false` | `false` | Allowed | Full CRUD | Empty set / Abort |

---

### 3. Concrete SQL Architectural Blueprint (For Milestone 04 Migration)

```sql
-- Architectural Blueprint for Milestone 04 Migration (Execution Strictly Forbidden in Phase 03)

-- 1. Enable RLS on User-Owned Tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifestyle_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE captures ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_tracking ENABLE ROW LEVEL SECURITY;

-- 2. Define Atomic Policies for User Profiles
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile non-privileged fields"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 3. Define Immutable Policies for Analysis Snapshots
CREATE POLICY "Users can view own scan results"
    ON scan_results FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scan results"
    ON scan_results FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Disallow updates to immutable scan results"
    ON scan_results FOR UPDATE
    TO authenticated
    USING (false);

-- 4. Define Public Read Policy for Curated Knowledge
ALTER TABLE knowledge_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to knowledge chunks"
    ON knowledge_chunks FOR SELECT
    TO anon, authenticated
    USING (true);
```

---

### 4. Performance & Policy Optimization Standards

To ensure that RLS does not introduce query degradation under high concurrent load:
1. **Single Indexed Column Invariant:** Every user-owned table must maintain a B-tree index on `(user_id)`.
2. **Atomic Evaluation:** RLS policy expressions must avoid nested sub-selects or cross-table joins wherever possible, relying exclusively on the fast atomic scalar comparison `USING (auth.uid() = user_id)`.
3. **Automated Policy Audit:** The CI/CD pipeline in Milestone 14 must execute an automated test asserting that 100% of user-owned tables have RLS enabled with active policies.
