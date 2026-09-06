# AayurFace — Security Architecture Specification
## Security Incident Response & Breach Management Architecture

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Principal Security Architect, SRE Incident Lead, Privacy Officer  
**Legal Notice:** Notification timelines and reporting thresholds to regulatory bodies (e.g., Data Protection Board of India / CERT-In) **REQUIRE FORMAL LEGAL AND COMPLIANCE REVIEW**.  

---

### 1. Incident Severity Classification Matrix

Security incidents are categorized into four standard severity tiers:

| Severity Level | Definition & Criteria | Concrete AayurFace Trigger Scenarios | Response SLA | Escalation Target |
|---|---|---|---|---|
| **P0: CRITICAL** | Catastrophic platform compromise; active mass data exfiltration; leakage of primary cryptographic root keys. | • Leakage of `SUPABASE_SERVICE_ROLE_KEY` or database root credentials.<br/>• Public exposure or scraping of `facial-captures/` S3 bucket.<br/>• Confirmed cross-tenant BOLA exploit leaking biometric imagery.<br/>• Systematic failure of PostgreSQL Row-Level Security. | **Immediate (< 15 mins)** | Chief Security Architect, CTO, Privacy Officer, Legal Counsel |
| **P1: HIGH** | Significant security boundary breach without proof of mass exfiltration; unauthorized administrative privilege escalation. | • Unauthorized assignment of `admin` role to consumer account.<br/>• Leakage of `OPENAI_API_KEY` causing massive cost drain.<br/>• Bulk scraping of de-identified research datasets.<br/>• Sustained prompt injection attack successfully bypassing safety filters. | **< 1 hour** | Security Lead, Lead Backend Architect, Compliance Officer |
| **P2: MEDIUM** | Isolated vulnerability exploitation; anomalous denial-of-service; degraded security telemetry. | • Individual account brute-force compromise without lateral movement.<br/>• Rate-limiting failure causing localized API degradation.<br/>• Tampering with an individual user's daily routine records. | **< 4 hours** | SRE On-Call Engineer, Security Analyst |
| **P3: LOW** | Minor security hygiene defect; low-impact configuration drift. | • Dependency alert for low-severity transitive vulnerability.<br/>• Non-sensitive CORS configuration anomaly on staging.<br/>• Isolated spamming of public contact forms. | **< 24 hours** | Development Team Lead |

---

### 2. The 10-Stage Breach Response Lifecycle

```text
[1. DETECT] ──► [2. TRIAGE] ──► [3. CONTAIN] ──► [4. PRESERVE EVIDENCE] ──► [5. INVESTIGATE]
                                                                                   │
                                                                                   ▼
[10. POSTMORTEM] ◄── [9. COMMUNICATE] ◄── [8. VALIDATE] ◄── [7. RECOVER] ◄── [6. ERADICATE]
```

1. **Stage 1: Detection:** Automated detection via WAF rate-limit triggers, SIEM alerts, AWS GuardDuty anomalies, or external bug bounty reports.
2. **Stage 2: Triage & Severity Assignment:** Incident commander assesses affected asset sensitivity (e.g., raw biometrics vs. public literature) and assigns P0–P3 rating.
3. **Stage 3: Emergency Containment:**
   * P0 Key Compromise: Immediately invalidate and regenerate service-role keys in Supabase dashboard.
   * Compromised CIDR / IP: Blacklist offending IP ranges at the Cloudflare / WAF edge.
   * BOLA / Endpoint Exploit: Deploy emergency routing rule redirecting vulnerable endpoint to HTTP 503 Maintenance.
4. **Stage 4: Forensic Evidence Preservation:**
   * Take point-in-time forensic snapshots of PostgreSQL audit logs, WAF request dumps, and S3 access logs.
   * Lock audit logs to prevent accidental automated rotation or tampering during investigation.
5. **Stage 5: Root-Cause Investigation:** Security engineers trace the attack vector using `x-correlation-id` distributed traces to establish exact data exposure scope.
6. **Stage 6: Eradication & Patching:** Author, peer-review, and deploy an emergency fix closing the underlying vulnerability; force global session invalidation (`auth.signOut({ scope: 'global' })`) for compromised accounts.
7. **Stage 7: System Recovery:** Restore normal traffic routing; verify database integrity constraints and RLS active status.
8. **Stage 8: Forensic Validation:** Execute penetration test payloads reproducing the exploit to verify that the attack path is definitively blocked.
9. **Stage 9: Stakeholder & Regulatory Communication:** Legal counsel evaluates statutory breach notification obligations (e.g., DPDP Act 2023 / CERT-In directives). User notifications are coordinated under legal guidance.
10. **Stage 10: Blameless Postmortem & Threat Model Update:** Conduct blameless retrospective within 72 hours; document lessons learned; update STRIDE threat model and automated CI test suites.
