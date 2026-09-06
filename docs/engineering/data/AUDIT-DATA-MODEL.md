# AayurFace — Database Architecture Specification
## Security & Compliance Audit Log Data Architecture

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** TARGET / PROPOSED ARCHITECTURAL SPECIFICATION (REQUIRES VALIDATION; Implementation Pending)  
**Authority:** Principal Database Architect, Data Security Architect, Privacy Officer  

---

### 1. Explicit Data & Log Category Distinction

To prevent statutory privacy conflicts between immutable audit retention and right-to-erasure requirements, the data architecture explicitly distinguishes five separate categories of data and telemetry:

| Category | Definition | Example Artifacts | Mutability & Retention | Deletion Handling |
|---|---|---|---|---|
| **1. Security Audit Event** | Security and compliance telemetry recording system/admin actions. | `security_audit_events` | Append-only; WORM rule enforced; 365-day retention. | Zero direct PII retained; actor UUID decoupled upon account erasure. |
| **2. Operational Log** | Transient application execution and APM debugging telemetry. | Datadog/Sentry traces, console logs. | Ephemeral; 30-day rolling TTL. | Automatically rolled off via TTL; zero long-term retention. |
| **3. User Data** | User-owned wellness assessments, routines, and habits. | `scan_results`, `routines`, `routine_tracking`. | User-owned; active account lifespan. | **Hard-deleted** upon account erasure request via SQL cascade. |
| **4. Personal Identifiers** | Direct PII mapping to physical identity. | `profiles.email`, `profiles.full_name`. | Mutable; active account lifespan. | **Permanently obliterated** upon account erasure request. |
| **5. Deletion Tombstone** | Cryptographic proof of completed user erasure for DR reconciliation. | `deletion_tombstones(tenant_hash)`. | Permanent anonymous hash ledger. | Contains zero personal identifiers (SHA-256 hash only). |

---

### 2. Validation Requirements for WORM Audit Architecture (REQUIRES VALIDATION)

The proposed WORM audit architecture requires formal validation during Milestone 14:
1. **Privacy Interaction & Minimization Validation:** Verify that zero unnecessary personal information or biometric data is permanently retained in immutable audit records.
2. **Statutory Deletion Interaction:** Verify that deleting a user account cleanly detaches `actor_id` (`ON DELETE SET NULL`) without leaving orphaned PII in `event_payload` JSONB columns.
3. **Backup & PITR Behavior:** Validate that restoring a database snapshot does not introduce audit event sequence inconsistencies or restore deleted actors.
4. **Legal Retention Requirements:** Qualified legal review (*REQUIRES LEGAL REVIEW*) to verify that 365-day retention meets regional statutory requirements (DPDP Act 2023 / CERT-In guidelines).

---

### 2. Concrete WORM Audit Table Schema

```sql
-- Target Schema for Write-Once-Read-Many Audit Logging (Milestone 14)

CREATE TABLE security_audit_events (
    id UUID PRIMARY KEY, -- UUIDv7
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
        'AUTH_LOGIN_SUCCESS', 'AUTH_LOGIN_FAILURE', 'AUTH_MFA_CHALLENGE',
        'CONSENT_GRANTED', 'CONSENT_REVOKED',
        'ANALYSIS_JOB_CREATED', 'ANALYSIS_JOB_FAILED',
        'ADMIN_MUTATION', 'RLS_SECURITY_VIOLATION',
        'ACCOUNT_DELETION_REQUESTED', 'ACCOUNT_PURGE_COMPLETED',
        'REPORT_EXPORT_DOWNLOADED', 'REPORT_SHARE_CREATED', 'REPORT_SHARE_REVOKED'
    )),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('INFO', 'WARN', 'ERROR', 'CRITICAL')),
    actor_id UUID,                     -- Foreign key to auth.users (ON DELETE SET NULL)
    actor_role VARCHAR(20) NOT NULL,    -- 'authenticated', 'admin', 'service_role', 'anonymous'
    target_entity VARCHAR(50),          -- Table or asset name
    target_id UUID,                     -- Identifier of affected resource
    client_ip_subnet VARCHAR(50),       -- Truncated IP subnet (e.g., '192.168.1.0/24' for privacy)
    user_agent_hash VARCHAR(64),        -- SHA-256 of User-Agent
    correlation_id VARCHAR(64) NOT NULL,-- Distributed trace ID
    event_payload JSONB NOT NULL,       -- Structured event-specific context (Sanitized)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Kernel WORM Enforcement: Block UPDATE and DELETE at Database Engine Level
CREATE RULE audit_no_update AS ON UPDATE TO security_audit_events DO INSTEAD NOTHING;
CREATE RULE audit_no_delete AS ON DELETE TO security_audit_events DO INSTEAD NOTHING;
```

---

### 3. Automated PII Sanitization Invariant

Prior to inserting any event payload into `security_audit_events`, the edge gateway logging middleware applies mandatory scrubbing rules:
* Plain-text passwords, authorization headers, and JWT tokens are **REDACTED**.
* Base64 facial image strings and raw biometrics are **REDACTED**.
* Client IP addresses are truncated to `/24` subnets (IPv4) or `/48` prefixes (IPv6) to preserve geolocation context while complying with DPDP/GDPR privacy minimization requirements.
