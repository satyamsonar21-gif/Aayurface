# AayurFace — Frontend Architecture Specification
## Target Route Architecture & Guard Hierarchy

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Date:** 2026-09-03  
**Status:** TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)  
**Authority:** Principal Frontend Architect, Staff UX Engineer  

---

## 1. Comprehensive Target Route Catalog

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      AAYURFACE TARGET ROUTE MAP                             │
├────┬───────────────────────┬───────────────────┬────────────────────────────┤
│ ID │ Path                  │ Layout Shell      │ Auth / Guard Policy        │
├────┼───────────────────────┼───────────────────┼────────────────────────────┤
│ 01 │ `/`                   │ `PublicLayout`    │ Public (Unauthenticated)   │
│ 02 │ `/about`              │ `PublicLayout`    │ Public                     │
│ 03 │ `/how-it-works`       │ `PublicLayout`    │ Public                     │
│ 04 │ `/safety`             │ `PublicLayout`    │ Public (Non-diagnostic info│
│ 05 │ `/privacy`            │ `PublicLayout`    │ Public (DPDP/GDPR notice)  │
│ 06 │ `/terms`              │ `PublicLayout`    │ Public                     │
│ 07 │ `/login`              │ `PublicLayout`    │ Anonymous Only (Redirect)  │
│ 08 │ `/signup`             │ `PublicLayout`    │ Anonymous Only (Redirect)  │
│ 09 │ `/forgot-password`    │ `PublicLayout`    │ Anonymous Only             │
│ 10 │ `/onboarding`         │ `OnboardingLayout`│ Authenticated + Onboarding │
│ 11 │ `/onboarding/consent` │ `OnboardingLayout`│ Authenticated + Onboarding │
│ 12 │ `/onboarding/intake`  │ `OnboardingLayout`│ Authenticated + Onboarding │
│ 13 │ `/dashboard`          │ `AppLayout`       │ Authenticated + Completed  │
│ 14 │ `/analyze/capture`    │ `FullscreenLayout`│ Authenticated + Consent    │
│ 15 │ `/analyze/processing` │ `FullscreenLayout`│ Authenticated + In-Flight  │
│ 16 │ `/analyze/results/:id`│ `AppLayout`       │ Authenticated + Result Owner│
│ 17 │ `/routine`            │ `AppLayout`       │ Authenticated + Completed  │
│ 18 │ `/history`            │ `AppLayout`       │ Authenticated + Completed  │
│ 19 │ `/progress`           │ `AppLayout`       │ Authenticated + Completed  │
│ 20 │ `/voice`              │ `AppLayout`       │ Authenticated + Completed  │
│ 21 │ `/profile`            │ `AppLayout`       │ Authenticated + Completed  │
│ 22 │ `/settings`           │ `AppLayout`       │ Authenticated + Completed  │
│ 23 │ `/reports/:id`        │ `AppLayout`       │ Authenticated + Owner      │
│ 24 │ `/share/:token`       │ `PublicLayout`    │ Anonymous Public (256-bit) │
└────┴───────────────────────┴───────────────────┴────────────────────────────┘
```

---

## 2. Route Guard Execution Sequence

```text
Incoming Navigation to `/dashboard`
       │
       ▼
[ AuthGuard ] ──► Has valid Supabase JWT?
       │ No ──► Redirect `/login?redirect=/dashboard`
       │ Yes
       ▼
[ OnboardingGuard ] ──► `profiles.onboarding_completed == true`?
       │ No ──► Redirect `/onboarding` (Resumes at current FSM step)
       │ Yes
       ▼
[ Render Target Screen ] (With active AppLayout shell)
```
