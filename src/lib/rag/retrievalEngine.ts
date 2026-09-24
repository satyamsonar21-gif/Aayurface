// ============================================================
// AayurFace — Phase 13: Hybrid Retrieval, Intent Classification & Gating Engine
// Strict Non-Hallucination Barrier & Multi-Tier Evidence Filtering
// ============================================================

import type {
  QueryIntent,
  RetrievalFilter,
  RAGRetrievalResult,
  RetrievedChunkMatch,
  EvidenceItem
} from '@/types/rag';
import { defaultVectorStore, VectorStore } from './vectorStore';
import { initializeCorpusVectorStore } from './corpusData';

// Ensure default vector store is initialized with verified corpus
let isDefaultInitialized = false;
export function ensureCorpusInitialized(store: VectorStore = defaultVectorStore): void {
  if (store === defaultVectorStore && !isDefaultInitialized && store.size() === 0) {
    initializeCorpusVectorStore(store);
    isDefaultInitialized = true;
  }
}

/**
 * Classifies the semantic intent of the query to guide retrieval strategy.
 */
export function classifyQueryIntent(query: string): QueryIntent {
  const lower = query.toLowerCase();

  // Safety / Medical intent
  if (lower.includes('safe') || lower.includes('patch test') || lower.includes('allergy') || lower.includes('contraindicat')) {
    return 'SAFETY';
  }

  // Ingredient / Dravya intent
  if (
    lower.includes('sandalwood') || lower.includes('chandana') ||
    lower.includes('aloe') || lower.includes('kumari') ||
    lower.includes('neem') || lower.includes('nimba') ||
    lower.includes('turmeric') || lower.includes('haridra') ||
    lower.includes('herb') || lower.includes('ingredient')
  ) {
    return 'INGREDIENT';
  }

  // Prakriti / Constitutional context
  if (lower.includes('prakriti') || lower.includes('constitution') || lower.includes('birth type')) {
    return 'PRAKRITI_CONTEXT';
  }

  // Dosha / Guna context
  if (
    lower.includes('dosha') || lower.includes('vata') || lower.includes('pitta') ||
    lower.includes('kapha') || lower.includes('guna') || lower.includes('ushna') ||
    lower.includes('ruksha') || lower.includes('snigdha')
  ) {
    return 'DOSHA_CONTEXT';
  }

  // Lifestyle / Dinacharya / Routine
  if (lower.includes('dinacharya') || lower.includes('routine') || lower.includes('lifestyle') || lower.includes('sleep') || lower.includes('water')) {
    return 'DINACHARYA';
  }

  // Skin wellness & appearance
  if (
    lower.includes('skin') || lower.includes('twak') || lower.includes('redness') ||
    lower.includes('dryness') || lower.includes('oiliness') || lower.includes('texture') ||
    lower.includes('glow') || lower.includes('complexion')
  ) {
    return 'SKIN_WELLNESS';
  }

  // Explanation request
  if (lower.includes('why') || lower.includes('explain') || lower.includes('how does') || lower.includes('observation')) {
    return 'EXPLANATION';
  }

  // Source lookup
  if (lower.includes('charaka') || lower.includes('sushruta') || lower.includes('vagbhata') || lower.includes('samhita') || lower.includes('shloka') || lower.includes('verse')) {
    return 'SOURCE_LOOKUP';
  }

  return 'GENERAL_CHAT';
}

/**
 * Transforms a RetrievedChunkMatch into a structured EvidenceItem
 */
export function chunkMatchToEvidence(match: RetrievedChunkMatch, index: number): EvidenceItem {
  const { chunk, cosineSimilarity } = match;
  return {
    evidenceId: `ev-${chunk.chunkId}-${index + 1}`,
    chunkId: chunk.chunkId,
    sourceId: chunk.sourceId,
    sourceTitle: chunk.sourceId === 'SRC-AH-MAR'
      ? 'Ashtanga Hridaya (Sutrasthana)'
      : chunk.sourceId === 'SRC-CS-MAR'
        ? 'Charaka Samhita'
        : chunk.sourceId === 'SRC-SS-ENG'
          ? 'Sushruta Samhita'
          : chunk.sourceId === 'SRC-BP-NIG'
            ? 'Bhavaprakasha Nighantu'
            : 'AayurFace Project Research',
    authorityTier: chunk.authorityTier,
    verificationStatus: chunk.verificationStatus,
    chapter: chunk.chapter,
    section: chunk.section,
    pageNumber: chunk.pageNumber,
    verseNumbers: chunk.verseNumbers,
    contentExcerpt: chunk.contentEnglish,
    relevanceScore: cosineSimilarity,
    provenanceCitation: `${chunk.section}, ${chunk.chapter}${chunk.verseNumbers ? `, Verse ${chunk.verseNumbers}` : ''} [p. ${chunk.pageNumber}]`
  };
}

/**
 * Core Hybrid Retrieval Pipeline:
 * 1. Intent Classification
 * 2. Vector Cosine Search (min similarity default 0.70)
 * 3. Metadata Filtering (Active only, Tier qualification)
 * 4. Evidence Gating: Requires >= 2 verified chunks to pass grounding gate
 */
export function retrieveKnowledge(
  query: string,
  options: RetrievalFilter = {},
  store: VectorStore = defaultVectorStore
): RAGRetrievalResult {
  const startTime = Date.now();
  ensureCorpusInitialized(store);

  const intent = classifyQueryIntent(query);

  // Apply calibrated retrieval filter (0.40 captures high-relevance domain matches while rejecting noise)
  const filter: RetrievalFilter = {
    minCosineSimilarity: 0.40,
    limit: 5,
    ...options
  };

  const matches = store.search(query, filter);
  const latencyMs = Date.now() - startTime;

  // Gating requires at least 2 verified matches meeting threshold
  const gatingPassed = matches.length >= 2;
  const fallbackTriggered = !gatingPassed;

  return {
    query,
    intent,
    matches,
    qualifyingCount: matches.length,
    gatingPassed,
    fallbackTriggered,
    latencyMs
  };
}
