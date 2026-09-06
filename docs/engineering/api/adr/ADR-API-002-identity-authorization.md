# ADR-API-002: Server-Authoritative Identity & Token Authorization

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Context:**  
Allowing client-supplied identifiers (`userId`, `profileId`) in request parameters introduces critical Broken Object Level Authorization (BOLA/IDOR) vulnerabilities where malicious actors impersonate other users.

**Decision:**  
All authenticated `/api/v1/*` endpoints derive user identity exclusively from the cryptographically verified RS256 JWT `sub` claim (`auth.uid()`) issued by Supabase Auth. Any client-supplied identity fields in request bodies or query parameters are unconditionally stripped at the gateway.

**Consequences:**  
* Mathematically prevents client-side identity spoofing and cross-tenant privilege escalation.
* Requires all downstream domain services and SQL queries to inject `auth.uid()` as the authoritative filtering predicate.

**Truth Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`
