# Architecture Decision Record (ADR)
## ADR-DB-013: Audit Data Architecture — Immutable WORM Telemetry & Separation of Concerns

**Status:** PROPOSED / TARGET  
**Date:** 2026-09-03  
**Deciders:** Principal Database Architect, Data Security Architect, Platform/SRE Architect  
**Technical Category:** Audit Logging & Forensic Traceability  

---

### Context & Problem Statement
Security, regulatory compliance (DPDP, HIPAA/GDPR guidance), and operational debugging require capturing audit events for critical actions: authentication failures, RLS cross-tenant denials, administrative mutations, consent grants/revocations, and account purges. If audit events are stored inside standard application tables with normal write permissions, a compromised administrative account or SQL injection exploit could truncate or tamper with audit records to conceal an intrusion.

### Decision Drivers
1. **Tamper Evidence:** Audit logs must be append-only; update and delete operations must be physically rejected.
2. **Performance Isolation:** High-volume operational logging must not saturate database write throughput or lock consumer tables.
3. **Data Redaction:** Guarantee that audit events never store raw passwords, tokens, or base64 facial images.
4. **Forensic Integrity:** Provide non-repudiable proof of administrative and user actions.

### Decision Outcome
**Chosen Option: Segregated Immutable Table Architecture (`security_audit_events`) with PostgreSQL Rule/Trigger Enforcement.**

#### Architecture Specifications:
* **Table Definition:** `security_audit_events` with columns: `id` (UUIDv7), `event_type`, `severity`, `actor_id`, `actor_role`, `target_entity`, `target_id`, `client_ip_subnet`, `correlation_id`, `event_payload` (JSONB), and `created_at`.
* **Immutability Enforcement:**
  ```sql
  -- Disallow all UPDATE and DELETE operations at the database kernel level
  CREATE RULE audit_no_update AS ON UPDATE TO security_audit_events DO INSTEAD NOTHING;
  CREATE RULE audit_no_delete AS ON DELETE TO security_audit_events DO INSTEAD NOTHING;
  ```
* **Separation of Streams:**
  * Application APM / debug traces stream externally to Datadog/Sentry (30d retention).
  * Security and compliance audit events persist in `security_audit_events` (365d retention).
* **Automated Redaction:** The API logger sanitizes all payload data before inserting into `security_audit_events`.

### Consequences
* **Positive:** Non-repudiable, tamper-evident audit history; survives application layer breaches; simplifies compliance audits without retaining unnecessary PII.
* **Negative:** Requires careful index management and automated PII minimization to prevent large audit tables from retaining sensitive identifiers.
* **Status Classification:** `TARGET / PROPOSED ARCHITECTURE (REQUIRES VALIDATION & IMPLEMENTATION)` — scheduled for Milestone 14 implementation. Requires validation of PII scrubbing and interaction with user account erasure cascades.
