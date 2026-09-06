# AayurFace — Security Architecture Specification
## Software Supply Chain, Dependency & Build Pipeline Security

**Phase:** Phase 03 — Enterprise Security, Privacy, Threat Modeling & AI Safety Architecture  
**Date:** 2026-09-03  
**Status:** FORMAL ARCHITECTURAL SPECIFICATION (Target Design; Implementation Pending)  
**Authority:** Platform/SRE Architect, DevOps Lead, Principal Security Architect  

---

### 1. Supply Chain Threat Modeling

Modern web applications depend on hundreds of third-party open-source libraries. An attacker compromising an upstream package can execute arbitrary JavaScript in user browsers, steal access tokens, or alter computer vision landmarking algorithms:
* **Dependency Typosquatting / Malicious Package Injection:** An attacker registers packages with names visually identical to legitimate libraries (e.g., `mediapipe-facemesh` vs `@mediapipe/face_mesh`).
* **Compromised Transitive Dependencies:** A deeply nested utility package compromised by a rogue maintainer or stolen npm credentials.
* **Build Pipeline Tampering:** Compromised GitHub Actions runners injecting malicious backdoors into client production bundles during compilation.
* **Model Weight Tampering:** Ingesting untrusted, unverified third-party model weights that harbor backdoors.

---

### 2. Multi-Layered Supply Chain Security Controls

```text
[Developer PR] ──► [1. Lockfile Integrity Check] (`package-lock.json` hash audit)
                         │
                         ▼
                   [2. Automated Vulnerability Scanning] (`npm audit`, Dependabot)
                         │
                         ▼
                   [3. Static Application Security Testing (SAST)] (Oxlint / ESLint Security)
                         │
                         ▼
                   [4. Secret Scanning Gate] (Gitleaks pattern detector)
                         │
                         ▼
                   [5. Pinned Build Environment] (Node 20 LTS, Ubuntu 22.04 LTS Runner)
                         │
                         ▼
                   [6. Production Bundle Integrity] (Subresource Integrity, SHA-384 Hashes)
```

---

### 3. Supply Chain Security Architecture Standards

| Control Area | Security Standard & Architecture Constraint | Target Phase Verification |
|---|---|---|
| **Lockfile Strict Enforcement** | All production and staging builds execute `npm ci` (never `npm install`). The build fails if `package-lock.json` exhibits cryptographic hash discrepancies. | Milestone 14 CI Pipeline |
| **Dependency Pinning** | Production packages in `package.json` must be pinned to exact semantic versions (or strict minor ranges) to prevent unreviewed automatic upstream updates. | Milestone 01 Dependency Audit |
| **Automated SAST Scanning** | Every GitHub Actions pull request triggers an automated SAST scan scanning for Prototype Pollution, DOM XSS, and unsafe regexes. | GitHub Actions CI Workflow |
| **Software Bill of Materials (SBOM)** | The build pipeline generates a CycloneDX standard SBOM for every release tag, indexing all direct and transitive dependencies for rapid CVE triage. | Production Release Gate |
| **Third-Party CDN Prohibition** | Third-party scripts are **NEVER** loaded from external CDNs at runtime. All libraries (including MediaPipe WebAssembly binaries and UI icons) are bundled locally within the application origin. | Content Security Policy Audit |
| **Vulnerability Response Protocol** | Critical CVEs (CVSS $\ge 9.0$) in direct dependencies trigger an immediate emergency patch cycle within 24 hours; High CVEs (CVSS 7.0–8.9) are resolved within 7 days. | SRE Vulnerability SLA |
