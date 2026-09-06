# AayurFace — Engineering Requirements Specification
## Document 11: Conceptual Serverless API Contracts & Interfaces

**Phase:** Phase 01 — Requirements Engineering, Formalization & Complete Traceability  
**Date:** 2026-09-03  
**Status:** FORMAL ENGINEERING CONTRACT  
**Authority:** Backend Architect, Solution Architect  

---

### 1. API Design Principles

1. **Protocol:** HTTPS RESTful endpoints deployed as Supabase Edge Functions (Deno runtime).
2. **Authentication:** Every non-public endpoint strictly requires a verified JWT: `Authorization: Bearer <supabase_jwt>`.
3. **No Caller User ID Trust:** The caller's identity is extracted from JWT claims (`auth.uid()`). Any client attempt to provide a differing `userId` in the body shall trigger HTTP 403 Forbidden.
4. **Idempotency:** Write operations (`POST /analysis/orchestrate`, `POST /questionnaire/submit`) accept an `Idempotency-Key` header to prevent duplicate execution upon network retries.
5. **Standardized Error Envelope:** All error responses follow RFC 7807 Problem Details.

---

### 2. Core Serverless API Inventory

#### API-001: Generate Signed Capture Upload URL
* **Path:** `POST /functions/v1/capture-upload-url`
* **Purpose:** Issues a short-lived cryptographic signed URL for client upload to private storage.
* **Actor:** Authenticated Consumer (`auth.uid()`).
* **Input Schema:**
  ```json
  {
    "contentType": "image/jpeg",
    "qualityGatewayToken": "string (JWT signed by client gateway asserting PASS)"
  }
  ```
* **Output Schema (200 OK):**
  ```json
  {
    "uploadUrl": "https://<supabase-id>.supabase.co/storage/v1/object/upload/sign/...",
    "storagePath": "facial-captures/{user_id}/{capture_uuid}.jpg",
    "expiresInSeconds": 900
  }
  ```
* **Errors:** `401 Unauthorized`, `400 Invalid Quality Token`, `429 Rate Limit Exceeded`.
* **Rate Limit:** Maximum 10 requests per user per hour.

---

#### API-002: Submit Ayurvedic Questionnaire
* **Path:** `POST /functions/v1/submit-questionnaire`
* **Purpose:** Normalizes questionnaire answers and computes constitutional vector.
* **Actor:** Authenticated Consumer.
* **Input Schema:**
  ```json
  {
    "answers": {
      "body_frame": "thin_light",
      "skin_texture": "dry_rough",
      "digestive_pattern": "irregular",
      "weather_sensitivity": "cold_dry"
    },
    "version": "v1.0"
  }
  ```
* **Output Schema (200 OK):**
  ```json
  {
    "questionnaireId": "uuid",
    "scores": { "vata": 0.65, "pitta": 0.20, "kapha": 0.15 },
    "dominantTendency": "Vata",
    "completeness": 1.0
  }
  ```
* **Errors:** `400 Validation Error (Missing required answers)`, `401 Unauthorized`.

---

#### API-003: Submit Lifestyle Context
* **Path:** `POST /functions/v1/submit-lifestyle`
* **Purpose:** Ingests and normalizes behavioral and environmental variables.
* **Actor:** Authenticated Consumer.
* **Input Schema:**
  ```json
  {
    "dietType": "vegetarian",
    "sleepQuality": "fair",
    "sleepHours": 6,
    "stressLevel": "high",
    "climate": "hot_dry",
    "waterIntakeLiters": 1.5,
    "activityLevel": "moderate",
    "exposures": ["intense_sun", "pollution"]
  }
  ```
* **Output Schema (200 OK):**
  ```json
  {
    "lifestyleId": "uuid",
    "normalizedFactors": { "heat_aggravation": 0.7, "dryness_aggravation": 0.6 }
  }
  ```

---

#### API-004: Orchestrate Multimodal Analysis
* **Path:** `POST /functions/v1/analyze-multimodal`
* **Purpose:** Central intelligence orchestrator: validates storage capture, extracts CV features, executes fusion, queries RAG knowledge base, synthesizes results, and persists snapshot.
* **Actor:** Authenticated Consumer.
* **Input Schema:**
  ```json
  {
    "storagePath": "facial-captures/{user_id}/{capture_uuid}.jpg",
    "questionnaireId": "uuid",
    "lifestyleId": "uuid",
    "language": "en"
  }
  ```
* **Output Schema (201 Created):** Full `AnalysisResultContract` JSON (Document 07).
* **Errors:**
  * `400 Capture Not Found or Corrupted`
  * `403 Storage Path Ownership Mismatch`
  * `502 AI Inference Service Unavailable`
  * `504 Analysis Processing Timeout`
* **Idempotency:** Handled via `Idempotency-Key` header.
* **Rate Limit:** Maximum 5 analysis runs per user per hour.

---

#### API-005: Query Ayurvedic Voice / Chat Assistant
* **Path:** `POST /functions/v1/ayurveda-chat`
* **Purpose:** Context-aware, RAG-grounded conversational agent for skin guidance.
* **Actor:** Authenticated Consumer.
* **Input Schema:**
  ```json
  {
    "messages": [{ "role": "user", "content": "What does my Pitta tendency mean for daily cleanser choice?" }],
    "analysisId": "uuid (optional recent analysis context)",
    "language": "en"
  }
  ```
* **Output Schema (200 OK):**
  ```json
  {
    "reply": "Namaste 🌿 In Ayurveda, high Pitta indicates excess heat...",
    "citations": [{ "source": "Charaka Samhita", "chapter": "Sutra Sthana 5" }],
    "safetyAdvisory": "Always conduct a patch test before trying new herbal cleansers."
  }
  ```
* **Rate Limit:** Maximum 30 messages per user per hour.

---

#### API-006: Generate Authenticated PDF Wellness Report
* **Path:** `POST /functions/v1/generate-pdf-report`
* **Purpose:** Synthesizes downloadable PDF wellness report.
* **Actor:** Authenticated Consumer.
* **Input Schema:** `{ "analysisId": "uuid" }`
* **Output Schema (200 OK):**
  ```json
  {
    "downloadUrl": "https://<supabase-id>.supabase.co/storage/v1/object/sign/reports/...",
    "expiresInSeconds": 300
  }
  ```
* **Errors:** `401 Unauthorized`, `404 Analysis Not Found`, `403 Unauthorized Access`.

---

#### API-007: Admin Knowledge Base Ingestion & Vectorization
* **Path:** `POST /functions/v1/admin-knowledge-ingest`
* **Purpose:** Adds classical text chunks, generates `text-embedding-3-small` vectors, and stores in `pgvector`.
* **Actor:** Authenticated Administrator (`role = 'admin'`).
* **Input Schema:**
  ```json
  {
    "sourceTitle": "Charaka Samhita",
    "chapter": "Chikitsa Sthana 26",
    "verseReference": "26.15-18",
    "domain": "Skin Disorders & Pitta Pacification",
    "content": "Full text of classical remedy description...",
    "version": "1.0"
  }
  ```
* **Output Schema (201 Created):** `{ "chunkId": "uuid", "embedded": true, "dimensions": 1536 }`
* **Errors:** `403 Forbidden (Non-admin caller)`.
