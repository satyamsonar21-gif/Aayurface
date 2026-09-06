# Operational Contract: API Pagination & Filtering Standard
## Keyset Cursor Pagination, Whitelisted Filters & Query Safety

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Query Architecture  
**Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`  
**Authority:** Database Architect, Principal Backend Architect  

---

## 1. Keyset Cursor Pagination vs Offset Pagination

To eliminate $O(N)$ sequential scan degradation and prevent page drift during high-frequency inserts:

| Dimension | Keyset Cursor Pagination (Selected) | Traditional Offset Pagination (`LIMIT / OFFSET`) |
|---|---|---|
| **Query Complexity** | **$O(1)$ constant time:** Index seek using `WHERE (created_at, id) < (:cursor_time, :cursor_id)`. | **$O(N)$ linear degradation:** Database must read and discard all preceding rows. |
| **Page Drift Resistance** | **Immune:** New scans inserted at the head of the table do not cause duplicate rows on page 2. | **Vulnerable:** Inserts shift row positions, causing duplicates across page transitions. |
| **B-Tree Index Alignment** | **Optimal:** Aligns directly with composite index `(user_id, created_at DESC, id DESC)`. | **Poor:** Scans deep index pages under heavy offset loads. |

---

## 2. Cursor Format & Whitelisted Filter Controls

### Cursor Encoding:
The cursor string is a URL-safe Base64-encoded JSON payload containing the exact sort keys of the last record:

$$\text{Cursor} = \text{base64url}(\text{JSON.stringify}(\{ \text{"t"}: \text{"2026-09-03T20:30:05.420Z"}, \text{"i"}: \text{"018e3a2b..."} \}))$$

### Whitelisted Query Filters:
Arbitrary SQL `WHERE` clauses or unindexed dynamic filtering are barred at the gateway. Only explicitly indexed attributes are permitted:
* `startDate` & `endDate` (Bounded ISO 8601 strings)
* `doshaFilter` (`VATA` | `PITTA` | `KAPHA`)
* `limit` (Default 20; Maximum 50)
