# ADR-FE-002: Routing Architecture & Route-Level Code Splitting

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Context:**  
The application contains 24 distinct screens across public marketing, authentication, onboarding, core application, and legal domains. Loading all screens in a monolithic bundle degrades initial page load performance.

**Decision:**  
We implement **React Router DOM v7** with **Route-Level Code Splitting (`React.lazy()`)** across all major feature pages, wrapped in responsive layout shells (`PublicLayout`, `OnboardingLayout`, `AppLayout`, `FullscreenLayout`).

**Consequences:**  
* Reduces initial bundle size to $\le 150\text{ KB}$ gzipped.
* Enables atomic Suspense loading states and dedicated auth/onboarding guard evaluation.

**Truth Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`
