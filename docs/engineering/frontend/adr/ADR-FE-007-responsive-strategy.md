# ADR-FE-007: Mobile-First Responsive Breakpoint Architecture

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Context:**  
Facial capture and routine tracking are predominantly mobile-first activities, while longitudinal progress analysis and PDF reports are frequently browsed on desktop tablets.

**Decision:**  
We implement a **Mobile-First Responsive Layout Architecture** supporting 4 primary breakpoints (`sm: 375px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`), dynamically transforming between Mobile BottomNav and Desktop Sidebar.

**Consequences:**  
* Guarantees optimal ergonomics on small touchscreens while providing rich multi-column dashboards on desktop.

**Truth Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`
