# Architecture Decision Record (ADR)
## ADR-DB-010: Retention & Deletion — Cascading Hard Purge & Disaster Recovery Tombstones

**Status:** TARGET  
**Date:** 2026-09-03  
**Deciders:** Principal Database Architect, Privacy Officer, Platform/SRE Architect  
**Technical Category:** Data Lifecycle, Privacy & Disaster Recovery  

---

### Context & Problem Statement
When a user exercises their right to erasure (account deletion under DPDP Act 2023 or GDPR), personal data must be permanently purged across both PostgreSQL relational tables and S3 object storage. Two critical failure modes exist:
1. **Orphan Accumulation:** Deleting a database record without deleting S3 objects leaves orphaned biometric facial images in storage indefinitely.
2. **Disaster Recovery Resurrection:** If production suffers a major failure and is restored from an encrypted daily backup snapshot taken prior to a deletion request, previously deleted users are resurrected into live production, violating statutory erasure mandates.

### Decision Drivers
1. **Complete Obliteration:** Guarantee 100% eradication of biometric facial captures, routines, and historical assessments upon user deletion.
2. **Atomicity & Idempotency:** Ensure that partial network failures during deletion can be retried safely without leaving orphaned records.
3. **Resurrection Prevention:** Prevent restored database backups from re-introducing deleted accounts into production.

### Decision Outcome
**Chosen Option: Asynchronous Multi-Service Purge Worker with Immutable Anonymous Tombstone Reconciliation.**

#### Architecture Specifications:
* **Asynchronous Deletion State Machine:**
  * Step 1: User status set to `PENDING_DELETION`; active JWT and refresh tokens invalidated.
  * Step 2: S3 worker issues hard `DeleteObjects` API call for all objects under `facial-captures/{userId}/*` and `reports/{userId}/*`.
  * Step 3: Database transaction executes `DELETE FROM auth.users WHERE id = :userId`, cascading through foreign keys to delete profiles, scans, routines, and questionnaire responses.
* **Anonymous Tombstone Vault (`deletion_tombstones`):**
  * When deletion completes, an anonymous tombstone is written to an immutable table:
    `{ tenant_hash: SHA-256(userId), purged_at: NOW(), compliance_authority: 'DPDP_GDPR' }`
  * Contains zero direct PII or biometric references.
* **Post-Restoration Reconciliation Script:**
  * If a disaster recovery event requires restoring from a point-in-time backup snapshot, an automated post-restore script queries `deletion_tombstones`.
  * The script re-executes hard deletes for any user IDs whose hash exists in the tombstone ledger with a timestamp newer than the snapshot date, preventing account resurrection.

### Consequences
* **Positive:** Absolute compliance with user erasure rights; eliminates orphaned S3 biometrics; provides mathematically verifiable disaster recovery compliance.
* **Negative:** Requires maintaining asynchronous worker queues and a dedicated disaster recovery reconciliation script.
* **Status Classification:** `TARGET` — scheduled for Milestone 13 implementation.
