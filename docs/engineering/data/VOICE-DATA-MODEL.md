# AayurFace — Database Architecture Specification
## Conversational Voice Assistant Architecture & Zero-Audio Storage Policy

**Phase:** Phase 04 — Database & Data Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Database Architect, Data Security Architect, Privacy Officer  
**Biometric Audio Invariant:** Under NO circumstances shall raw audio recordings or voice acoustic biometric samples be persisted to database tables or object storage.  

---

### 1. Ephemeral Client-Side Processing Architecture

AayurFace voice interaction is powered by browser-native Web Speech APIs (SpeechRecognition and SpeechSynthesis) running entirely within volatile client RAM:
* **Audio Capture:** Microphone stream is processed locally in browser memory.
* **Transcription:** Browser converts speech to plain-text strings in real-time.
* **Audio Discard:** Raw PCM audio buffers are dropped from browser RAM milliseconds after transcription. Zero audio bytes are transmitted across the network or persisted to backend servers.

---

### 2. Relational Chat Storage Schema

Backend persistence is limited to optional text-based chat session transcripts:

```sql
-- Target Schema for Conversational Sessions & Transcripts (Milestone 12)

CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY, -- UUIDv7
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    scan_context_id UUID REFERENCES scan_results(id) ON DELETE SET NULL,
    title VARCHAR(100) NOT NULL DEFAULT 'Ayurvedic Wellness Consultation',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY, -- UUIDv7
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    cited_chunk_ids UUID[], -- Classical RAG verses cited in assistant response
    prompt_tokens INT,
    completion_tokens INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 3. Voice Data Storage Decisions

| Component | Storage Paradigm | Storage Location | Retention Lifespan | Privacy Controls |
|---|---|---|---|---|
| **Raw Microphone Audio** | Ephemeral Hardware State | Client Device RAM | 0 seconds (Dropped instantly) | Zero server transmission; zero storage. |
| **Speech Transcripts (User)**| Minimal Relational Row | PostgreSQL `chat_messages` | Active account lifespan | RLS enforced (`auth.uid() = user_id`); hard purged on user erasure. |
| **Assistant Replies** | Minimal Relational Row | PostgreSQL `chat_messages` | Active account lifespan | Grounded in classical literature; non-diagnostic language enforced. |
| **Voice Synthesized Speech** | Ephemeral Client Audio | Browser Audio Buffer | 0 seconds | Generated locally via browser speech synthesis; zero server audio cache. |
