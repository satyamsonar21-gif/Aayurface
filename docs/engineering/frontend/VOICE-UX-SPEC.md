# AayurFace — UX Specification: Conversational Voice & Chat Guide
## Ephemeral Speech Processing, Grounded Chat Turns & AI Safety Boundary

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Domain:** Voice & Conversational Interaction  
**Status:** `TARGET UX SPECIFICATION (REQUIRES IMPLEMENTATION)`  
**Authority:** Staff UX Engineer, AI Platform Architect  

---

## 1. The 6-State Voice Interaction Lifecycle

```text
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 1. IDLE      │ ──► │ 2. LISTENING │ ──► │ 3. TRANSCRIB │ ──► │ 4. PROCESSING│
│ Ready state  │     │ Mic active   │     │ Client Wasm  │     │ API Query    │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                                       │
                                                                       ▼
                                  ┌──────────────┐     ┌──────────────┐
                                  │ 6. COMPLETE  │ ◄── │ 5. SPEAKING  │
                                  │ Ready again  │     │ TTS Audio Out│
                                  └──────────────┘     └──────────────┘
```

---

## 2. Privacy & Safety Invariants

1. **Client-Side Speech-to-Text:** Audio is processed in ephemeral browser memory (Web Speech API or Wasm). **Zero raw audio bytes are uploaded to the backend server.**
2. **Text-Only API Payload:** Only the transcribed text string is transmitted via `POST /api/v1/voice/chat`.
3. **Medical Safety Fallback:** If a user asks for prescription advice or diagnoses (e.g. *"Do I have melanoma?"*), the assistant strictly replies: *"I cannot diagnose or evaluate medical conditions. Please consult a dermatologist or physician immediately."*
