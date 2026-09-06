# AayurFace — UX Specification: Multilingual Localization
## Language Architecture, Sanskrit Verse Typography & Devanagari Support

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Domain:** Internationalization & Localization  
**Status:** `TARGET UX SPECIFICATION (REQUIRES IMPLEMENTATION)`  
**Authority:** Staff UX Engineer, Accessibility Architect  

---

## 1. Supported Language Tiers

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       LANGUAGE ARCHITECTURE TIERS                           │
├───────────────────┬──────────────┬──────────────────────────────────────────┤
│ Language          │ Code         │ Scope & Implementation Level             │
├───────────────────┼──────────────┼──────────────────────────────────────────┤
│ **English**       │ `en`         │ Full Primary Application UI (100%)       │
│ **Hindi (हिंदी)** │ `hi`         │ Core Navigation, Questionnaires, Results │
│ **Sanskrit**      │ `sa`         │ Classical Shlokas (Devanagari + IAST)    │
└───────────────────┴──────────────┴──────────────────────────────────────────┘
```

---

## 2. Sanskrit & Devanagari Typography Rules

* **Script Rendering:** Classical verses are displayed in authentic Devanagari script paired with Roman IAST transliteration and English translation.
* **Font Fallback Stack:** Devanagari characters render using `Cormorant Garamond, 'Noto Serif Devanagari', serif` to ensure correct rendering of conjunct consonants and matras.
* **Language Persistence:** User language selection is persisted in `user_preferences.preferred_language` and cached in `localStorage(aayurface_pref_lang)`.
