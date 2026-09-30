// ============================================================
// AayurFace — Phase 13-R.1: Hybrid Retrieval, Intent Classification & Gating Engine
// Strict Non-Hallucination Barrier, Multi-Tier Evidence Filtering & Pluggable Retriever Architecture
// ============================================================

import type {
  QueryIntent,
  RetrievalFilter,
  RAGRetrievalResult,
  RetrievedChunkMatch,
  EvidenceItem,
  GroundingStatus,
  RetrievalBackendType,
  KnowledgeChunk
} from '@/types/rag';
import { defaultVectorStore, VectorStore, generateSemanticEmbedding } from './vectorStore';
import { initializeCorpusVectorStore } from './corpusData';
import { supabase } from '../supabase';

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
  if (
    lower.includes('safe') || lower.includes('patch test') || lower.includes('allergy') ||
    lower.includes('contraindicat') || lower.includes('boundary') || lower.includes('non-diagnostic')
  ) {
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
    passageStatus: chunk.passageStatus,
    chapter: chunk.chapter,
    section: chunk.section,
    pageNumber: chunk.pageNumber,
    verseNumbers: chunk.verseNumbers,
    contentExcerpt: chunk.contentEnglish,
    relevanceScore: cosineSimilarity,
    provenanceCitation: `${chunk.section}, ${chunk.chapter}${chunk.verseNumbers ? `, Verse ${chunk.verseNumbers}` : ''} [p. ${chunk.pageNumber}]`
  };
}

export const CANDIDATE_SIMILARITY_THRESHOLD = 0.40;
export const MIN_GROUNDING_CHUNK_COUNT = 2;

export interface GroundingGateResult {
  gatingPassed: boolean;
  groundingStatus: GroundingStatus;
  reason: string;
}

/**
 * Evidence-aware Grounding Gate (P13R.1-06):
 * Replaces blunt count-only gate with an authority-and-confidence evaluated decision:
 * 1. A single strong verified classical primary/scholarly chunk (Tier 1/2, passage verified, >= 0.45 similarity)
 *    qualifies to pass the grounding gate.
 * 2. Multiple verified chunks qualify as GROUNDED or PARTIALLY_GROUNDED depending on authority tier and similarity.
 * 3. Weak or unverified matches cannot pass.
 */
export function evaluateGroundingGate(
  matches: RetrievedChunkMatch[],
  _intent?: QueryIntent
): GroundingGateResult {
  if (!matches || matches.length === 0) {
    return {
      gatingPassed: false,
      groundingStatus: 'INSUFFICIENT_EVIDENCE',
      reason: 'No qualifying knowledge chunks retrieved above threshold.'
    };
  }

  const verifiedMatches = matches.filter(
    m => m.chunk.verificationStatus === 'VERIFIED'
  );

  if (verifiedMatches.length === 0) {
    return {
      gatingPassed: false,
      groundingStatus: 'INSUFFICIENT_EVIDENCE',
      reason: 'No verified knowledge chunks found among matches.'
    };
  }

  const topMatch = verifiedMatches[0];

  // Case 1: Single match (P13R.1-06)
  if (verifiedMatches.length === 1) {
    const isPrimaryOrScholarly =
      topMatch.chunk.authorityTier === 'TIER_1_CLASSICAL_PRIMARY' ||
      topMatch.chunk.authorityTier === 'TIER_2_SCHOLARLY_TRANSLATION';
    const isPassageVerified = topMatch.chunk.passageStatus === 'PASSAGE_VERIFIED';

    if (isPrimaryOrScholarly && isPassageVerified && topMatch.cosineSimilarity >= 0.45) {
      return {
        gatingPassed: true,
        groundingStatus: 'GROUNDED',
        reason: 'Single high-confidence verified classical primary passage meets grounding criteria.'
      };
    } else if (
      topMatch.cosineSimilarity >= 0.45 &&
      topMatch.chunk.authorityTier === 'TIER_4_PROJECT_RESEARCH' &&
      _intent &&
      _intent !== 'GENERAL_CHAT' &&
      _intent !== 'UNKNOWN'
    ) {
      return {
        gatingPassed: true,
        groundingStatus: 'PARTIALLY_GROUNDED',
        reason: 'Single verified project research chunk provides domain-specific partial grounding.'
      };
    } else {
      return {
        gatingPassed: false,
        groundingStatus: 'INSUFFICIENT_EVIDENCE',
        reason: 'Single candidate chunk does not meet classical primary threshold.'
      };
    }
  }

  // Case 2: Multiple matches (>= 2)
  const hasHighTier = verifiedMatches.some(
    m => m.chunk.authorityTier === 'TIER_1_CLASSICAL_PRIMARY' || m.chunk.authorityTier === 'TIER_2_SCHOLARLY_TRANSLATION'
  );

  if (hasHighTier && topMatch.cosineSimilarity >= 0.45) {
    return {
      gatingPassed: true,
      groundingStatus: 'GROUNDED',
      reason: 'Multiple verified chunks with authoritative primary/scholarly grounding.'
    };
  }

  return {
    gatingPassed: true,
    groundingStatus: 'PARTIALLY_GROUNDED',
    reason: 'Multiple verified chunks provide secondary or partial grounding.'
  };
}

/**
 * Core Hybrid Retrieval Pipeline:
 * 1. Intent Classification
 * 2. Vector Cosine Search (min similarity default 0.40)
 * 3. Metadata Filtering (Active only, Tier qualification)
 * 4. Evidence-Aware Grounding Gate
 */
export function retrieveKnowledge(
  query: string,
  options: RetrievalFilter = {},
  store: VectorStore = defaultVectorStore,
  backendType: RetrievalBackendType = 'in-memory'
): RAGRetrievalResult {
  const startTime = Date.now();
  ensureCorpusInitialized(store);

  const intent = classifyQueryIntent(query);

  const filter: RetrievalFilter = {
    minCosineSimilarity: CANDIDATE_SIMILARITY_THRESHOLD,
    limit: 5,
    ...options
  };

  const matches = store.search(query, filter);
  const latencyMs = Date.now() - startTime;

  const gate = evaluateGroundingGate(matches, intent);

  return {
    query,
    intent,
    matches,
    qualifyingCount: matches.length,
    groundingStatus: gate.groundingStatus,
    gatingPassed: gate.gatingPassed,
    fallbackTriggered: !gate.gatingPassed,
    retrievalBackend: backendType,
    latencyMs
  };
}

// ------------------------------------------------------------
// Pluggable Knowledge Retriever Abstraction (P13R.1-02)
// ------------------------------------------------------------

export interface KnowledgeRetriever {
  readonly backendType: RetrievalBackendType;
  retrieve(query: string, options?: RetrievalFilter): Promise<RAGRetrievalResult>;
}

export class InMemoryKnowledgeRetriever implements KnowledgeRetriever {
  readonly backendType: RetrievalBackendType = 'in-memory';
  private store: VectorStore;

  constructor(store: VectorStore = defaultVectorStore) {
    this.store = store;
  }

  async retrieve(query: string, options: RetrievalFilter = {}): Promise<RAGRetrievalResult> {
    return retrieveKnowledge(query, options, this.store, 'in-memory');
  }
}

export class PgVectorKnowledgeRetriever implements KnowledgeRetriever {
  readonly backendType: RetrievalBackendType = 'pgvector';
  private supabaseClient: any;
  private fallbackRetriever: KnowledgeRetriever;

  constructor(
    supabaseClient: any = supabase,
    fallbackRetriever: KnowledgeRetriever = new InMemoryKnowledgeRetriever()
  ) {
    this.supabaseClient = supabaseClient;
    this.fallbackRetriever = fallbackRetriever;
  }

  async retrieve(query: string, options: RetrievalFilter = {}): Promise<RAGRetrievalResult> {
    const startTime = Date.now();
    const intent = classifyQueryIntent(query);
    const filter: RetrievalFilter = {
      minCosineSimilarity: CANDIDATE_SIMILARITY_THRESHOLD,
      limit: 5,
      ...options
    };

    try {
      if (!this.supabaseClient || typeof this.supabaseClient.rpc !== 'function') {
        throw new Error('Supabase client RPC unavailable');
      }

      // Generate 64-dimensional semantic projection vector
      const queryVector = generateSemanticEmbedding(query);

      const { data, error } = await this.supabaseClient.rpc('match_knowledge_chunks', {
        query_embedding: queryVector,
        match_threshold: filter.minCosineSimilarity ?? 0.40,
        match_count: filter.limit ?? 5,
        filter_tier: filter.minAuthorityTier ?? null
      });

      if (error) {
        throw error;
      }

      if (Array.isArray(data) && data.length > 0) {
        const matches: RetrievedChunkMatch[] = data.map((row: any) => {
          const chunk: KnowledgeChunk = {
            chunkId: row.chunk_id,
            documentId: row.source_id,
            sourceId: row.source_id,
            chapter: row.chapter,
            section: row.section,
            verseNumbers: row.verse_numbers,
            pageNumber: row.page_number,
            contentSanskrit: row.content_sanskrit,
            contentEnglish: row.content_english,
            language: row.language,
            authorityTier: row.authority_tier,
            verificationStatus: row.verification_status,
            passageStatus: row.passage_status,
            textStatus: row.text_status,
            contentHash: '',
            chunkingVersion: 'chunker-v1.0.0',
            tags: [],
            safetyLevel: 'TOPICAL_SAFE'
          };
          return {
            chunk,
            cosineSimilarity: Number(row.similarity ?? 0),
            relevanceExplanation: `PgVector cosine similarity ${(Number(row.similarity ?? 0) * 100).toFixed(1)}%`
          };
        });

        const gate = evaluateGroundingGate(matches, intent);
        return {
          query,
          intent,
          matches,
          qualifyingCount: matches.length,
          groundingStatus: gate.groundingStatus,
          gatingPassed: gate.gatingPassed,
          fallbackTriggered: !gate.gatingPassed,
          retrievalBackend: 'pgvector',
          latencyMs: Date.now() - startTime
        };
      }
    } catch {
      // Offline, mocked, or missing pgvector fallback: execute fallback retriever with explicit backend tag
      const fallbackResult = await this.fallbackRetriever.retrieve(query, options);
      return {
        ...fallbackResult,
        retrievalBackend: 'in-memory'
      };
    }

    // If query returns 0 matches in pgvector
    const emptyResult = await this.fallbackRetriever.retrieve(query, options);
    return {
      ...emptyResult,
      retrievalBackend: 'pgvector'
    };
  }
}

let authoritativeRetriever: KnowledgeRetriever | null = null;

export function getAuthoritativeRetriever(): KnowledgeRetriever {
  if (!authoritativeRetriever) {
    const procEnv = (typeof globalThis !== 'undefined' && (globalThis as unknown as { process?: { env?: Record<string, string> } }).process?.env) || {};
    const isSupabaseConfigured =
      typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL
        ? !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')
        : (procEnv.VITE_SUPABASE_URL && !procEnv.VITE_SUPABASE_URL.includes('placeholder'));

    if (isSupabaseConfigured) {
      authoritativeRetriever = new PgVectorKnowledgeRetriever();
    } else {
      authoritativeRetriever = new InMemoryKnowledgeRetriever();
    }
  }
  return authoritativeRetriever;
}

export function setAuthoritativeRetriever(retriever: KnowledgeRetriever): void {
  authoritativeRetriever = retriever;
}
