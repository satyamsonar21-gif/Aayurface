# AayurFace — Database Architecture Specification
## Phase 05 API Endpoint to Database Mapping Matrix

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Staff Backend Architect  

---

### 1. Architectural Alignment

Every Phase 05 REST API endpoint maps deterministically to underlying relational tables, transaction boundaries, Row-Level Security policies, and caching strategies:

| API Route & Method | Description | Affected Tables | DB Operation | RLS Policy Applied | Transaction Boundary | Edge Caching Strategy |
|---|---|---|---|---|---|---|
| `POST /api/v1/auth/signup` | User registration | `auth.users`, `profiles`, `user_preferences` | INSERT | Service Role / Trigger `handle_new_user()` | Single Transaction | No-Cache |
| `GET /api/v1/profile` | Fetch profile & settings | `profiles`, `user_preferences` | SELECT | `auth.uid() = id` | Single Query | No-Cache (Private) |
| `PUT /api/v1/profile` | Update profile fields | `profiles` | UPDATE | `auth.uid() = id` (role immutable) | Single Query | No-Cache |
| `DELETE /api/v1/profile/account` | Account erasure | `auth.users`, `profiles`, S3 buckets | DELETE / CASCADE | `auth.uid() = id` | Master Cascading Purge Tx | No-Cache |
| `POST /api/v1/consents` | Grant/revoke consent | `consents` | INSERT (Append) | `auth.uid() = user_id` | Single Query | No-Cache |
| `GET /api/v1/intake/template` | Fetch 15-question intake | `questionnaire_templates` | SELECT | `true` (Public read) | Single Query | Edge Cache (1 Hour) |
| `POST /api/v1/intake/submit` | Submit intake answers | `questionnaire_responses`, `lifestyle_contexts` | INSERT | `auth.uid() = user_id` | Atomic Multi-Table Tx | No-Cache |
| `POST /api/v1/captures/upload-url`| Request signed S3 upload | `captures` | INSERT (`retention_state='ACTIVE'`) | `auth.uid() = user_id` | Single Query | No-Cache |
| `POST /api/v1/analysis/orchestrate`| Enqueue analysis job | `analysis_jobs` | INSERT (`status='QUEUED'`) | `auth.uid() = user_id` | Single Query | Idempotency Cached (120s) |
| `GET /api/v1/analysis/jobs/:id` | Poll analysis job status | `analysis_jobs` | SELECT | `auth.uid() = user_id` | Single Query | No-Cache |
| `GET /api/v1/analysis/latest` | Fetch latest scan result | `scan_results`, `visual_observations`, `multimodal_fusions` | SELECT | `auth.uid() = user_id` | Single Join Query | No-Cache (Private) |
| `GET /api/v1/analysis` | Paginated scan history | `scan_results` | SELECT | `auth.uid() = user_id` | Keyset Paginated Query | No-Cache (Private) |
| `GET /api/v1/analysis/:id` | Fetch specific scan detail | `scan_results`, `visual_observations`, `recommendation_items` | SELECT | `auth.uid() = user_id` (404 on BOLA) | Single Join Query | No-Cache (Private) |
| `GET /api/v1/routines/active` | Fetch active Dinacharya | `routines`, `routine_items` | SELECT | `auth.uid() = user_id` | Single Join Query | Short Edge Cache (60s) |
| `POST /api/v1/routines/adherence`| Log daily ritual checkbox | `routine_tracking` | INSERT (ON CONFLICT DO UPDATE) | `auth.uid() = user_id` | Single Query | No-Cache |
| `GET /api/v1/progress` | Fetch 30/60/90-day progress | `progress_checkpoints` | SELECT | `auth.uid() = user_id` | Single Query | No-Cache (Private) |
| `POST /api/v1/reports/share` | Generate public share link | `shared_reports` | INSERT | `auth.uid() = user_id` | Single Query | No-Cache |
| `GET /share/:token` | View public shared report | `shared_reports`, `scan_results`, `multimodal_fusions` | SELECT | Token Hash Match & Active | Single Join Query | Edge Cache (10 Min) |
| `GET /api/v1/remedies` | Browse public remedies | `remedies` | SELECT | `true` (Public read) | GIN Array Filtered Query | Edge Cache (24 Hours) |
| `POST /api/v1/chat/message` | Conversational query | `chat_sessions`, `chat_messages` | INSERT & SELECT | `auth.uid() = user_id` | Multi-Table Tx | No-Cache |
