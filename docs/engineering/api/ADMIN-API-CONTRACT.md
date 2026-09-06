# API Contract: Administration & Security Audit
## Role-Based Admin Operations, Audit Inspection & Knowledge Curation

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Administration & Security  
**Status:** `TARGET ARCHITECTURE / PROPOSED (REQUIRES IMPLEMENTATION)`  
**Authority:** Security Architect, Principal Backend Architect  

---

## 1. API-ADM-001: Inspect Security Audit Events (`GET /api/v1/admin/audit-events`)

* **HTTP Method:** `GET`
* **Path:** `/api/v1/admin/audit-events`
* **Actor:** Security Officer (Role: `admin_security` with active MFA claim)
* **Purpose:** Forensic review of authentication failures, RLS violations, and account erasures.

### Query Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `eventType` | String | None | Filter by event type (`AUTH_LOGIN_FAILURE`, `RLS_SECURITY_VIOLATION`, etc.). |
| `severity` | Enum | None | Filter by severity (`INFO`, `WARN`, `ERROR`, `CRITICAL`). |
| `startDate` | ISO Date String | None | Filter logs on or after timestamp. |
| `limit` | Integer | `50` | Maximum log records per page (max 100). |

### Success Response (`200 OK`)

```json
{
  "data": [
    {
      "id": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f92",
      "eventType": "RLS_SECURITY_VIOLATION",
      "severity": "WARN",
      "actorId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f80",
      "actorRole": "authenticated",
      "targetEntity": "scan_results",
      "targetId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f70",
      "clientIpSubnet": "192.168.1.0/24",
      "correlationId": "corr_018e3a2b8c4d",
      "createdAt": "2026-09-03T19:15:00.000Z"
    }
  ],
  "meta": {
    "requestId": "req_adm_audit_01",
    "timestamp": "2026-09-03T20:30:00.050Z"
  }
}
```

---

## 2. API-ADM-002: Ingest Classical Knowledge Chunk (`POST /api/v1/admin/knowledge-chunks`)

* **HTTP Method:** `POST`
* **Path:** `/api/v1/admin/knowledge-chunks`
* **Actor:** Chief Ayurvedic Scholar (Role: `admin_editorial` with active MFA claim)
* **Execution:** Inserts chunk $\rightarrow$ generates 1536-dim OpenAI embedding $\rightarrow$ inserts HNSW vector in `knowledge_chunks`.

### Request Body & Zod Schema

```typescript
export const IngestKnowledgeChunkSchema = z.object({
  sourceWork: z.enum(['Charaka Samhita', 'Sushruta Samhita', 'Ashtanga Hridaya', 'Bhavaprakasha']),
  sectionReference: z.string().min(1).max(100),
  verseNumbers: z.string().min(1).max(50),
  contentSanskrit: z.string().min(10),
  contentEnglish: z.string().min(10),
  contentHindi: z.string().optional(),
  targetDosha: z.enum(['VATA', 'PITTA', 'KAPHA', 'GENERAL_WELLNESS']),
  contraindications: z.string().optional(),
  approvedByScholars: z.array(z.string().uuid()).min(2) // Dual-scholar sign-off
}).strict();
```

### Success Response (`201 Created`)

```json
{
  "data": {
    "chunkId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f93",
    "sourceWork": "Charaka Samhita",
    "tokenCount": 142,
    "embeddingGenerated": true,
    "status": "ACTIVE",
    "version": "v1.0.0",
    "createdAt": "2026-09-03T20:31:00.000Z"
  },
  "meta": {
    "requestId": "req_adm_chunk_01",
    "timestamp": "2026-09-03T20:31:00.350Z"
  }
}
```
