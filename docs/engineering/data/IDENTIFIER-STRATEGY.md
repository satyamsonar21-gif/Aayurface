# AayurFace — Database Architecture Specification
## Identifier Strategy & Key Generation Architecture

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** PROPOSED ARCHITECTURAL SPECIFICATION (Implementation Pending)  
**Authority:** Principal Database Architect, Data Security Architect  

---

### 1. The Primary Key Dilemma

AayurFace handles sensitive user identities, high-frequency biometric ingestions, and public sharing links. Selecting an identifier strategy requires balancing two conflicting constraints:
1. **Security & Anti-Enumeration:** Identifiers exposed over APIs must never be predictable or sequential integers (`id: 1, 2, 3`), which leak business volume and facilitate BOLA/IDOR scraping.
2. **B-Tree Index Locality:** Completely random identifiers (UUIDv4) randomly scatter inserts across disk pages, causing catastrophic cache misses and B-tree page splits as tables exceed available RAM.

---

### 2. Comprehensive Identifier Taxonomy & Evaluation

| Identifier Type | Structure & Entropy | Temporal Sorting | B-Tree Write Performance | Enumeration Resistance | Distributed Generation | Recommendation in AayurFace | Status |
|---|---|---|---|---|---|---|---|
| **BigSerial (Integer)** | 64-bit sequential integer | Strict sequential | **Optimal** (Right-edge append) | **ZERO** (Easily guessable; catastrophic for BOLA) | Poor (Central DB sequence required) | **STRICTLY PROHIBITED** for all domain entities. | Prohibited |
| **UUIDv4 (`gen_random_uuid`)**| 122-bit pure cryptographic pseudo-randomness | None (Completely scattered) | **Poor** (Causes random page splits) | **Maximum** ($2^{122}$ entropy) | Excellent (Native client/edge generation) | **TARGET** for Auth User IDs (`auth.users.id`) and Public Entities. | Target Standard |
| **UUIDv7 (RFC 9562)** | 48-bit millisecond timestamp + 74-bit random | Monotonically sorted by time | **Near-Optimal** (Append-only locality) | **Maximum** ($2^{74}$ randomness within same ms) | Excellent (Client/edge workers generate safely) | **PROPOSED** for High-Frequency Operational Tables. | Proposed Standard |
| **High-Entropy Tokens** | 256-bit cryptographically secure random string | None | N/A (Stored as SHA-256 hash) | **Absolute** ($2^{256}$ entropy) | Serverless `crypto.getRandomValues()` | **TARGET** for Public Share Links (`/share/{token}`). | Target Standard |

---

### 3. Concrete Primary Key Allocation Strategy

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. USER IDENTITY ROOT: `profiles.id` (UUIDv4)                               │
│ Generated exclusively by Supabase Auth (`auth.users.id`).                    │
│ Randomness prevents user volume enumeration across registration endpoints.  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. HIGH-FREQUENCY OPERATIONAL TABLES: UUIDv7 (PROPOSED)                     │
│ Tables: `scan_results`, `visual_observations`, `multimodal_fusions`,        │
│         `captures`, `routine_tracking`, `security_audit_events`.            │
│ 48-bit timestamp prefix guarantees sequential B-tree writes; 74-bit entropy │
│ prevents collision or guessing within the same millisecond.                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. PUBLIC SHARING LINKS: 256-Bit Opaque Cryptographic Tokens                │
│ Table: `shared_reports.token_hash`                                          │
│ 32-byte cryptographically secure random token generated at Edge.            │
│ The URL displays the raw token; the database stores only the SHA-256 hash.  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 4. Implementation Guidance for Milestone 04

Because PostgreSQL 15/16 does not feature a built-in C-level `gen_random_uuidv7()` function (native support arrives in PostgreSQL 17), the architecture provides two approved implementation paths for Milestone 04:
1. **Client / Worker Side Generation (Recommended):** Deno Edge Functions generate UUIDv7 identifiers using standard, audited TypeScript libraries (`import { v7 as uuidv7 } from 'uuid'`) before executing database inserts.
2. **Database PL/pgSQL Function Fallback:** A standardized, zero-dependency PL/pgSQL function extracting `CLOCK_TIMESTAMP()` and packing the 48-bit epoch into a UUID type.
