# AayurFace — Security Architecture Specification
## Secrets Management & Cryptographic Key Lifecycle

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Security Architect, Platform/SRE Architect, DevOps Lead  

---

### 1. The Zero-Client-Exposure Invariant

Platform secrets provide administrative and privileged authority over database engines, external AI models, and cryptographic signing systems:

> [!CRITICAL]
> **Zero Secrets in Client Environments**  
> Under NO circumstances shall server-side API keys, database credentials, or signing secrets be embedded into client source code, Vite build configuration, Git version control, or browser bundles.  
> Any secret required for operation resides exclusively in encrypted cloud environment vaults and is injected into serverless runtimes at execution time.

---

### 2. Platform Secrets Taxonomy & Rotation Schedule

| Secret Identifier | Purpose & Scope | Storage Mechanism | Permitted Runtimes | Rotation Cadence | Breach Revocation Protocol |
|---|---|---|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Superuser database access (RLS bypass) for internal workers. | Supabase Project Vault / Cloud KMS | Background edge functions, DB migration CI runner. | Every 90 days. | Instant regeneration in Supabase dashboard; restarts edge workers. |
| `OPENAI_API_KEY` | Outbound inference requests to OpenAI GPT-4o and embeddings. | Encrypted Serverless Environment Secret | Analysis orchestrator edge function. | Every 90 days. | Regenerate in OpenAI console; update vault key; verify billing alerts. |
| `JWT_SECRET_SIGNING_KEY` | RS256 private key for signing user authentication tokens. | Supabase Auth Managed Key Management Service | Supabase Auth service only. | Automated 180-day key rollover. | Emergency rollover invalidates active sessions; forces re-authentication. |
| `STORAGE_HMAC_SECRET` | Signing short-lived S3 PUT/GET URLs for facial captures. | Supabase Storage Service Vault | Capture upload generator function. | Every 90 days. | Rotate secret; previously issued signed URLs expire within 15 minutes. |
| `CRON_WEBHOOK_SECRET` | Authenticating scheduled background workers (e.g., orphan cleanup). | Encrypted Cloud Secret Vault | Edge function cron dispatcher. | Every 90 days. | Update secret header in scheduler. |

---

### 3. Secret Lifecycle Management Framework

1. **Creation & Provisioning:** Secrets are generated using cryptographically secure pseudorandom generators (`crypto.getRandomValues()` with $\ge 256$ bits of entropy).
2. **Access Control (Least Privilege):** Serverless Edge Functions request secrets lazily at runtime (`Deno.env.get('OPENAI_API_KEY')`). Edge workers that only perform questionnaire scoring do NOT possess the `OPENAI_API_KEY`.
3. **Automated Secret Scanning (CI/CD):**
   * Pre-commit hooks (`gitleaks`) scan local working trees to block accidental commits containing API tokens.
   * GitHub Secret Scanning actively monitors all branch pushes for Supabase, OpenAI, or AWS credential patterns.
4. **Emergency Revocation Procedure:** If a secret is compromised or logged:
   * **Step 1:** Revoke the compromised key immediately at the upstream provider.
   * **Step 2:** Generate a replacement credential with 256-bit entropy.
   * **Step 3:** Deploy the new secret to the staging and production vaults simultaneously.
   * **Step 4:** Initiate security audit log inspection to identify any unauthorized API calls made during the exposure window.
