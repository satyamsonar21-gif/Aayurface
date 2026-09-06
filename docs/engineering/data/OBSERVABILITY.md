# AayurFace — Database Architecture Specification
## Database Observability, Telemetry & Performance Monitoring

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Performance Architect, Platform/SRE Architect  

---

### 1. Database Telemetry Metrics & SLIs

To guarantee predictable latency and prevent silent database degradation, five core Service Level Indicators (SLIs) are tracked:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ CORE DATABASE SERVICE LEVEL INDICATORS (SLIs)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. Point Read Latency: p95 <= 15ms (Profiles, latest analysis, routines)     │
│ 2. Vector Search Latency: p95 <= 25ms (pgvector HNSW cosine search)         │
│ 3. Connection Pool Saturation: Active connections <= 70% of max pool cap     │
│ 4. Slow Query Volume: Queries executing > 100ms must be < 0.1% of total QPS │
│ 5. Lock Contention: Zero queries blocked on row locks > 500ms               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Operational Thresholds & Automated Alerting Rules

| Metric Name | Warning Threshold | Critical Alert Threshold | Automated Mitigation / Remediation Protocol |
|---|---|---|---|
| **Slow Queries** | Query runtime $> 50\text{ms}$ | Query runtime $> 100\text{ms}$ | Log SQL text and `EXPLAIN (ANALYZE, BUFFERS)` to Datadog APM; trigger PagerDuty alert if $> 5\text{ events/min}$. |
| **HNSW Search Time** | Vector search $> 30\text{ms}$ | Vector search $> 50\text{ms}$ | Inspect RAM buffer cache hit ratio; adjust `hnsw.ef_search` from 40 down to 30. |
| **Connection Pool** | Pool utilization $> 75\%$ | Pool utilization $> 85\%$ | Scale Supabase PgBouncer pooler pool size; verify edge functions are closing connections properly. |
| **Deadlock Contention** | 1 deadlock / hour | $\ge 3$ deadlocks / hour | Investigate concurrent transactions; assert uniform multi-table lock acquisition ordering. |
| **Table Bloat** | Dead tuples $> 15\%$ on `routine_tracking` | Dead tuples $> 25\%$ | Trigger targeted manual `VACUUM ANALYZE` on table; verify autovacuum worker settings. |
| **RLS Overhead** | RLS evaluation adds $> 5\text{ms}$ to query | RLS adds $> 10\text{ms}$ | Verify B-tree index on `(user_id)` exists; eliminate subqueries inside RLS policies. |

---

### 3. PostgreSQL Engine Extensions for Observability

* `pg_stat_statements`: Enabled to record normalized query execution statistics, total execution time, calls, and mean buffer reads.
* `pg_stat_activity`: Continuous polling of running queries to detect blocked queries and long-running idle-in-transaction states ($> 30\text{s}$).
