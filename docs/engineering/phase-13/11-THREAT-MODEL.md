# Phase 13 AI Knowledge Systems STRIDE Threat Model
**Domain:** AI Security, Provenance & Multi-Tenant Data Protection  
**Standard:** Microsoft STRIDE Threat Modeling Framework  
**Date:** September 2026  

---

## 1. STRIDE Threat Analysis Matrix

| Threat Category | Potential Attack Vector | Impact | Implemented Mitigation | Verification Evidence |
| :--- | :--- | :--- | :--- | :--- |
| **Spoofing** | Forging citation IDs (`ev-phantom-999`) or classical verses | Misleading users with non-existent classical claims | Post-generation `validateClaims` asserts every cited ID exists in retrieved set | `RAG-006` unit test |
| **Tampering** | Ingesting poisoned documents with embedded instruction overrides | Hijacking AI system behavior and bypassing safety rules | Document anti-poisoning scanner + XML data encapsulation with system primacy | `RAG-011`, `RAG-012` |
| **Repudiation** | Inability to audit what corpus version or model produced an explanation | Regulatory non-compliance and loss of diagnostic accountability | Immutable `RAGAuditTrace` logging query, intent, chunk IDs, versions, and latency | `RAG-022`, `RAG-030` |
| **Information Disclosure** | Extracting system prompts, database credentials, or cross-user context | Exposure of proprietary prompts, service keys, or private user profiles | `validateSafety` blocks prompt/credential patterns; RLS restricts traces to `auth.uid()` | `RAG-017`, `RAG-018` |
| **Denial of Service** | Unbounded vector searches or endless LLM retry loops | API exhaustion, high latency, and cloud cost spikes | Fixed retrieval limits (5 chunks max), latency tracking, and zero infinite retries | `RAG-003`, `RAG-022` |
| **Elevation of Privilege** | User coercing AI into acting as a licensed medical doctor or dermatologist | Unlawful medical diagnosis, prescribing prescription drugs | Strict non-diagnostic safety filters and prohibited medical vocabulary gates | `RAG-013`, `RAG-015`, `RAG-017` |

---

## 2. Multi-Tenant Database Isolation (RLS)

- **Knowledge Tables (`knowledge_sources`, `knowledge_documents`, `knowledge_chunks`):** Public SELECT for active/verified records only; write permissions restricted strictly to service role. Normal authenticated users cannot insert, update, or delete knowledge.
- **Audit Traces (`rag_audit_traces`):** Strict Row-Level Security:
  ```sql
  CREATE POLICY "Users can view own RAG traces" ON public.rag_audit_traces
    FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
  ```
  User A cannot access or inspect User B's audit traces or questions under any circumstances.
