# AayurFace — Semantic Vector Space & Embedding Truth
## Mathematical Specification of Deterministic Domain Semantic Projection

**Model Name:** `aayur-semantic-proj-v1`  
**Embedding Version:** `emb-v1.0.0`  
**Vector Dimension:** $d = 64$  
**Architecture:** Deterministic Domain Semantic Projection (Non-Transformer / Zero-Latency)

---

### 1. Truth in Modeling: Non-Transformer Disclosure

In compliance with the Phase 13-R integrity protocol, AayurFace explicitly discloses:

> **The current vector store embedding model (`aayur-semantic-proj-v1`) is a deterministic, sparse-to-dense mathematical concept projection, NOT a deep transformer neural network (such as BERT, Ada, or BGE).**

This design was purposefully engineered for:
1. **100% Deterministic Reproducibility:** Identical text always maps to the exact same unit-normalized vector coordinates on any platform or architecture.
2. **Zero Client Latency:** Computation occurs synchronously in $<0.1\text{ ms}$ on the client browser thread without requiring heavy WebAssembly binaries or remote model inference calls.
3. **No Third-Party Leakage:** User skin queries are never transmitted to external commercial embedding APIs for vectorization.
4. **Mathematical Interpretability:** Individual vector dimensions map to distinct, inspectable Ayurvedic and dermatological ontological features.

---

### 2. Mathematical Vector Formulation

The 64-dimensional vector $\mathbf{v} \in \mathbb{R}^{64}$ is structured into two dedicated orthogonal subspaces:

$$\mathbf{v} = \begin{bmatrix} \mathbf{v}_{\text{semantic}} & \mathbf{v}_{\text{lexical}} \end{bmatrix}^T$$

#### A. Semantic Feature Subspace ($d \in [0, 47]$)
48 dimensions are strictly partitioned to represent core classical Ayurvedic and topical ontological concepts:

- **Dimensions 0–4 (Dosha Axes):**
  `[0: vata, 1: pitta, 2: kapha, 3: tridosha, 4: doshic]`
- **Dimensions 5–20 (Guna / Quality Axes):**
  `[5: ushna, 6: heat, 7: warm, 8: sita, 9: sheeta, 10: cooling, 11: cold, 12: ruksha, 13: dryness, 14: dry, 15: rough, 16: khara, 17: snigdha, 18: unctuous, 19: oily, 20: oiliness]`
- **Dimensions 21–28 (Physical Dynamics):**
  `[21: guru, 22: heavy, 23: laghu, 24: light, 25: manda, 26: slow, 27: teekshna, 28: sharp]`
- **Dimensions 29–36 (Dermatological & Complexion Observables):**
  `[29: skin, 30: twak, 31: complexion, 32: varna, 33: redness, 34: rakta, 35: texture, 36: shine]`
- **Dimensions 37–44 (Dravyaguna Botanical Ingredients):**
  `[37: chandana, 38: sandalwood, 39: kumari, 40: aloe, 41: nimba, 42: neem, 43: haridra, 44: turmeric]`
- **Dimensions 45–47 (Practices & Preparations):**
  `[45: lepa, 46: dinacharya, 47: routine]`

Concept matches in this subspace are weighted with a coefficient of $w_s = 3.0$ per term occurrence.

#### B. Lexical Dispersion Subspace ($d \in [48, 63]$)
16 dimensions represent secondary vocabulary through polynomial hash dispersion ($w_l = 0.5$):

$$h(w) = \left( \sum_{j=0}^{|w|-1} c_j \cdot 31^{j} \right) \pmod{16}$$

#### C. L2 Unit Sphere Normalization
To compute cosine similarity as a direct dot product, the vector is normalized:

$$\mathbf{\hat{v}} = \frac{\mathbf{v}}{\|\mathbf{v}\|_2} = \frac{\mathbf{v}}{\sqrt{\sum_{i=0}^{63} v_i^2}}$$

Cosine similarity between query $\mathbf{\hat{q}}$ and chunk $\mathbf{\hat{k}}$ is calculated as:

$$\text{Sim}(\mathbf{\hat{q}}, \mathbf{\hat{k}}) = \mathbf{\hat{q}} \cdot \mathbf{\hat{k}} = \sum_{i=0}^{63} q_i k_i \in [-1.0, 1.0]$$

---

### 3. Pgvector & Cloud Upgrade Pathway

Migration `20260924000002_phase13_pgvector_hardening.sql` defines:
- Column `embedding vector(64)`
- Cosine distance index `USING ivfflat (embedding vector_cosine_ops)`
- RPC function `match_knowledge_chunks(query_embedding vector(64))`

For production systems migrating to deep transformer embeddings (e.g. `text-embedding-3-small` or multilingual BGE-M3), the vector column can be migrated to `vector(1536)` without modifying any upstream citation, claim validation, or safety gating layers.
