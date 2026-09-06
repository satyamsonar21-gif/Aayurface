# AayurFace — Frontend Privacy Specification
## Granular Consent UX, Biometric Privacy Boundaries & Right-to-Erasure

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Domain:** Privacy Engineering & User Autonomy  
**Status:** `TARGET PRIVACY SPECIFICATION (REQUIRES LEGAL REVIEW)`  
**Authority:** Privacy Officer, Staff UX Engineer, Data Security Architect  

---

## 1. Unbundled Granular Consent Architecture

Consent is gathered via distinct, unbundled toggle controls on `/onboarding/consent` and `/settings/privacy`:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    GRANULAR CONSENT CONTROL PANEL                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ [✓] 1. Facial Biometric Feature Extraction (Mandatory for Scan)             │
│     "Extracts surface skin qualities (warmth, texture) in temporary memory. │
│      Raw photos are purged per privacy policy."                             │
│                                                                             │
│ [✓] 2. Holistic Wellness Context Processing (Mandatory for Analysis)        │
│     "Combines intake answers and lifestyle context with visual data."       │
│                                                                             │
│ [ ] 3. De-Identified Expert Research Sharing (Optional)                     │
│     "Allows masked, non-identifiable facial patches to be reviewed by       │
│      certified Ayurvedic scholars for algorithmic validation."              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Right-to-Erasure Workflow (`/settings/privacy`)

1. User clicks **"Permanently Delete My Account & All Health Records"**.
2. Critical confirmation modal requires typing: `PERMANENTLY DELETE MY ACCOUNT`.
3. Calls `DELETE /api/v1/profile/account` $\rightarrow$ Executes backend cascading purge + tombstoning $\rightarrow$ Clears browser local storage $\rightarrow$ Invalidates Supabase session $\rightarrow$ Redirects to `/` with confirmation toast.
