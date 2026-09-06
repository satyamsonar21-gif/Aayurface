# Operational Contract: API Cost & Abuse Governance Model
## Token Budgets, Concurrency Limits & Denial-of-Wallet Defenses

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** FinOps & Traffic Governance  
**Status:** `TARGET ARCHITECTURE / PROPOSED (REQUIRES PRODUCTION CALIBRATION)`  
**Authority:** FinOps Analyst, AI Platform Architect, Security Architect  

---

## 1. AI Token Budgets & Cost Constraints

To prevent denial-of-wallet exploitation and unbounded API billing from third-party LLM providers:

| AI Subsystem Operation | Model Provider | Target Prompt Token Budget | Target Output Token Budget | Max Estimated Cost / Request | Rate / Concurrency Cap |
|---|---|---|---|---|---|
| **Classical RAG Query Embedding** | OpenAI `text-embedding-3-small` | $\le 100\text{ tokens}$ | N/A (1536 float array) | $\approx \$0.000002$ | 250 RPS |
| **Multimodal Doshic Reasoning** | OpenAI GPT-4o (JSON Mode) | $\le 1,500\text{ tokens}$ | $\le 800\text{ tokens}$ | $\approx \$0.012$ | 5 scans / user / hour |
| **Conversational Chat Turn** | OpenAI GPT-4o-mini | $\le 800\text{ tokens}$ | $\le 300\text{ tokens}$ | $\approx \$0.0003$ | 30 turns / user / hour |
| **PDF Headless Worker** | Puppeteer Chromium Serverless | N/A | $\approx 1.5\text{ MB PDF}$ | $\approx \$0.002$ (Compute) | 5 reports / user / hour |

---

## 2. Denial-of-Wallet Defense Invariants

1. **Strict Payload Caps:** All JSON request bodies are capped at **256 KB**; file uploads are capped at **5.0 MB**.
2. **Deterministic Prompt Truncation:** User-supplied lifestyle text and chat messages are hard-truncated (max 500 chars) before tokenization to eliminate prompt stuffing attacks.
3. **Daily Cost Circuit Breaker:** If total OpenAI platform spend exceeds $\$100.00/\text{day}$ during MVP beta, non-essential voice chat features automatically degrade to static local rules, while core scan analysis remains active with strict admin alerts.
