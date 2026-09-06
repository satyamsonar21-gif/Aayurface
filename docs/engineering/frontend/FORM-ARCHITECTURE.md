# AayurFace — Form Architecture Specification
## Form Validation, Schema Integration & Draft Persistence

**Phase:** Phase 06 — Frontend Architecture & Design Systems  
**Date:** 2026-09-03  
**Status:** TARGET FORM ARCHITECTURE (REQUIRES IMPLEMENTATION)  
**Authority:** Staff UX Engineer, Principal Frontend Architect  

---

## 1. Universal Form Stack & Validation Pipeline

All application forms (Authentication, Profile, Questionnaire, Lifestyle, Privacy) adhere to a unified architecture using **React Hook Form + Zod Resolvers + Accessible Field Wrappers**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       FORM VALIDATION PIPELINE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. Client-Side Schema Validation (Zod)                                      │
│    • Executed `onBlur` for visited fields; executed `onSubmit` for all.     │
│    • Instant inline error messaging linked via `aria-describedby`.          │
│                                                                             │
│ 2. Draft State Persistence (Debounced LocalStorage)                         │
│    • In-progress Questionnaire and Lifestyle inputs auto-saved to local     │
│      storage draft key (`aayurface_draft_qnr`) every 1000ms.                │
│    • Cleared immediately upon successful API submission.                    │
│                                                                             │
│ 3. Server Error Response Mapping (RFC 7807 Error Mapper)                    │
│    • Backend `422 Unprocessable` responses containing `details[].field`     │
│      are automatically mapped to React Hook Form via `form.setError()`.     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Server Error Mapping Utility Contract

```typescript
export function mapApiErrorsToForm<T extends FieldValues>(
  error: StandardErrorEnvelope['error'],
  setError: UseFormSetError<T>
) {
  if (error.details && Array.isArray(error.details)) {
    error.details.forEach((item) => {
      if (item.field) {
        setError(item.field as Path<T>, {
          type: 'server',
          message: item.issue
        });
      }
    });
  }
}
```
