# AayurFace — Database Architecture Specification
## Mathematical Capacity Models, Storage Growth & Infrastructure Estimates

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Performance Architect, Platform/SRE Architect  

---

### 1. Architectural Modeling Assumptions

To establish rigorous mathematical capacity estimates, the following operational assumptions are defined:
* **Active User Scanning Frequency:** 1 scan per user on Day 1; average of 2 scans per active user per month (24 scans/user/year).
* **Daily Adherence Tracking:** Active users complete an average of 2 daily rituals (60 `routine_tracking` rows/user/month).
* **Relational Row Sizes (Averages):**
  * `profiles` + `user_preferences`: $\approx 500\text{ bytes}$
  * `scan_results` + `visual_observations` + `multimodal_fusions`: $\approx 1.2\text{ KB}$
  * `recommendation_items` (3 per scan): $\approx 300\text{ bytes} \times 3 = 900\text{ bytes}$
  * `routine_tracking` event: $\approx 80\text{ bytes}$
  * Total relational footprint per scan: $\approx 2.1\text{ KB}$
* **Biometric S3 Capture Size:** High-resolution compressed JPEG $\approx 1.5\text{ MB}$ per photo.
* **Classical RAG Corpus:** Fixed at 25,000 vetted chunks; 1536-dimensional float32 vector $\approx 6\text{ KB}$ per chunk.

---

### 2. Multi-Scale Capacity Projections

| Operational Scale Dimension | 1,000 Users (MVP) | 10,000 Users (Growth) | 100,000 Users (Scale) | 1,000,000 Users (Mature Enterprise) |
|---|---|---|---|---|
| **Cumulative Scans / Year** | 24,000 scans | 240,000 scans | 2,400,000 scans | 24,000,000 scans |
| **`scan_results` Rows** | 24,000 rows | 240,000 rows | 2,400,000 rows | 24,000,000 rows |
| **`routine_tracking` Rows** | 720,000 rows | 7,200,000 rows | 72,000,000 rows | 720,000,000 rows (Partitioning required)|
| **PostgreSQL Table Data Size** | $\approx 110\text{ MB}$ | $\approx 1.1\text{ GB}$ | $\approx 11.5\text{ GB}$ | $\approx 118\text{ GB}$ |
| **PostgreSQL B-Tree Index Size**| $\approx 65\text{ MB}$ | $\approx 650\text{ MB}$ | $\approx 6.8\text{ GB}$ | $\approx 72\text{ GB}$ |
| **pgvector HNSW Index Size** | $\approx 210\text{ MB}$ (Fixed corpus)| $\approx 210\text{ MB}$ | $\approx 210\text{ MB}$ | $\approx 250\text{ MB}$ |
| **Total Database RAM Required** | $\ge 2\text{ GB}$ | $\ge 4\text{ GB}$ | $\ge 16\text{ GB}$ | $\ge 64\text{ GB}$ |
| **S3 Biometric Storage (30d TTL)**| $\approx 3.0\text{ GB}$ | $\approx 30.0\text{ GB}$ | $\approx 300\text{ GB}$ | $\approx 3.0\text{ TB}$ |
| **S3 Biometric Storage (If No Purge)**| $\approx 36.0\text{ GB}$ | $\approx 360\text{ GB}$ | $\approx 3.6\text{ TB}$ | $\approx 36.0\text{ TB}$ |
| **Daily Peak IOPS** | $< 50\text{ IOPS}$ | $\approx 200\text{ IOPS}$ | $\approx 1,500\text{ IOPS}$ | $\approx 12,000\text{ IOPS}$ |
| **Daily Full Backup Snapshot Size**| $\approx 180\text{ MB}$ | $\approx 1.8\text{ GB}$ | $\approx 18.5\text{ GB}$ | $\approx 190\text{ GB}$ |
| **Estimated Monthly DB Hosting Cost**| $\approx \$25\text{/mo}$ (Supabase Pro) | $\approx \$50\text{/mo}$ | $\approx \$250\text{/mo}$ | $\approx \$1,200\text{/mo}$ |

---

### 3. Key Architectural Observations

1. **Relational Storage is Extremely Lean:** Because raw image binaries never touch PostgreSQL, 100,000 users with millions of scans consume only $\approx 18.3\text{ GB}$ of total database disk space (tables + indexes).
2. **`routine_tracking` Requires Partitioning at 1M Users:** At 1,000,000 users, daily habit tracking generates 720 million rows per year. The table must be partitioned by range (`tracking_date`) annually to keep B-tree indexes fit within RAM.
3. **Biometric Storage Dominates Costs if Unmanaged:** If raw photos are retained permanently instead of following DEC-004 automated purging, S3 storage explodes to 36 TB/year at 1M users, generating significant unnecessary cloud storage expenses.
