// ============================================================
// AayurFace — Phase 13: Semantic Citation-Preserving Chunker
// Retains precise chapter, section, verse, and page coordinates
// ============================================================

import type { KnowledgeChunk, AuthorityTier, SourceVerificationStatus } from '@/types/rag';
import { computeSha256, computeChunkId } from './contentHasher';
import { normalizeText } from './textNormalizer';

export interface ChunkInput {
  documentId: string;
  sourceId: string;
  chapter: string;
  section: string;
  pageNumber: number;
  verseNumbers?: string;
  contentSanskrit?: string;
  contentEnglish: string;
  contentOriginal?: string;
  language: string;
  authorityTier: AuthorityTier;
  verificationStatus: SourceVerificationStatus;
  tags?: string[];
  contraindications?: string[];
  safetyLevel?: 'TOPICAL_SAFE' | 'INTERNAL_SAFE' | 'CAUTION_REQUIRED' | 'CONTRAINDICATED';
}

export const CHUNKING_ENGINE_VERSION = 'chunker-v1.0.0';

/**
 * Creates an immutable, citation-addressable KnowledgeChunk.
 */
export function createKnowledgeChunk(input: ChunkInput): KnowledgeChunk {
  const normEnglish = normalizeText(input.contentEnglish);
  const normSanskrit = input.contentSanskrit ? normalizeText(input.contentSanskrit) : undefined;
  const chunkContent = `${normSanskrit ? normSanskrit + '\n' : ''}${normEnglish}`;
  const contentHash = computeSha256(chunkContent);

  const chunkId = computeChunkId(
    input.sourceId,
    input.chapter,
    input.section,
    input.verseNumbers || input.pageNumber
  );

  return {
    chunkId,
    documentId: input.documentId,
    sourceId: input.sourceId,
    chapter: input.chapter,
    section: input.section,
    verseNumbers: input.verseNumbers,
    pageNumber: input.pageNumber,
    contentSanskrit: normSanskrit,
    contentEnglish: normEnglish,
    contentOriginal: input.contentOriginal,
    language: input.language,
    authorityTier: input.authorityTier,
    verificationStatus: input.verificationStatus,
    contentHash,
    chunkingVersion: CHUNKING_ENGINE_VERSION,
    tags: input.tags || [],
    contraindications: input.contraindications || [],
    safetyLevel: input.safetyLevel || 'TOPICAL_SAFE'
  };
}

/**
 * Chunks long narrative text into citation-preserving segments bounded by paragraph or verse.
 */
export function chunkNarrativeText(
  baseInput: Omit<ChunkInput, 'contentEnglish'>,
  fullText: string,
  maxChunkSize = 800
): KnowledgeChunk[] {
  const normalized = normalizeText(fullText);
  if (!normalized) return [];

  const paragraphs = normalized.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const chunks: KnowledgeChunk[] = [];

  let currentBuffer = '';
  let segmentIndex = 1;

  for (const para of paragraphs) {
    if (currentBuffer.length + para.length + 1 > maxChunkSize && currentBuffer.length > 0) {
      chunks.push(
        createKnowledgeChunk({
          ...baseInput,
          chapter: `${baseInput.chapter} (Part ${segmentIndex})`,
          contentEnglish: currentBuffer.trim()
        })
      );
      segmentIndex++;
      currentBuffer = para;
    } else {
      currentBuffer = currentBuffer ? `${currentBuffer}\n\n${para}` : para;
    }
  }

  if (currentBuffer.trim().length > 0) {
    chunks.push(
      createKnowledgeChunk({
        ...baseInput,
        chapter: segmentIndex > 1 ? `${baseInput.chapter} (Part ${segmentIndex})` : baseInput.chapter,
        contentEnglish: currentBuffer.trim()
      })
    );
  }

  return chunks;
}
