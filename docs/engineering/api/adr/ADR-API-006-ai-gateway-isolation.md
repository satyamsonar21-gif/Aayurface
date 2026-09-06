# ADR-API-006: Strict AI & Vector Subsystem Isolation

**Status:** ACCEPTED  
**Date:** 2026-09-03  
**Context:**  
Direct client-to-LLM or client-to-vector database architectures expose third-party API keys, allow prompt injection, bypass consent gates, and produce unvalidated outputs.

**Decision:**  
All AI operations (Computer Vision feature extraction, pgvector semantic search, OpenAI GPT-4o reasoning, and safety regex scrubbing) execute strictly behind the authenticated backend gateway within isolated worker execution environments. Client applications possess zero direct network connectivity or API credentials to AI providers.

**Consequences:**  
* 100% centralized enforcement of AI safety, non-diagnostic constraints, and classical grounding.
* Protects upstream provider API keys from client-side extraction.

**Truth Status:** `TARGET ARCHITECTURE (REQUIRES IMPLEMENTATION)`
