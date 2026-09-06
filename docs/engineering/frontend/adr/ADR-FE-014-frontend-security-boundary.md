# ADR-FE-014: Frontend Security Boundary & Zero-Secret Isolation

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Context:**  
Browser environments are inherently untrusted. Leaking private keys, service-role tokens, or un-sanitized markdown introduces critical vulnerabilities.

**Decision:**  
The frontend bundle contains **Zero Server Secrets**. All API communications use standard RS256 JWT tokens, and any dynamic classical markdown is sanitized via DOMPurify under strict CSP headers.

**Consequences:**  
* Eliminates client-side credential theft and XSS execution risks.
* Server-authoritative `auth.uid()` remains the sole source of identity.

**Truth Status:** `AUTHORITATIVE SECURITY ARCHITECTURE`
