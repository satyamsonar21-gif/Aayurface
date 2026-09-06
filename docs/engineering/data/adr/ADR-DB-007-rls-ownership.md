# Architecture Decision Record (ADR)
## ADR-DB-007: Row-Level Security (RLS) & Server-Side Identity Derivation

**Status:** TARGET  
**Date:** 2026-09-03  
**Deciders:** Principal Database Architect, Data Security Architect, Staff Backend Architect  
**Technical Category:** Data Security & Access Governance  

---

### Context & Problem Statement
In multi-tenant SaaS platforms, application-level authorization checks frequently fail due to developer oversights, missed `WHERE` clauses, or misconfigured API parameters. The existing prototype accepts `userId` directly from client request bodies. Without kernel-level isolation, an attacker manipulating UUIDs can execute Broken Object Level Authorization (BOLA / IDOR) attacks to inspect another user's private biometric and health records.

### Decision Drivers
1. **Zero-Trust Multi-Tenancy:** The database engine kernel must enforce tenant boundaries regardless of application layer bugs.
2. **Server-Derived Identity:** Eliminate client-supplied identity parameters (`request.body.userId`) as proof of ownership.
3. **Defense-in-Depth:** Guarantee that compromised service connections or SQL queries cannot accidentally read cross-tenant records.

### Decision Outcome
**Chosen Option: Mandatory PostgreSQL Row-Level Security (RLS) on 100% of User-Owned Tables with Server-Derived JWT Identity.**

#### Architecture Specifications:
* **Kernel Enforcement:** All user-owned tables (`profiles`, `consents`, `questionnaire_responses`, `lifestyle_contexts`, `captures`, `scan_results`, `routines`, `routine_tracking`, `progress_checkpoints`, `shared_reports`) enforce:
  `ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;`
* **Atomic Filter Policy:**
  `CREATE POLICY "<table_name>_owner_isolation" ON <table_name> FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);`
* **Server-Side Derivation:** All API endpoints extract the caller's identity exclusively from the cryptographically verified JWT claim (`context.auth.uid`). Client-supplied `userId` parameters are discarded or verified against `auth.uid()`.

### Consequences
* **Positive:** Mathematically eliminates cross-tenant data leakage at the database level; protects against SQL injection data exfiltration.
* **Negative:** Slight CPU evaluation overhead per query (mitigated by B-tree indexes on `(user_id)`); requires setting database local JWT context in serverless Deno edge workers.
* **Status Classification:** `TARGET` — scheduled for Milestone 04 implementation.
