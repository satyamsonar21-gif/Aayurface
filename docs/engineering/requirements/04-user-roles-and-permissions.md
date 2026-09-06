# AayurFace — Engineering Requirements Specification
## Document 04: User Roles, Actors & Role-Capability Matrix

**Phase:** Phase 01 — Requirements Engineering, Formalization & Complete Traceability  
**Date:** 2026-09-03  
**Status:** FORMAL ENGINEERING CONTRACT  
**Authority:** Security & Privacy Architect, Product Manager  

---

### 1. Actor Definitions & Life Cycles

1. **Consumer / End-User (Role: `consumer`):**
   * *Purpose:* Primary individual seeking personalized Ayurvedic skin intelligence, routines, and progress tracking.
   * *Scope:* Operates strictly on their own data. Zero access to other users or research datasets.
   * *Target Release:* **MVP / P0**.
2. **Expert Annotator / Ayurvedic Practitioner (Role: `expert_annotator`):**
   * *Purpose:* Certified Ayurvedic professional participating in consensus annotation, ground truth labeling, and clinical validation.
   * *Scope:* Reviews anonymized facial captures and questionnaire vectors to assign validated reference labels. Zero access to consumer identity or PII.
   * *Target Release:* **Research / V2**.
3. **Researcher (Role: `researcher`):**
   * *Purpose:* Academic or clinical researcher conducting population-level bias analysis, demographic audits (Fitzpatrick III–VI calibration), and algorithm accuracy studies.
   * *Scope:* Queries de-identified, aggregated consensus datasets. Zero access to direct facial imagery or personal identifiers without IRB protocol.
   * *Target Release:* **Research / V2**.
4. **Platform Administrator (Role: `admin`):**
   * *Purpose:* Operations personnel responsible for platform configuration, knowledge base updates, safety filter management, and system health monitoring.
   * *Scope:* Administrative tools, vector database re-indexing, safety rules. Zero access to consumer facial imagery.
   * *Target Release:* **V1 / P1**.
5. **System / Automated Service Worker:**
   * *Purpose:* Internal backend services executing asynchronous jobs, vector embeddings, scheduled routine reminders, and retention purges.
   * *Scope:* Service role execution with cryptographic internal credentials.

---

### 2. Role-Capability Matrix

| Capability / Resource Operation | Consumer | Expert Annotator | Researcher | Administrator | System Service |
|---|---|---|---|---|---|
| Register / Authenticate Account | **ALLOW** | **ALLOW** | **ALLOW** | **ALLOW** | N/A |
| Submit Consent & Questionnaires | **ALLOW (Self)** | DENY | DENY | DENY | N/A |
| Trigger Camera Capture & Analysis | **ALLOW (Self)** | DENY | DENY | DENY | N/A |
| View Own Analysis Results & History | **ALLOW (Self)** | DENY | DENY | DENY | N/A |
| Download Own PDF Report | **ALLOW (Self)** | DENY | DENY | DENY | N/A |
| Access Other User's Raw Data / Scans | **DENY** | **DENY** | **DENY** | **DENY** | **DENY** |
| Access Anonymized Research Dataset | **DENY** | **ALLOW (Task)** | **ALLOW (Read)**| DENY | **ALLOW** |
| Assign Expert Consensus Labels | **DENY** | **ALLOW** | DENY | DENY | N/A |
| Add / Edit / Deprecate Knowledge Base | **DENY** | DENY | DENY | **ALLOW** | **ALLOW** |
| Modify Safety Rules & Filter Limits | **DENY** | DENY | DENY | **ALLOW** | N/A |
| Trigger Vector Re-Embedding Pipeline | **DENY** | DENY | DENY | **ALLOW** | **ALLOW** |
| View System Health & Error Rates | **DENY** | DENY | DENY | **ALLOW** | **ALLOW** |
| Purge User Data Upon Deletion Request | **ALLOW (Self)** | DENY | DENY | DENY | **ALLOW (Exec)**|

---

### 3. Authorization & Enforcement Boundaries

1. **Client-Side Navigation Gating:** UI routing guards shall redirect unauthenticated users to `/auth/login` and non-admin users attempting to access `/admin` to `/dashboard`.
2. **Database Row-Level Security (RLS):** All consumer tables (`profiles`, `scan_results`, `saved_remedies`, `chat_sessions`, `chat_messages`) shall enforce `USING (auth.uid() = user_id)`.
3. **Role Validation in Edge Functions:** Serverless functions shall decode the authenticated caller's JWT, query their verified role from `profiles.role`, and reject unauthorized callers with HTTP 403 Forbidden.
4. **Data Masking in Research Views:** Research APIs shall automatically strip `full_name`, `email`, `avatar_url`, and raw biometric coordinates, returning only de-identified feature vectors and anonymized session UUIDs.
