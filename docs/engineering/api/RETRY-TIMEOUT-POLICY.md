# Operational Contract: Retry, Timeout & Resilience Policy
## Timeout Budgets, Exponential Backoff with Jitter & Circuit Breaking

**Phase:** Phase 05 — Backend & API Contract Engineering  
**Domain:** System Resilience & Fault Tolerance  
**Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`  
**Authority:** Principal Backend Architect, Platform/SRE Architect  

---

## 1. Timeout Budget Allocation Matrix

To prevent cascading thread exhaustion and gateway deadlock, every internal and external dependency is governed by strict deadline budgets:

| Dependency Layer | Operation Type | Timeout Budget | Max Retry Attempts | Backoff Strategy | Terminal Action on Timeout |
|---|---|---|---|---|---|
| **Edge API Gateway** | Synchronous REST Request | **10 seconds** | 0 (Client retries) | N/A | Return `504 Gateway Timeout` |
| **PostgreSQL Database** | OLTP Relational Query | **2 seconds** | 1 attempt | Immediate Retry | Return `500 Internal Error` |
| **pgvector Extension** | HNSW Cosine Similarity Search | **500 ms** | 1 attempt | Immediate Retry | Trigger Safe Fallback (No Herbs) |
| **Private S3 Storage** | Ephemeral Image Fetch | **5 seconds** | 2 attempts | Exponential ($200\text{ms}, 400\text{ms}$) | Mark Job `FAILED_TERMINAL` |
| **OpenAI GPT-4o API** | Structured AI Reasoning | **15 seconds** | 2 attempts | Exponential + Full Jitter | Trigger Safe Fallback (Static Guidance)|
| **MediaPipe Wasm** | Client Landmark Extraction | **3 seconds** | 0 (Client resets) | N/A | Prompt User to Adjust Camera |

---

## 2. Exponential Backoff with Full Jitter Formulation

When retrying transient network or AI dependency failures:

$$t_{\text{sleep}} = \text{random}(0, \, \min(t_{\text{max}}, \, t_{\text{base}} \cdot 2^{\text{attempt}}))$$

Where $t_{\text{base}} = 500\text{ ms}$ and $t_{\text{max}} = 5000\text{ ms}$. Full jitter prevents thundering herd synchronization against upstream AI providers.
