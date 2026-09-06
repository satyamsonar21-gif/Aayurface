# AayurFace — Security Architecture Specification
## Comprehensive Security Risk Register

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Chief Security Architect, Privacy Officer, Platform/SRE Architect  

---

### 1. Enterprise Risk Scoring Framework

Risks are quantified pre-mitigation (**Inherent Risk**) and post-mitigation (**Residual Risk**) using a $5 \times 5$ matrix:
$$\text{Risk Score} = \text{Likelihood (1–5)} \times \text{Impact (1–5)}$$
* Low (1–5) • Medium (6–11) • High (12–19) • Critical (20–25)

---

### 2. Comprehensive Security Risk Register

| Risk ID | Risk Title & Description | Threat Source | Underlying System Vulnerability | Inherent Likelihood | Inherent Impact | Inherent Risk | Target Architectural Control | Residual Likelihood | Residual Impact | Residual Risk | Risk Owner | Implementation Milestone | Target Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **RSK-01** | **Public Facial Biometric Scraping** | External Scraping Bot / Malicious Actor | Misconfigured S3 bucket with public read permissions. | 4 | 5 | **20 (Critical)** | S3 private bucket policy; all reads require short-lived HMAC-signed URLs. | 1 | 5 | **5 (Low)** | Platform Architect | Milestone 08 | Target Control |
| **RSK-02** | **Cross-Tenant BOLA Data Exfiltration** | Authenticated User / Competitor | API queries omitting tenant ownership validation on resource IDs. | 4 | 5 | **20 (Critical)** | Server-side identity extraction (`auth.uid()`) + PostgreSQL kernel RLS + 404 mask. | 1 | 5 | **5 (Low)** | Staff Backend Architect | Milestone 04 & 11 | Target Control |
| **RSK-03** | **Client-Supplied Identity Impersonation** | Authenticated Malicious User | Existing Edge Functions accepting `request.body.userId` without token verification. | 5 | 5 | **25 (Critical)** | Decommission body `userId`; derive caller identity exclusively from verified JWT. | 1 | 4 | **4 (Low)** | Security Architect | Milestone 03 | Target Control |
| **RSK-04** | **AI Medical Diagnostic Hallucination** | Non-deterministic Foundation Model | LLM emitting clinical diagnoses or prescription drugs. | 4 | 5 | **20 (Critical)** | Delimiter prompt fencing + post-inference deterministic keyword safety filter. | 2 | 3 | **6 (Medium)** | AI/ML Architect | Milestone 12 | Target Control |
| **RSK-05** | **AI Denial-of-Wallet Financial Drain** | Automated Script / Malicious Actor | Unrestricted API endpoints triggering costly OpenAI inference calls. | 4 | 4 | **16 (High)** | Sliding window rate limiting: proposed baseline of 5 analyses/user/hour. | 2 | 2 | **4 (Low)** | Platform/SRE Architect | Milestone 11 | Target Control |
| **RSK-06** | **Wildcard CORS Origin Exploitation** | Malicious Phishing Domain | Discovered wildcard `*` CORS in existing Edge Functions. | 4 | 4 | **16 (High)** | Production origin whitelist (`https://app.aayurface.in`) + credentials verification. | 1 | 4 | **4 (Low)** | Backend Architect | Milestone 03 | Target Control |
| **RSK-07** | **Polyglot Executable Storage Injection**| Remote Attacker | Upload endpoint validating only file extension without byte inspection. | 3 | 4 | **12 (High)** | Magic-byte scanner (`FF D8 FF`) + Canvas decode and re-encode to clean JPEG. | 1 | 4 | **4 (Low)** | Computer Vision Architect| Milestone 08 | Target Control |
| **RSK-08** | **Biometric & Token Leakage in Logs** | Developer Console / APM Logging | Unsanitized JSON logging of user payloads and base64 strings. | 4 | 4 | **16 (High)** | Central logger regex sanitizer intercepting base64 images, tokens, and passwords. | 1 | 3 | **3 (Low)** | Observability Lead | Milestone 14 | Target Control |
| **RSK-09** | **Profile Mass Assignment Privilege Escalation** | Authenticated User | API endpoint mapping raw JSON directly to database columns. | 3 | 4 | **12 (High)** | Strict Zod schema stripping unwhitelisted fields + RLS update restrictions. | 1 | 4 | **4 (Low)** | Staff Backend Architect | Milestone 11 | Target Control |
| **RSK-10** | **Semantic Poisoning of Classical Texts** | Compromised Admin Account | Ingestion of unvetted Ayurvedic remedies into RAG vector store. | 2 | 5 | **10 (Medium)** | Four-eyes expert domain sign-off + read-only database RLS policies. | 1 | 4 | **4 (Low)** | Chief Ayurvedic Officer | Milestone 10 | Target Control |
| **RSK-11** | **Share Link Enumeration & Scraping** | Web Scraper Bot | Guessable sequential or low-entropy public share URLs. | 3 | 4 | **12 (High)** | 256-bit cryptographic entropy tokens + hash-at-rest (`token_hash`). | 1 | 3 | **3 (Low)** | Security Architect | Milestone 13 | Target Control |
| **RSK-12** | **Accidental Biometric Backup Retention** | Cloud Snapshot Scheduler | Database backups indefinitely storing raw facial imagery. | 3 | 4 | **12 (High)** | Decouple storage: raw images stored only in S3 (excluded from DB snapshots). | 1 | 3 | **3 (Low)** | Principal Data Architect | Milestone 04 | Target Control |
| **RSK-13** | **Administrative Account Takeover** | Phishing / Credential Leak | Admin portal relying exclusively on email/password authentication. | 3 | 5 | **15 (High)** | WebAuthn FIDO2 hardware token enforcement + IP allowlisting for admin routes. | 1 | 4 | **4 (Low)** | Security Architect | Milestone 17 | Target Control |
| **RSK-14** | **Re-Identification of Research Subjects**| External Researcher / Scraper | High-dimensional feature vectors matched against external voter rolls. | 2 | 4 | **8 (Medium)** | Coarsening age/location attributes; isolating research enclave from consumer DB. | 1 | 3 | **3 (Low)** | Privacy Officer | Milestone 18 | Target Control |
| **RSK-15** | **Third-Party Dependency Vulnerability** | Compromised Upstream Maintainer | Open-source npm package containing supply chain backdoor. | 3 | 5 | **15 (High)** | Pinned lockfile (`npm ci`) + automated Dependabot scanning in CI/CD pipeline. | 2 | 3 | **6 (Medium)** | DevOps/SRE Lead | Milestone 01 | Target Control |
