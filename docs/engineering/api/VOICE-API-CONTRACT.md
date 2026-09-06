# API Contract: Conversational Voice & Chat Assistant
## Ephemeral Speech Processing, Grounded Q&A & AI Safety Boundaries

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** Conversational Assistant  
**Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`  
**Authority:** AI Platform Architect, Security Architect, Privacy Officer  

---

## 1. Architectural Audio Privacy Boundary

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    VOICE AUDIO PRIVACY BOUNDARY                             │
├─────────────────────────────────────────────────────────────────────────────┤
│   [ Client Browser / Mobile Device ]                                        │
│   • Continuous Audio Stream Processed In-Memory (Web Speech API / Wasm)     │
│   • Raw Audio Bytes Dropped in RAM; ZERO Audio Uploaded to Server           │
│   • Client Transcribes to English/Hindi Text String                         │
│                     │                                                       │
│                     ▼ POST /api/v1/voice/chat (Text Payload Only)           │
│   [ Backend Edge Gateway & AI Orchestrator ]                                │
│   • Grounded in Classical Literature RAG                                    │
│   • Medical Regex & Non-Diagnostic Constraints Filter                       │
│   • Minimal Textual Chat Turn Logged to `chat_messages`                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. API-VOICE-001: Execute Conversational Turn (`POST /api/v1/voice/chat`)

* **HTTP Method:** `POST`
* **Path:** `/api/v1/voice/chat`
* **Actor:** Authenticated User (`auth.uid()`)
* **Execution:** Retrieves user dosha context + RAG classical chunks $\rightarrow$ LLM generation $\rightarrow$ Zod validation $\rightarrow$ persists `chat_messages`.

### Request Body & Zod Schema

```typescript
export const VoiceChatSchema = z.object({
  messageText: z.string().min(1).max(500),
  language: z.enum(['en', 'hi', 'sa']).default('en'),
  clientTimestamp: z.string().datetime(),
  includeLatestScanContext: z.boolean().default(true)
}).strict();
```

### Success Response (`200 OK`)

```json
{
  "data": {
    "messageId": "018e3a2b-8c4d-7ef0-91a2-3b4c5d6e7f8d",
    "role": "assistant",
    "responseText": "In classical Ayurveda, elevated cheek heat and redness indicate Pitta aggravation. Applying pure sandalwood paste or organic rose water provides immediate cooling relief. Incorporating sweet, bitter, and astringent foods into your diet will also help balance internal heat.",
    "groundedCitations": [
      {
        "sourceWork": "Charaka Samhita",
        "reference": "Sutrasthana Adhyaya 5",
        "shloka": "चन्दनं शीतलं हृद्यं दाहपित्तविनाशनम्..."
      }
    ],
    "disclaimer": "This guidance is for general Ayurvedic wellness and does not constitute medical diagnosis or treatment.",
    "createdAt": "2026-09-03T20:31:00.000Z"
  },
  "meta": {
    "requestId": "req_voice_01",
    "timestamp": "2026-09-03T20:31:01.200Z"
  }
}
```
