# ADR-FE-003: Client UI State Management via Zustand

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Context:**  
Managing transient UI state (sidebar collapse, active modals, toast notifications, audio synthesis) in monolithic React Context triggers unnecessary component re-renders across the tree.

**Decision:**  
We adopt **Zustand** for transient client-side UI state management, keeping stores small, selector-based, and decoupled from server data.

**Consequences:**  
* Granular component subscriptions with zero unnecessary parent re-renders.
* Eliminates heavy boilerplate and context provider nesting.

**Truth Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`
