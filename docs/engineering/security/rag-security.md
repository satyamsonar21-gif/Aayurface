# AayurFace — Security Architecture Specification
## RAG Knowledge Base Integrity & Retrieval Security

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** AI/ML Architect, Principal Security Architect, Ayurvedic Knowledge Analyst  

---

### 1. RAG Threat Model & Attack Vectors

Retrieval-Augmented Generation (RAG) is a critical component of AayurFace, grounding generative responses in classical texts (*Charaka Samhita*, *Sushruta Samhita*, *Ashtanga Hridaya*, and *Bhavaprakasha*). Compromising the knowledge pipeline introduces severe threats:
* **Semantic Knowledge Poisoning:** An attacker injects false, harmful, or toxic Ayurvedic remedies into the knowledge database (e.g., advising caustic herbs for skin application).
* **Cross-Tenant Knowledge Leakage:** Private user questionnaire context or medical notes inadvertently indexed into the global vector database and retrieved by other users.
* **Indirect Prompt Injection via Ingestion:** Malicious hidden instructions embedded in third-party Ayurvedic texts that execute when ingested into the LLM context.
* **Hallucinated Citations:** The model generating fabricated chapter and verse references without grounding in real classical literature.

---

### 2. Knowledge Ingestion Provenance & Vetting Pipeline

```text
[Classical Text Source] ──► [1. Multi-Expert Domain Vetting] ──► [2. Cryptographic Admin Sign-Off]
                                                                        │
                                                                        ▼
[5. Read-Only `pgvector`] ◄── [4. Embedding Generation] ◄── [3. Chunking & Tag Sanitization]
```

#### Ingestion Controls:
1. **Four-Eyes Domain Review:** No text chunk can be ingested without review and cryptographic sign-off by two certified Ayurvedic domain experts.
2. **Metadata & Provenance Invariant:** Every record in `knowledge_chunks` must possess complete provenance metadata:
   * `id`: UUID primary key.
   * `source_work`: Authoritative compendium name.
   * `section_chapter`: Specific Sthana and Adhyaya.
   * `verse_number`: Exact Shloka identifier.
   * `content_sanskrit`: Original Sanskrit verse.
   * `content_translation`: Validated English and Hindi translations.
   * `ingestion_version`: Semantic version string (e.g., `v1.2.0`).
   * `status`: `ACTIVE`, `DEPRECATED`, or `UNDER_REVIEW`.
   * `vetted_by`: UUIDs of reviewing domain experts.
3. **Write-Restricted Storage:** The `knowledge_chunks` table is configured with strict PostgreSQL RLS policies:
   * `SELECT`: Permitted for `anon` and `authenticated` roles.
   * `INSERT / UPDATE / DELETE`: Strictly denied to application clients; permitted exclusively to authenticated users possessing the `role: admin` claim.

---

### 3. Runtime Retrieval Gating & Cross-Tenant Defense

To ensure that retrieval queries are grounded and cannot leak tenant data:
* **Tenant Segregation Invariant:** The vector database (`pgvector`) is utilized **EXCLUSIVELY** for public, curated classical literature chunks. User questionnaire answers, personal wellness notes, and biometric vectors are stored in separate relational tables and are **NEVER** indexed into the shared vector store.
* **The Similarity Threshold Gate:** At runtime, semantic cosine search (`embedding <=> query`) is gated:
  * Minimum Cosine Similarity: $\ge 0.75$.
  * Minimum Matched Chunks: $\ge 2$.
  * If fewer than 2 vetted chunks meet the $0.75$ threshold, generative herb synthesis is aborted, and a safe, non-herb Ayurvedic lifestyle advisory is rendered.
* **Citation Traceability Verification:** The post-inference validator cross-checks all citations in the LLM output against the retrieved chunk IDs. If the LLM invents a verse not present in the retrieved context, the output is flagged as a citation hallucination and dropped.
