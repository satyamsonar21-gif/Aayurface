# Architecture Decision Record (ADR)
## ADR-DB-012: Deletion Strategy — Granular Cascade Rules vs Soft-Delete Tombstones

**Status:** TARGET  
**Date:** 2026-09-03  
**Deciders:** Principal Database Architect, Data Architect, Security Architect  
**Technical Category:** Data Integrity & Lifecycle Management  

---

### Context & Problem Statement
Relational schemas frequently suffer from two opposing deletion anti-patterns:
1. **Uncontrolled `ON DELETE CASCADE` everywhere:** Deleting a parent entity inadvertently wipes out essential historical audit logs, research benchmarks, or shared references.
2. **Soft-Delete (`is_deleted = TRUE`) everywhere:** Using soft deletes blindly causes active queries to inadvertently leak "deleted" records when a developer forgets `WHERE is_deleted = FALSE`, violates GDPR/DPDP right-to-erasure requirements, and bloats indexes with inactive data.

### Decision Drivers
1. **Statutory Erasure Compliance:** Personal data and facial biometrics must be physically eradicated upon account deletion, not merely hidden behind a soft-delete flag.
2. **Referential Integrity:** Ensure deletion of dependent records does not leave dangling pointers.
3. **Audit Immutability:** Audit records and compliance proof must survive account deletions.
4. **Editorial Integrity:** Retiring a classical knowledge document must not delete historical scan records that referenced it.

### Decision Outcome
**Chosen Option: Selective Tri-Partite Strategy — Hard Cascade for User Data, RESTRICT for Editorial Knowledge, and Anonymous Tombstones for Deletions.**

#### Specific Architectural Rules:
| Relationship | Deletion Action | Rationale |
|---|---|---|
| `auth.users` $\rightarrow$ `profiles` | `ON DELETE CASCADE` | Physical eradication of personal identity. |
| `profiles` $\rightarrow$ `consents` | `ON DELETE CASCADE` | Consents tied to user account lifecycle. |
| `profiles` $\rightarrow$ `questionnaire_responses` | `ON DELETE CASCADE` | Personal health inputs physically erased. |
| `profiles` $\rightarrow$ `lifestyle_contexts` | `ON DELETE CASCADE` | Personal wellness context physically erased. |
| `profiles` $\rightarrow$ `captures` | `ON DELETE CASCADE` | Capture metadata eradicated; coordinates with S3 object deletion. |
| `profiles` $\rightarrow$ `scan_results` | `ON DELETE CASCADE` | Historical analyses physically erased upon account deletion. |
| `scan_results` $\rightarrow$ `visual_observations` | `ON DELETE CASCADE` | Observations have zero independent existence without parent scan. |
| `scan_results` $\rightarrow$ `multimodal_fusions` | `ON DELETE CASCADE` | Fusion vectors are direct child components of the scan snapshot. |
| `scan_results` $\rightarrow$ `recommendation_items` | `ON DELETE CASCADE` | Recommendations are direct child components of the scan snapshot. |
| `knowledge_chunks` $\rightarrow$ `recommendation_items` | `ON DELETE RESTRICT` | Prevents deleting an active or historical knowledge chunk if referenced. |
| `profiles` $\rightarrow$ `research_subjects` | `SET NULL` / Decoupled | Subject record in research enclave retains anonymous ID; PII detached. |
| `auth.users` $\rightarrow$ `security_audit_events` | `ON DELETE SET NULL` | Audit logs must persist permanently; user ID nulled and replaced by hash. |

### Consequences
* **Positive:** Guaranteed physical erasure of sensitive personal data; zero accidental deletion of classical knowledge or audit logs; no complex `is_deleted` filter bugs.
* **Negative:** Requires rigorous foreign key constraint management and deliberate orchestration order during account erasure.
* **Status Classification:** `TARGET` — scheduled for Milestone 04 implementation.
