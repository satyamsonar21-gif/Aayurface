# AayurFace — Security Architecture Specification
## High-Privilege Administrative Security & Audit Governance

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Security Architect, Platform/SRE Architect, Compliance Lead  

---

### 1. The Principle of Least Administrative Privilege

Administrative access is a critical threat surface. In traditional architectures, "admin" often equates to unrestricted superuser database browsing. In AayurFace, this model is explicitly rejected:

> [!CRITICAL]
> **Admin $\neq$ Unrestricted Database Access**  
> System administrators **CANNOT** casually browse raw consumer biometric facial images or decrypt personal user health records.  
> Administrative privileges are compartmentalized into fine-grained functional roles. All administrative mutations and queries require hardware-backed Multi-Factor Authentication (MFA) and are recorded in an immutable Write-Once-Read-Many (WORM) audit trail.

---

### 2. Administrative Role Taxonomy & Separation of Duties

| Administrative Role | Assigned Personnel | Scope of Authorized Authority | Prohibited Actions | Security Verification Controls |
|---|---|---|---|---|
| `admin:knowledge` | Chief Ayurvedic Officer | Ingest, curate, and version classical literature chunks (`knowledge_chunks`). | Cannot view user accounts, profiles, or facial images. | WebAuthn FIDO2 MFA; four-eyes sign-off on verse publication. |
| `admin:support` | Customer Support Tier 2 | Inspect account delivery status, trigger password resets, review consent logs. | Cannot view facial images or alter RLS policies. | WebAuthn FIDO2 MFA; session timeouts after 15 minutes of inactivity. |
| `admin:security` | Security & SRE Engineers | Review SIEM audit logs, configure WAF rules, monitor token rotation. | Cannot read raw user records or mutate application data. | Dedicated administrative jump host / VPN IP allowlisting. |
| `admin:superuser` | Platform Architects | Emergency database maintenance, schema migration execution. | Everyday operational data browsing is strictly prohibited. | Multi-party break-glass protocol requiring two engineering leads. |

---

### 3. Administrative Access Controls & Audit Invariants

1. **Hardware-Backed MFA (WebAuthn / FIDO2):** Administrative login requires FIDO2/WebAuthn security keys (e.g., YubiKey) or TOTP authentication. SMS verification is strictly prohibited due to SIM-swapping vulnerabilities.
2. **Network Perimeter Restriction:** Administrative routes (`/api/v1/admin/*`) are blocked at the cloud edge WAF unless the request originates from a whitelisted static VPN CIDR range.
3. **Immutable WORM Audit Logging:** Every administrative action generates an immutable security event containing:
   * `admin_user_id`: Authenticated administrator UUID.
   * `action_type`: e.g., `ADMIN_KNOWLEDGE_CHUNK_PUBLISHED`, `ADMIN_ACCOUNT_LOCKED`.
   * `target_entity`: Table and target UUID.
   * `ip_address`: Originating IP and subnet hash.
   * `timestamp`: High-resolution UTC timestamp.
   * `justification`: Mandatory free-text ticket / incident identifier.
4. **Mass Export Prevention:** The administrative API forbids unpaginated bulk exports. Exports of research or system records are capped at a maximum of 50 records per query and require senior compliance authorization.
