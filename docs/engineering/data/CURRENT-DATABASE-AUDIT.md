# AayurFace — Database Architecture Specification
## Forensic Audit of Current Database & Prototype Schema

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL AUDIT SPECIFICATION (Evidence-Based Forensic Analysis)  
**Authority:** Principal Database Architect, Data Architect, Production Systems Architect  

---

### 1. Executive Forensic Summary

This audit evaluates the actual physical database and data model artifacts in the repository:
1. `supabase/schema.sql`: A 209-line static SQL setup script intended for manual execution in the Supabase SQL Editor.
2. `src/types/index.ts`: TypeScript domain interfaces used by the React SPA frontend.
3. `src/lib/mockData.ts`: In-memory seed and fallback datasets (30+ remedies, 30+ daily tips, 1 mock scan result).
4. `supabase/functions/analyze-skin/index.ts`: Edge Function receiving base64 image data and invoking OpenAI GPT-4o.
5. `supabase/functions/ayurveda-chat/index.ts`: Conversational chat Edge Function.

**Audited Repository Reality:**
* There are **ZERO** migration files (`supabase/migrations/` does not exist).
* There are **ZERO** automated migration tooling configurations (`config.toml` missing).
* The existing schema defines **7 tables** (`profiles`, `scan_results`, `remedies`, `saved_remedies`, `chat_sessions`, `chat_messages`, `daily_tips`).
* The existing schema was created for early UI prototyping and contains critical architectural, security, and integrity deficiencies that require a comprehensive rebuild.

---

### 2. Comprehensive Entity-by-Entity Audit

| Existing Table Name | Existing Columns & Types | Primary Key | Foreign Keys | Existing Constraints | Existing Indexes | RLS Status in File | Current Forensic Reality & Weaknesses | Status Classification |
|---|---|---|---|---|---|---|---|---|
| `profiles` | `id UUID`<br/>`full_name TEXT`<br/>`email TEXT`<br/>`avatar_url TEXT`<br/>`skin_type TEXT`<br/>`dosha TEXT`<br/>`onboarding_completed BOOLEAN`<br/>`created_at TIMESTAMPTZ`<br/>`updated_at TIMESTAMPTZ` | `id` | `auth.users(id) ON DELETE CASCADE` | `skin_type IN ('oily', 'dry', 'combination', 'normal', 'sensitive')`<br/>`dosha IN ('vata', 'pitta', 'kapha')` | None defined | Enabled in file (`auth.uid() = id`) | Lacks role column; lacks age, gender, language preferences; lacks account status flags. Check constraint only allows single doshas (disallowing bi-doshic or tri-doshic types). | `CURRENT VERIFIED (PROTOTYPE)` |
| `scan_results` | `id UUID`<br/>`user_id UUID`<br/>`image_url TEXT`<br/>`summary TEXT`<br/>`skin_types TEXT[]`<br/>`causes JSONB`<br/>`remedies JSONB`<br/>`prevention_tips JSONB`<br/>`severity TEXT`<br/>`raw_analysis JSONB`<br/>`created_at TIMESTAMPTZ` | `id` | `profiles(id) ON DELETE CASCADE` | `severity IN ('mild', 'moderate', 'high')` | `idx_scan_results_user_id`<br/>`idx_scan_results_created_at` | Enabled in file (`auth.uid() = user_id`) | **CRITICAL FLAWS:** Stores unconstrained JSONB blobs; lacks visual observation features (CIELAB, GLCM); lacks multimodal fusion vectors; lacks confidence scores; lacks agreement state; lacks model/prompt/knowledge versions; stores raw `image_url` string instead of private storage reference; allows DELETE without cascading S3 purge. | `CURRENT VERIFIED (PROTOTYPE)` |
| `remedies` | `id UUID`<br/>`name TEXT`<br/>`slug TEXT`<br/>`description TEXT`<br/>`ingredients JSONB`<br/>`preparation_steps JSONB`<br/>`application_steps JSONB`<br/>`frequency TEXT`<br/>`ayurvedic_insight TEXT`<br/>`skin_concerns TEXT[]`<br/>`skin_types TEXT[]`<br/>`image_url TEXT`<br/>`is_featured BOOLEAN`<br/>`created_at TIMESTAMPTZ` | `id` | None | `slug UNIQUE NOT NULL` | `idx_remedies_skin_concerns` (GIN)<br/>`idx_remedies_skin_types` (GIN) | Enabled in file (Public read) | Hardcoded static catalog; completely disconnected from classical literature sources (*Charaka*, *Sushruta*); lacks dosage, contraindications, and domain review metadata. | `CURRENT VERIFIED (PROTOTYPE)` |
| `saved_remedies` | `id UUID`<br/>`user_id UUID`<br/>`remedy_id UUID`<br/>`created_at TIMESTAMPTZ` | `id` | `profiles(id) ON DELETE CASCADE`<br/>`remedies(id) ON DELETE CASCADE` | `UNIQUE(user_id, remedy_id)` | `idx_saved_remedies_user_id` | Enabled in file (`auth.uid() = user_id`) | Simple join table; functional for bookmarks. | `CURRENT VERIFIED (PROTOTYPE)` |
| `chat_sessions` | `id UUID`<br/>`user_id UUID`<br/>`scan_context_id UUID`<br/>`created_at TIMESTAMPTZ`<br/>`last_message_at TIMESTAMPTZ` | `id` | `profiles(id) ON DELETE CASCADE`<br/>`scan_results(id) ON DELETE SET NULL` | None | None defined | Enabled in file (`auth.uid() = user_id`) | Lacks session title, active status, language selection, or conversation context memory limits. | `CURRENT VERIFIED (PROTOTYPE)` |
| `chat_messages` | `id UUID`<br/>`session_id UUID`<br/>`user_id UUID`<br/>`role TEXT`<br/>`content TEXT`<br/>`created_at TIMESTAMPTZ` | `id` | `chat_sessions(id) ON DELETE CASCADE`<br/>`profiles(id) ON DELETE CASCADE` | `role IN ('user', 'assistant')` | `idx_chat_messages_session_id`<br/>`idx_chat_messages_created_at` | Enabled in file (`auth.uid() = user_id`) | Stores plain-text chat strings; lacks token usage, cited chunk references, safety flags, or latency metadata. | `CURRENT VERIFIED (PROTOTYPE)` |
| `daily_tips` | `id UUID`<br/>`content TEXT`<br/>`category TEXT`<br/>`display_order INTEGER`<br/>`display_date DATE`<br/>`is_active BOOLEAN`<br/>`created_at TIMESTAMPTZ` | `id` | None | None | `idx_daily_tips_display_date` | Enabled in file (Public read) | Static daily quotes table; functional for simple home banner display. | `CURRENT VERIFIED (PROTOTYPE)` |

---

### 3. Audited Database Functions & Triggers

1. `public.handle_new_user()`:
   * **Trigger:** `AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`
   * **Behavior:** Extracts `full_name` from `raw_user_meta_data` and inserts into `public.profiles`.
   * **Audit Finding:** Uses `SECURITY DEFINER` correctly, but does not initialize default user preferences or consent rows.
2. `public.update_updated_at_column()`:
   * **Trigger:** `BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`
   * **Audit Finding:** Standard timestamp maintenance trigger. Not applied to `scan_results` or other tables.
3. `public.get_todays_tip()`:
   * **Behavior:** Returns a tip matching `CURRENT_DATE` or falls back to `display_order`.
   * **Audit Finding:** Functional, but lacks caching and localization.

---

### 4. Critical Architectural & Structural Gaps (What is MISSING)

The forensic audit reveals that the current prototype schema is missing 80% of the production data requirements established in Phases 01, 02, and 03:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ CRITICAL MISSING DATA ARCHITECTURES IN CURRENT PROTOTYPE                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. CONSENT LEDGER: Zero tables for recording unbundled, versioned, or       │
│    revocable user consents (Mandatory for DPDP / privacy compliance).        │
│ 2. QUESTIONNAIRE ARCHITECTURE: Zero persistence for the 15-question intake. │
│    Intake answers exist only in client state; cannot reproduce analyses!     │
│ 3. LIFESTYLE CONTEXT: Zero tables for sleep, stress, diet, or climate.      │
│ 4. BIOMETRIC CAPTURE METADATA: Zero tables for S3 object paths, checksums,  │
│    capture attempts, illumination scores, blur metrics, or purge states.    │
│ 5. NORMALIZED VISUAL OBSERVATIONS: Extracted CIELAB a*, GLCM roughness, and │
│    melanin vectors are not persisted; only unconstrained JSON blobs.        │
│ 6. MULTIMODAL FUSION & CONFIDENCE: Zero representation of weights, pairwise │
│    agreement index A, calibrated confidence C, or uncertainty state caps.   │
│ 7. RAG KNOWLEDGE BASE & PGVECTOR: `pgvector` extension is not installed;   │
│    classical literature chunks, embeddings, and citations do not exist in DB│
│ 8. ROUTINE GUIDANCE & ADHERENCE: Zero tables for Dinacharya morning/evening  │
│    rituals or daily checkbox tracking (Only static recipes in `remedies`).  │
│ 9. LONGITUDINAL PROGRESS: Zero tables for 30/60/90-day progress deltas.     │
│ 10. ASYNCHRONOUS JOB QUEUE: Zero tables for `analysis_jobs`, idempotency     │
│     keys, retry state machines, or execution deadlines.                     │
│ 11. SECURITY AUDIT VAULT: Zero tables for tracking auth failures, RLS       │
│     denials, admin mutations, or account deletion tombstones.               │
│ 12. RESEARCH ENCLAVE: Zero tables for de-identified subjects, double-blind  │
│     expert annotations, or Fleiss' Kappa consensus adjudication.            │
│ 13. MIGRATION SYSTEM: Zero migration files or versioning scripts.           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 5. Risk Assessment & Architectural Recommendations

| Gap / Defect Identified | Severity | Operational / Security Risk | Architectural Recommendation |
|---|---|---|---|
| **Unconstrained JSONB in `scan_results`** | **CRITICAL** | Data corruption, inability to index or query specific observations, broken citations. | Decompose `scan_results` into normalized 3NF relational tables: `scan_results`, `visual_observations`, `multimodal_fusions`, `recommendation_items`. |
| **Missing Questionnaire & Lifestyle Persistence** | **CRITICAL** | Complete loss of user intake data upon session end; impossible to verify or reproduce AI analyses. | Implement `questionnaire_templates`, `questionnaire_responses`, and `lifestyle_contexts` relational models. |
| **Missing Consent Ledger** | **CRITICAL** | Statutory non-compliance (DPDP Act 2023 / GDPR); inability to prove consent during audits. | Implement immutable, versioned, append-only `consents` table with client metadata hashes. |
| **Direct Image Ingestion in Edge Functions** | **CRITICAL** | Edge worker memory exhaustion, lack of biometric purge controls, image leakage. | Decommission base64 POST; implement private S3 storage with HMAC pre-signed PUT URLs and `captures` table. |
| **Lack of pgvector & Classical Verses** | **HIGH** | Generative AI hallucinations; inability to perform semantic cosine retrieval. | Enable `pgvector` extension; implement `knowledge_sources`, `knowledge_documents`, and `knowledge_chunks` with HNSW indexing. |
| **Missing Asynchronous Job State Machine** | **HIGH** | Client connection timeouts on mobile networks during multi-second analysis. | Implement `analysis_jobs` table using PostgreSQL `FOR UPDATE SKIP LOCKED` with idempotency keys. |
| **Missing Migration Infrastructure** | **HIGH** | Uncontrolled schema drift; manual error-prone SQL execution in production. | Establish a versioned migration strategy utilizing Supabase CLI migration files (`supabase/migrations/`). |
