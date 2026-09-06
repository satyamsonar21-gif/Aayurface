# Architecture Decision Record: ADR-015
## Deployment Strategy: GitOps CI/CD with Isolated Multi-Stage Environments

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Deciders:** DevOps/Platform Lead, Principal Software Architect  
**Technical Area:** Deployment & Release Automation  

---

### 1. Context
AayurFace requires dependable releases with automated quality gates (linting, typechecking, unit tests, bundle checks) and complete isolation between development, staging, and production databases.

### 2. Problem
Ensuring that unstable code or experimental schema changes cannot break production or contaminate real user records, while keeping the deployment process automated and auditable.

### 3. Options Evaluated
* **Option A: Manual CLI Deployments:** Developers deploy directly from local machines via `supabase functions deploy` and `vercel deploy`. (High human error risk).
* **Option B: GitOps CI/CD with Isolated Environments (Selected):** GitHub Actions automates lint, typecheck, test, and deployment across Local, Staging, and Production.
* **Option C: Complex Multi-Cloud Kubernetes Orchestration:** Overhead of ArgoCD and Terraform clusters.

### 4. Decision
Adopt **Option B: GitOps CI/CD with Isolated Environments**.
* Code pushes trigger GitHub Actions to run Oxlint, ESLint, TypeScript compiler (`tsc -b --noEmit`), and Vitest automated suites.
* Pull requests deploy preview environments on Vercel with isolated Supabase Staging databases.
* Merging to `main` deploys production frontend to Vercel and production Edge Functions to Supabase after all automated gates pass.

### 5. Rationale
* **Zero Accidental Deployments:** Broken builds or failing tests physically block the deployment pipeline.
* **Database Safety:** Production database credentials exist solely as encrypted repository secrets in GitHub Actions; developers do not have direct write access to production database credentials.
* **Instant Rollbacks:** Static hosting enables atomic blue/green rollbacks to previous build commits in $< 10$ seconds.

### 6. Consequences
* *Positive:* Consistent, repeatable, audit-logged releases; complete peace of mind during production deployments.
* *Negative:* Requires configuring environment secrets and Supabase CLI automation tokens in GitHub.

### 7. Risks & Mitigations
* *Risk:* Secrets accidentally printed in CI execution logs.
* *Mitigation:* GitHub Actions secret masking enabled; automated gitleaks pre-commit scanning.

### 8. Evidence
Git repository inspection confirmed existing GitHub repository upstream connection.

### 9. Revisit Conditions
Revisit if on-premise healthcare regulatory deployment requires air-gapped private cloud infrastructure.
