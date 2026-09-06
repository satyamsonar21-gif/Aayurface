# ADR-FE-004: Server-State Management via TanStack Query v5

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Context:**  
The frontend interacts with 42 Phase 05 API endpoints, requiring automated caching, request deduplication, optimistic updates for routine tracking, and background polling for asynchronous AI analyses.

**Decision:**  
We standardize on **TanStack Query v5** for all server-state interactions, utilizing a centralized `queryKeys` factory and dedicated custom hooks.

**Consequences:**  
* Automated background refetching and stale data synchronization.
* Natural integration with optimistic UI updates and polling intervals.

**Truth Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`
