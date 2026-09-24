// ============================================================
// AayurFace — Phase 13: Vector Store & Cosine Similarity Engine
// Multi-Tier Metadata Filtering, Semantic Embedding & Gated Retrieval
// ============================================================

import type {
  KnowledgeChunk,
  KnowledgeEmbedding,
  RetrievalFilter,
  RetrievedChunkMatch,
  AuthorityTier
} from '@/types/rag';

export const CURRENT_EMBEDDING_MODEL = 'aayur-semantic-proj-v1';
export const CURRENT_EMBEDDING_VERSION = 'emb-v1.0.0';
export const VECTOR_DIMENSION = 64;

// Key Ayurvedic semantic feature axes (dimensions 0 to 47 reserved exclusively for these concepts)
const SEMANTIC_AXES: string[] = [
  // Dosha axes (0..4)
  'vata', 'pitta', 'kapha', 'tridosha', 'doshic',
  // Guna / Quality axes (5..20)
  'ushna', 'heat', 'warm', 'sita', 'sheeta', 'cooling', 'cold',
  'ruksha', 'dryness', 'dry', 'rough', 'khara',
  'snigdha', 'unctuous', 'oily', 'oiliness',
  // Weight & Speed Gunas (21..28)
  'guru', 'heavy', 'laghu', 'light', 'manda', 'slow', 'teekshna', 'sharp',
  // Physical / Dermatological observables (29..36)
  'skin', 'twak', 'complexion', 'varna', 'redness', 'rakta', 'texture', 'shine',
  // Dravya / Botanical ingredients (37..44)
  'chandana', 'sandalwood', 'kumari', 'aloe', 'nimba', 'neem', 'haridra', 'turmeric',
  // Preparations & Practices (45..47)
  'lepa', 'dinacharya', 'routine'
];

const RESERVED_SEMANTIC_DIMENSIONS = SEMANTIC_AXES.length; // 48
const GENERAL_DIMENSION_START = RESERVED_SEMANTIC_DIMENSIONS; // 48..63 (16 dimensions for general vocabulary)

/**
 * Normalizes vector to unit length (L2 norm = 1.0)
 */
function normalizeL2(vec: number[]): number[] {
  const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  if (norm === 0) return vec.map(() => 0);
  return vec.map(val => val / norm);
}

/**
 * Computes deterministic semantic embedding vector:
 * - Dimensions 0..47: Primary Ayurvedic semantic concept projections with strong weighting.
 * - Dimensions 48..63: General word token hashing to capture secondary vocabulary without drowning out core concepts.
 */
export function generateSemanticEmbedding(text: string): number[] {
  const lower = text.toLowerCase();
  const vector = new Array<number>(VECTOR_DIMENSION).fill(0);

  // 1. Project against explicit Ayurvedic semantic axes (isolated to dimensions 0..47)
  SEMANTIC_AXES.forEach((axis, idx) => {
    const regex = new RegExp(`\\b${axis}\\b`, 'gi');
    const matches = lower.match(regex);
    if (matches) {
      vector[idx] += matches.length * 3.0;
    }
  });

  // 2. Project general word tokens across dimensions 48..63 (non-overlapping with semantic axes)
  const words = lower.split(/[^a-z0-9\u0900-\u097F]+/).filter(w => w.length > 2);
  words.forEach(w => {
    // Only hash words that are not already core semantic axes
    if (!SEMANTIC_AXES.includes(w)) {
      let hash = 0;
      for (let j = 0; j < w.length; j++) {
        hash = (hash * 31 + w.charCodeAt(j)) % (VECTOR_DIMENSION - GENERAL_DIMENSION_START);
      }
      vector[GENERAL_DIMENSION_START + hash] += 0.5;
    }
  });

  return normalizeL2(vector);
}

/**
 * Computes dot product between two unit-normalized vectors (cosine similarity)
 */
export function computeCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;
  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  return Math.max(-1.0, Math.min(1.0, dotProduct));
}

// Numerical authority weight rank (Tier 1 is highest priority)
const AUTHORITY_TIER_RANK: Record<AuthorityTier, number> = {
  TIER_1_CLASSICAL_PRIMARY: 6,
  TIER_2_SCHOLARLY_TRANSLATION: 5,
  TIER_3_MODERN_RESEARCH: 4,
  TIER_4_PROJECT_RESEARCH: 3,
  TIER_5_DATASET: 2,
  TIER_6_UNVERIFIED: 1
};

export class VectorStore {
  private chunks: Map<string, KnowledgeChunk> = new Map();
  private embeddings: Map<string, KnowledgeEmbedding> = new Map();

  public addChunk(chunk: KnowledgeChunk, customVector?: number[]): void {
    this.chunks.set(chunk.chunkId, chunk);
    const textToEmbed = `${chunk.chapter} ${chunk.section} ${chunk.tags.join(' ')} ${chunk.contentEnglish} ${chunk.contentSanskrit || ''}`;
    const vector = customVector && customVector.length === VECTOR_DIMENSION
      ? normalizeL2(customVector)
      : generateSemanticEmbedding(textToEmbed);

    this.embeddings.set(chunk.chunkId, {
      chunkId: chunk.chunkId,
      embeddingModel: CURRENT_EMBEDDING_MODEL,
      embeddingVersion: CURRENT_EMBEDDING_VERSION,
      vector,
      dimension: VECTOR_DIMENSION,
      createdAt: new Date().toISOString()
    });
  }

  public getChunk(chunkId: string): KnowledgeChunk | undefined {
    return this.chunks.get(chunkId);
  }

  public getAllChunks(): KnowledgeChunk[] {
    return Array.from(this.chunks.values());
  }

  public getEmbedding(chunkId: string): KnowledgeEmbedding | undefined {
    return this.embeddings.get(chunkId);
  }

  public size(): number {
    return this.chunks.size;
  }

  public clear(): void {
    this.chunks.clear();
    this.embeddings.clear();
  }

  public search(query: string, filter: RetrievalFilter = {}): RetrievedChunkMatch[] {
    const {
      minAuthorityTier,
      languages,
      allowedSourceIds,
      minCosineSimilarity = 0.40,
      limit = 5,
      requiredTags
    } = filter;

    const queryVector = generateSemanticEmbedding(query);
    const matches: RetrievedChunkMatch[] = [];

    const minRank = minAuthorityTier ? AUTHORITY_TIER_RANK[minAuthorityTier] : 0;

    for (const [chunkId, chunk] of this.chunks.entries()) {
      if (chunk.verificationStatus === 'QUARANTINED' || chunk.verificationStatus === 'REJECTED') {
        continue;
      }

      if (AUTHORITY_TIER_RANK[chunk.authorityTier] < minRank) {
        continue;
      }

      if (languages && languages.length > 0 && !languages.includes(chunk.language)) {
        continue;
      }

      if (allowedSourceIds && allowedSourceIds.length > 0 && !allowedSourceIds.includes(chunk.sourceId)) {
        continue;
      }

      if (requiredTags && requiredTags.length > 0) {
        const hasTag = requiredTags.some(t => chunk.tags.includes(t));
        if (!hasTag) continue;
      }

      const emb = this.embeddings.get(chunkId);
      if (!emb) continue;

      const sim = computeCosineSimilarity(queryVector, emb.vector);

      if (sim >= minCosineSimilarity) {
        matches.push({
          chunk,
          cosineSimilarity: Number(sim.toFixed(4)),
          relevanceExplanation: `Matched on semantic cosine similarity ${(sim * 100).toFixed(1)}%`
        });
      }
    }

    matches.sort((a, b) => {
      const simDiff = b.cosineSimilarity - a.cosineSimilarity;
      if (Math.abs(simDiff) > 0.05) return simDiff;
      return AUTHORITY_TIER_RANK[b.chunk.authorityTier] - AUTHORITY_TIER_RANK[a.chunk.authorityTier];
    });

    return matches.slice(0, limit);
  }
}

export const defaultVectorStore = new VectorStore();
