# Architecture Decision Record (ADR)
## ADR-DB-001: Identifier Strategy — Sequential UUIDv7 vs Random UUIDv4

**Status:** PROPOSED  
**Date:** 2026-09-03  
**Deciders:** Principal Database Architect, Staff Backend Architect, Security Architect  
**Technical Category:** Data Modeling & Storage Performance  

---

### Context & Problem Statement
AayurFace requires a distributed, globally unique identifier strategy for all persistent database entities. The current prototype (`supabase/schema.sql`) uses `UUID DEFAULT gen_random_uuid()` (UUIDv4) for all primary keys. While UUIDv4 provides strong 122-bit randomness and absolute resistance to enumeration attacks, random UUIDs suffer from index fragmentation and poor B-tree leaf page locality under high-volume insert workloads. Because UUIDv4 values are non-sequential, every insert scatters randomly across the B-tree index, causing frequent cache misses and excessive disk I/O when tables exceed available RAM.

### Decision Drivers
1. **Enumeration Resistance:** Identifiers must not be guessable or sequential integers that expose business volume or enable IDOR attacks.
2. **Index Locality & Performance:** High-frequency insert tables (`scan_results`, `visual_observations`, `routine_tracking`, `security_audit_events`) must maintain contiguous index leaf writes.
3. **Client-Side Generation:** Ability for clients and edge workers to generate valid primary keys without a database round-trip.
4. **PostgreSQL Compatibility:** Native support or low-overhead extension compatibility in PostgreSQL 15+.

### Considered Options
* **Option 1: Standard UUIDv4 (`gen_random_uuid()`):** 100% random 128-bit UUID.
* **Option 2: BigSerial / Auto-Incrementing Integers:** Sequential 64-bit integer IDs.
* **Option 3: Time-Sorted UUIDv7 (Proposed):** Unix-epoch millisecond timestamp prefix (48 bits) followed by 74 bits of cryptographic randomness.

### Decision Outcome
**Chosen Option: Option 3 (Time-Sorted UUIDv7 for High-Frequency Operational Entities) with Option 1 (UUIDv4 for User-Facing External Tokens).**

#### Technical Specifications:
* High-frequency operational tables (`scan_results`, `visual_observations`, `multimodal_fusions`, `captures`, `routine_tracking`, `security_audit_events`) will use **UUIDv7** primary keys. Because UUIDv7 values are naturally monotonic with respect to time, inserts append to the right edge of B-tree indexes, reducing page splits by up to 90% and preserving cache locality.
* Ephemeral public tokens (`shared_reports.token_hash`, password reset tokens) will utilize pure cryptographic 256-bit random tokens.
* `profiles.id` directly inherits the foreign key `auth.users.id` issued by Supabase Auth (UUIDv4).

### Consequences
* **Positive:** Massive reduction in B-tree index fragmentation; high insert throughput; natural temporal ordering without requiring separate timestamp index lookups.
* **Negative:** PostgreSQL does not yet have a native `gen_random_uuidv7()` built-in function prior to v17; requires a standard lightweight PL/pgSQL function or client-side generation using `uuidv7` libraries in Deno edge workers.
* **Status Classification:** `PROPOSED` — implementation scheduled for Milestone 04 database initialization.
