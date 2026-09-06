# ADR-API-007: API Pagination Strategy (Keyset Cursor vs Offset)

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Context:**  
Longitudinal scan feeds and audit logs will scale to millions of rows. Traditional SQL `OFFSET` pagination causes $O(N)$ query degradation and page drift when new scans are inserted.

**Decision:**  
All high-volume list feeds (`/api/v1/history`, `/api/v1/admin/audit-events`) implement **Keyset Cursor Pagination** utilizing composite index seeks on `(user_id, created_at DESC, id DESC)`.

**Consequences:**  
* Guarantees deterministic $O(1)$ constant-time page retrieval regardless of history depth.
* Eliminates phantom duplicates and missing items when new scans are created during pagination.

**Truth Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`
