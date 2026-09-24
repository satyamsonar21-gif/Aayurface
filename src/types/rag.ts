// ============================================================
// AayurFace — Phase 13: Explainable AI, RAG & Knowledge Safety
// Core Domain Models, Contracts & Type Definitions
// Strict Non-Diagnostic, Evidence-Grounded, Deterministic Architecture
// ============================================================

import type { Modality, EvidenceStrength, ConflictState } from '@/types/fusion';

// ------------------------------------------------------------
// 1. SOURCE AUTHORITY & VERIFICATION HIERARCHY
// ------------------------------------------------------------

export type AuthorityTier =
  | 'TIER_1_CLASSICAL_PRIMARY'      // Brihat-Trayi Sanskrit Texts (Charaka, Sushruta, Vagbhata)
  | 'TIER_2_SCHOLARLY_TRANSLATION'  // Vetted Translations & Lexicons (Bhishagratna, Murthy, Nighantus)
  | 'TIER_3_MODERN_RESEARCH'        // Peer-Reviewed Phytochemistry & Clinical Studies
  | 'TIER_4_PROJECT_RESEARCH'       // AayurFace Curated Topical/Dermatological Research
  | 'TIER_5_DATASET'                // Tabular Computational Datasets (Strictly non-authoritative)
  | 'TIER_6_UNVERIFIED';            // Unvetted External Content (Barred from production RAG)

export type SourceVerificationStatus =
  | 'VERIFIED'
  | 'PARTIALLY_VERIFIED'
  | 'UNVERIFIED'
  | 'QUARANTINED'
  | 'REJECTED';

export type IngestionStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'ACTIVE'
  | 'QUARANTINED'
  | 'REJECTED'
  | 'DEPRECATED';

// ------------------------------------------------------------
// 2. KNOWLEDGE ENTITY MODELS
// ------------------------------------------------------------

export interface KnowledgeSource {
  sourceId: string;
  title: string;
  author: string;
  language: string;
  authorityTier: AuthorityTier;
  verificationStatus: SourceVerificationStatus;
  ingestionStatus: IngestionStatus;
  fileHash: string;
  fileSize: number;
  pages: number;
  format: 'PDF_SCANNED' | 'PDF_TEXT' | 'CSV_TABULAR' | 'TEXT_MARKDOWN';
  sourceType: 'CLASSICAL_SAMHITA' | 'NIGHANTU' | 'SCHOLARLY_COMMENTARY' | 'MODERN_STUDY' | 'INTERNAL_RESEARCH';
  licenseStatus: string;
  edition?: string;
  publicationYear?: number;
  publisher?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeDocument {
  documentId: string;
  sourceId: string;
  title: string;
  documentVersion: string;
  contentHash: string;
  parserVersion: string;
  structureSummary: {
    sthanas?: string[];
    chaptersCount: number;
    sectionsCount?: number;
  };
  createdAt: string;
}

export interface KnowledgeChunk {
  chunkId: string;
  documentId: string;
  sourceId: string;
  chapter: string;
  section: string;
  verseNumbers?: string;
  pageNumber: number;
  contentSanskrit?: string;
  contentEnglish: string;
  contentOriginal?: string;
  language: string;
  authorityTier: AuthorityTier;
  verificationStatus: SourceVerificationStatus;
  contentHash: string;
  chunkingVersion: string;
  tags: string[];
  contraindications?: string[];
  safetyLevel: 'TOPICAL_SAFE' | 'INTERNAL_SAFE' | 'CAUTION_REQUIRED' | 'CONTRAINDICATED';
}

export interface KnowledgeEmbedding {
  chunkId: string;
  embeddingModel: string;
  embeddingVersion: string;
  vector: number[];
  dimension: number;
  createdAt: string;
}

// ------------------------------------------------------------
// 3. RETRIEVAL & EVIDENCE MODELS
// ------------------------------------------------------------

export type QueryIntent =
  | 'AYURVEDIC_CONCEPT'
  | 'SKIN_WELLNESS'
  | 'INGREDIENT'
  | 'FORMULATION'
  | 'LIFESTYLE'
  | 'DINACHARYA'
  | 'RITUCHARYA'
  | 'PRAKRITI_CONTEXT'
  | 'DOSHA_CONTEXT'
  | 'EXPLANATION'
  | 'SOURCE_LOOKUP'
  | 'SAFETY'
  | 'CONTRAINDICATION'
  | 'GENERAL_CHAT'
  | 'UNKNOWN';

export interface RetrievalFilter {
  minAuthorityTier?: AuthorityTier;
  languages?: string[];
  allowedSourceIds?: string[];
  activeOnly?: boolean;
  minCosineSimilarity?: number;
  limit?: number;
  requiredTags?: string[];
}

export interface RetrievedChunkMatch {
  chunk: KnowledgeChunk;
  cosineSimilarity: number;
  rerankScore?: number;
  relevanceExplanation?: string;
}

export interface RAGRetrievalResult {
  query: string;
  intent: QueryIntent;
  matches: RetrievedChunkMatch[];
  qualifyingCount: number;
  gatingPassed: boolean;
  fallbackTriggered: boolean;
  latencyMs: number;
}

export interface EvidenceItem {
  evidenceId: string;
  chunkId: string;
  sourceId: string;
  sourceTitle: string;
  authorityTier: AuthorityTier;
  verificationStatus: SourceVerificationStatus;
  chapter: string;
  section: string;
  pageNumber: number;
  verseNumbers?: string;
  contentExcerpt: string;
  relevanceScore: number;
  provenanceCitation: string;
}

// ------------------------------------------------------------
// 4. CLAIMS, CITATIONS & VALIDATION CONTRACTS
// ------------------------------------------------------------

export type ClaimSupportStatus =
  | 'SUPPORTED'
  | 'PARTIALLY_SUPPORTED'
  | 'CONFLICTING'
  | 'INSUFFICIENT_EVIDENCE'
  | 'UNSUPPORTED';

export interface GeneratedClaim {
  claimId: string;
  text: string;
  supportingEvidenceIds: string[];
  supportStatus: ClaimSupportStatus;
  validationNotes?: string;
}

export interface Citation {
  citationId: string;
  evidenceId: string;
  sourceTitle: string;
  location: string;
  authorityTier: AuthorityTier;
  verificationStatus: SourceVerificationStatus;
  directUrl?: string;
}

export interface ClaimValidationResult {
  allClaimsValid: boolean;
  validatedClaims: GeneratedClaim[];
  unsupportedClaims: GeneratedClaim[];
  rejectedCitationIds: string[];
  hallucinationDetected: boolean;
  refusalRequired: boolean;
}

// ------------------------------------------------------------
// 5. OUTPUT SAFETY & PROMPT DEFENSE
// ------------------------------------------------------------

export type SafetyViolationType =
  | 'PROHIBITED_MEDICAL_DIAGNOSIS'
  | 'FACE_TO_DOSHA_DIRECT_COLLAPSE'
  | 'FACE_TO_PRAKRITI_DIRECT_COLLAPSE'
  | 'PROHIBITED_PRESCRIPTION_DRUG'
  | 'GUARANTEED_CURE_PROMISE'
  | 'PROMPT_INJECTION_DETECTED'
  | 'FABRICATED_CITATION_ID'
  | 'MALICIOUS_INSTRUCTION_LEAKAGE'
  | 'SYSTEM_PROMPT_DISCLOSURE';

export interface SafetyValidationResult {
  isSafe: boolean;
  violations: SafetyViolationType[];
  violationDetails: string[];
  sanitizedText?: string;
}

// ------------------------------------------------------------
// 6. EXPLAINABLE AI (XAI) & AUDIT CONTRACTS
// ------------------------------------------------------------

export interface KnowledgeRuntimeVersion {
  knowledgeVersion: string;
  sourceVersion: string;
  chunkVersion: string;
  embeddingModel: string;
  embeddingVersion: string;
  retrievalVersion: string;
  promptVersion: string;
  modelVersion: string;
  safetyPolicyVersion: string;
}

export interface XAIObservedSignal {
  modality: Modality;
  signalName: string;
  signalValue: string;
  interpretationSummary: string;
}

export interface XAIExplanationPayload {
  analysisId: string;
  timestamp: string;
  observedSignals: XAIObservedSignal[];
  userContext: {
    skinType?: string;
    reportedPrakriti?: string;
    lifestyleFactors?: string[];
  };
  fusionSummary: {
    state: string;
    evidenceStrength: EvidenceStrength;
    conflictState: ConflictState;
    harmonicAgreementQualifier: string;
  };
  retrievedEvidence: EvidenceItem[];
  supportedClaims: GeneratedClaim[];
  sourceDisagreements: string[];
  scientificLimitations: string[];
  negativeMedicalBoundaries: string[];
  citations: Citation[];
  runtimeVersions: KnowledgeRuntimeVersion;
}

export interface RAGResponse {
  responseId: string;
  answerText: string;
  isGrounded: boolean;
  fallbackTriggered: boolean;
  fallbackReason?: string;
  evidence: EvidenceItem[];
  claims: GeneratedClaim[];
  citations: Citation[];
  xaiPayload?: XAIExplanationPayload;
  runtimeVersions: KnowledgeRuntimeVersion;
}

export interface RAGAuditTrace {
  requestId: string;
  userId: string;
  timestamp: string;
  query: string;
  intent: QueryIntent;
  retrievedChunkIds: string[];
  selectedEvidenceIds: string[];
  rejectedEvidenceIds: string[];
  rejectionReasons: string[];
  claimsGenerated: number;
  unsupportedClaimsCount: number;
  gatingPassed: boolean;
  fallbackTriggered: boolean;
  safetyViolations: SafetyViolationType[];
  runtimeVersions: KnowledgeRuntimeVersion;
  totalLatencyMs: number;
}
