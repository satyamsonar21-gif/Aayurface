# AayurFace — Engineering Reconnaissance Audit
## Document 06: Database Schema & Storage Reconnaissance

**Phase:** Phase 00 — Full Repository & System Reconnaissance  
**Date:** 2026-09-03  
**Auditor:** Database Engineer & Security Engineer  
**Status:** FORENSIC EVIDENCE COLLECTED  

---

### 1. Existing Database Schema (`supabase/schema.sql`)

The repository currently defines 7 PostgreSQL tables with Row-Level Security (RLS) enabled:

1. `profiles`: Extends `auth.users`, storing `full_name`, `email`, `avatar_url`, `skin_type`, `dosha`, `onboarding_completed`.
2. `scan_results`: Stores `user_id`, `image_url`, `summary`, `skin_types`, `causes` (JSONB), `remedies` (JSONB), `prevention_tips` (JSONB), `severity`, `raw_analysis` (JSONB).
3. `remedies`: Stores catalog of Ayurvedic remedies with ingredients and preparation steps.
4. `saved_remedies`: Join table linking `user_id` to `remedy_id`.
5. `chat_sessions`: Tracks chat conversation threads per user.
6. `chat_messages`: Stores individual messages (`user` or `assistant`) linked to `chat_sessions`.
7. `daily_tips`: Stores daily Ayurvedic tips and wisdom quotes.

---

### 2. RLS Policy Enforcement Inspection

| Table | Policy Name | Operation | Definition (`USING` / `WITH CHECK`) | Forensic Evaluation |
|---|---|---|---|---|
| `profiles` | "Users can view own profile" | `SELECT` | `auth.uid() = id` | Correctly isolates profile reads. |
| `profiles` | "Users can update own profile" | `UPDATE` | `auth.uid() = id` | Correctly isolates profile updates. |
| `scan_results` | "Users can view own scans" | `SELECT` | `auth.uid() = user_id` | Correctly isolates scan queries. |
| `scan_results` | "Users can insert own scans" | `INSERT` | `auth.uid() = user_id` | Correctly enforces ownership on write. |
| `scan_results` | "Users can delete own scans" | `DELETE` | `auth.uid() = user_id` | Correctly isolates scan deletions. |
| `remedies` | "Public can read remedies" | `SELECT` | `TRUE` | Appropriate for public catalog. |
| `daily_tips` | "Public can read daily tips" | `SELECT` | `is_active = TRUE` | Appropriate for public tips. |
| `chat_sessions`| "Users can manage own chat sessions" | `ALL` | `auth.uid() = user_id` | Enforces ownership. |
| `chat_messages`| "Users can manage own chat messages" | `ALL` | `auth.uid() = user_id` | Enforces ownership. |

**Database Security Summary:**
The RLS policies defined in `schema.sql` are well-structured for the 7 baseline tables. However, because the frontend does not connect to Supabase, these policies are currently completely dormant in production.

---

### 3. Database Schema Gaps vs. PRD Specification

The existing schema represents an early prototype data model that is missing critical product domains required by `D:\aayurface prd.txt`:

| Missing Domain | PRD Requirement | Impact of Omission |
|---|---|---|
| **Questionnaire Intake** | PRD Section 2.4 — Multi-step constitutional questionnaire responses (Vata/Pitta/Kapha dimensions). | No schema support to persist constitutional answers; cannot calculate questionnaire signal. |
| **Lifestyle Intake** | PRD Section 2.5 — Structured lifestyle context (diet, sleep, stress, climate, water intake). | No schema support to store non-visual biological variables. |
| **Multimodal Fusion & Confidence** | PRD Section 2.8, 2.9 — Modality weights, agreement states (High/Moderate/Low), calibrated confidence scores. | `scan_results` stores only raw JSON text; cannot track multimodal convergence or disagreement. |
| **Explainable AI (XAI)** | PRD Section 2.10 — Structured explanation ("What was observed", "Context factors", "What this does NOT mean"). | Explanations cannot be queried or rendered independently. |
| **Knowledge Base (RAG)** | PRD Section 2.11 — Curated, versioned Ayurvedic knowledge chunks, embeddings (`pgvector`), source attribution. | No vector storage table; cannot perform RAG-grounded retrieval. |
| **Routine Management** | PRD Section 2.13 — Morning/Evening/Weekly personalized routines and routine tracking/adherence. | Users cannot track routine completion over time. |
| **Longitudinal Checkpoints** | PRD Section 2.17 — 30/60/90-day progress snapshots and trend intelligence. | No table exists to track comparative progress across multiple scans. |
| **Consent Tracking** | PRD Section 2.2 — Granular consent records (facial processing, data storage, optional research). | Legal liability; cannot audit user consent or execute compliant data deletion. |
| **Role-Based Authorization** | PRD Section 2.20 — Roles (`consumer`, `researcher`, `expert_annotator`, `admin`). | Profiles table has no `role` column; research workflows cannot be authorized. |

---

### 4. Storage Bucket Reconnaissance

* **PRD Requirement:** Private Supabase Storage bucket for facial captures with signed URL access control (time-to-live expires after analysis); separate bucket for generated PDF reports.
* **Actual Implementation:** Zero storage buckets configured. `schema.sql` defines an `image_url TEXT` column on `scan_results`, but does not create storage buckets (`storage.buckets`) or RLS policies for `storage.objects`.
* **Privacy Risk:** If images are uploaded to a public bucket or sent over unencrypted channels, facial imagery could be exposed publicly.
