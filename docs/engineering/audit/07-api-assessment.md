# AayurFace — Engineering Reconnaissance Audit
## Document 07: API Layer & Serverless Endpoints Inventory

**Phase:** Phase 00 — Full Repository & System Reconnaissance  
**Date:** 2026-09-03  
**Auditor:** Senior Backend Engineer & API Architect  
**Status:** FORENSIC EVIDENCE COLLECTED  

---

### 1. Existing Endpoints Inventory

| Endpoint / Function | Platform / Runtime | Path / Trigger | Method | Authentication | Authorization | Status |
|---|---|---|---|---|---|---|
| `analyze-skin` | Supabase Edge Function (Deno) | `/functions/v1/analyze-skin` | POST | None (Anon key header) | None (Bypassed) | **PARTIAL / ORPHANED** |
| `ayurveda-chat` | Supabase Edge Function (Deno) | `/functions/v1/ayurveda-chat` | POST | None (Anon key header) | None (Bypassed) | **PARTIAL / ORPHANED** |

---

### 2. Endpoint Deep-Dive: `analyze-skin`

* **Location:** `supabase/functions/analyze-skin/index.ts`
* **Input Schema Expected:**
  ```json
  {
    "imageBase64": "string (base64 encoded image)",
    "userId": "string (UUID)"
  }
  ```
* **Processing Logic:**
  1. Validates presence of `imageBase64` and `userId`.
  2. Reads `OPENAI_API_KEY` from Deno environment.
  3. Sends raw image payload to OpenAI GPT-4o Vision API with a prompt requesting structured JSON.
  4. Parses GPT-4o JSON response.
  5. Returns `{ analysis: { ... } }` directly to caller.
* **Deficiencies & Critical Defects:**
  * **Database Bypass:** Does not persist the analysis to `scan_results` table in Supabase.
  * **No Authentication:** Does not verify caller's JWT token; allows anyone to forge an analysis.
  * **No Preprocessing:** Does not validate image resolution, format, illumination, or facial landmarks.
  * **Payload Bloat:** Transmits full raw base64 string in HTTP POST body rather than referencing an access-controlled Supabase Storage object.
  * **No Multimodal Inputs:** Takes only an image; accepts zero questionnaire responses or lifestyle context.
  * **Frontend Disconnect:** Never invoked by `ScanPage.tsx`.

---

### 3. Endpoint Deep-Dive: `ayurveda-chat`

* **Location:** `supabase/functions/ayurveda-chat/index.ts`
* **Input Schema Expected:**
  ```json
  {
    "messages": [{ "role": "user" | "assistant", "content": "string" }],
    "userSkinProfile": { "skin_type": "string", "dosha": "string", "recent_scan": { ... } }
  }
  ```
* **Processing Logic:**
  1. Checks for messages array.
  2. Injects `AYURVEDA_CHAT_SYSTEM_PROMPT` and optional `userSkinProfile` into prompt.
  3. Slices last 20 messages for context.
  4. Calls `https://api.openai.com/v1/chat/completions` (model: `gpt-4o`, temp: 0.7).
  5. Returns `{ reply: string }`.
* **Deficiencies & Critical Defects:**
  * **No Knowledge Retrieval (RAG):** Answers purely from OpenAI general model weights; does not query curated Ayurvedic texts or vector store.
  * **No Session Tracking:** Does not persist messages to `chat_messages` or `chat_sessions` tables.
  * **No Authentication:** Can be abused anonymously without user session verification.
  * **Frontend Disconnect:** Never invoked by `ChatPage.tsx`.

---

### 4. Required Missing APIs (PRD Traceability)

The following endpoints are mandated by `D:\aayurface prd.txt` but do not exist in the codebase:

1. `POST /functions/v1/submit-questionnaire`: Validates and scores constitutional questionnaire responses.
2. `POST /functions/v1/submit-lifestyle`: Records and normalizes lifestyle context variables.
3. `POST /functions/v1/multimodal-fusion`: Orchestrates fusion of visual features, questionnaire, and lifestyle data.
4. `POST /functions/v1/generate-pdf-report`: Synthesizes authenticated PDF report.
5. `GET /functions/v1/progress-trends`: Calculates longitudinal tracking statistics across historical scans.
6. `POST /functions/v1/voice-query`: Processes audio input and formats speech synthesis response.
