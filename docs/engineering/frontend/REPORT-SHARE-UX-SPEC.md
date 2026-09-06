# AayurFace — UX Specification: PDF Reports & Cryptographic Sharing
## PDF Compilation Modal, Ephemeral Downloads & 256-Bit Token Sharing

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Domain:** Reports & Collaboration UX  
**Status:** `TARGET UX SPECIFICATION (REQUIRES IMPLEMENTATION)`  
**Authority:** Staff UX Engineer, Security Architect  

---

## 1. Asynchronous PDF Export Journey

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PDF EXPORT USER JOURNEY                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. User clicks "Export PDF Summary" on Results Screen                       │
│ 2. Modal opens: POST /api/v1/reports/compile (Returns 202 Accepted)         │
│ 3. In-Modal Serene Progress: "Compiling high-resolution report..." (2-3s)   │
│ 4. Worker finishes ──► S3 signed GET URL issued (60-second TTL)             │
│ 5. Browser automatically triggers native file download                      │
│ 6. Signed URL is purged from frontend memory; zero persistent URL caching   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Public Cryptographic Sharing & PII Redaction Preview

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔗 Share Assessment Summary                                                 │
│                                                                             │
│ Link Expiration: [ 30 Days (Recommended) ▼ ]                                │
│                                                                             │
│ 🔒 Privacy Guarantee:                                                       │
│ The public recipient will ONLY see your Doshic breakdown and wellness       │
│ recommendations. Your name, email, phone number, and raw facial images      │
│ are 100% excluded from this link.                                           │
│                                                                             │
│ Share Link: https://aayurface.com/share/shr_9f8b2c4e1a7d... [ Copy Link ]   │
│                                                                             │
│ [ Revoke Active Share Link ] (Instantly invalidates public access)          │
└─────────────────────────────────────────────────────────────────────────────┘
```
