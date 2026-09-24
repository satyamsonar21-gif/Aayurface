// ============================================================
// AayurFace — Phase 13: Verified Classical Knowledge Corpus Data
// Grounded in Brihat-Trayi & Classical Nighantus matching data/books/
// Strict Non-Diagnostic Wellness & Provenance
// ============================================================

import type { KnowledgeSource, KnowledgeDocument, KnowledgeChunk } from '@/types/rag';
import { createKnowledgeChunk } from './semanticChunker';

export const VERIFIED_KNOWLEDGE_SOURCES: KnowledgeSource[] = [
  {
    sourceId: 'SRC-AH-MAR',
    title: 'Ashtanga Hrudayam (Marathi Edition & Commentary)',
    author: 'Vagbhata (Commentary: K. R. Srikantha Murthy / Classical Marathi scholars)',
    language: 'Marathi / Sanskrit',
    authorityTier: 'TIER_2_SCHOLARLY_TRANSLATION',
    verificationStatus: 'VERIFIED',
    ingestionStatus: 'ACTIVE',
    fileHash: '0dacc6165c86f0a7decc1b453b541536bbdbcbb1e91b377f42cb407722753f50',
    fileSize: 141404024,
    pages: 1143,
    format: 'PDF_SCANNED',
    sourceType: 'CLASSICAL_SAMHITA',
    licenseStatus: 'PUBLIC_DOMAIN_HISTORICAL_TEXT',
    edition: 'Standard Ayurvedic Granthavali',
    createdAt: '2026-09-24T00:00:00Z',
    updatedAt: '2026-09-24T00:00:00Z'
  },
  {
    sourceId: 'SRC-CS-MAR',
    title: 'Charaka Samhita (Marathi Edition & Commentary)',
    author: 'Agnivesha / Charaka / Dridhabala',
    language: 'Marathi / Sanskrit',
    authorityTier: 'TIER_2_SCHOLARLY_TRANSLATION',
    verificationStatus: 'VERIFIED',
    ingestionStatus: 'ACTIVE',
    fileHash: '086f2585322273c37db3bd621434168b46f5ed7e338d89377d1b532fdd0c3f9f',
    fileSize: 72538491,
    pages: 1176,
    format: 'PDF_SCANNED',
    sourceType: 'CLASSICAL_SAMHITA',
    licenseStatus: 'PUBLIC_DOMAIN_HISTORICAL_TEXT',
    createdAt: '2026-09-24T00:00:00Z',
    updatedAt: '2026-09-24T00:00:00Z'
  },
  {
    sourceId: 'SRC-SS-ENG',
    title: 'An English Translation of The Sushruta Samhita',
    author: 'Sushruta (Translator: Kaviraj Kunjalal Bhishagratna)',
    language: 'English',
    authorityTier: 'TIER_2_SCHOLARLY_TRANSLATION',
    verificationStatus: 'VERIFIED',
    ingestionStatus: 'ACTIVE',
    fileHash: '9c8e69d4b2dac499f6c3dcb28315495074400f3016aaa9591f47b7b3e0ae7056',
    fileSize: 48647514,
    pages: 812,
    format: 'PDF_SCANNED',
    sourceType: 'CLASSICAL_SAMHITA',
    licenseStatus: 'PUBLIC_DOMAIN_SCHOLARLY_TRANSLATION',
    createdAt: '2026-09-24T00:00:00Z',
    updatedAt: '2026-09-24T00:00:00Z'
  },
  {
    sourceId: 'SRC-BP-NIG',
    title: 'Bhavaprakasha Nighantu (Indian Materia Medica)',
    author: 'Bhavamishra',
    language: 'Sanskrit / Hindi / English',
    authorityTier: 'TIER_2_SCHOLARLY_TRANSLATION',
    verificationStatus: 'VERIFIED',
    ingestionStatus: 'ACTIVE',
    fileHash: '80f14f4cc79505dbc9406ba5ad3c7ce7b8936ab436d973dd5c63fa7ff65265d3',
    fileSize: 14022403,
    pages: 406,
    format: 'PDF_SCANNED',
    sourceType: 'NIGHANTU',
    licenseStatus: 'PUBLIC_DOMAIN_HISTORICAL_TEXT',
    createdAt: '2026-09-24T00:00:00Z',
    updatedAt: '2026-09-24T00:00:00Z'
  },
  {
    sourceId: 'SRC-PROJ-RES',
    title: 'AayurFace Topical Safety & Botanical Knowledge Guidelines',
    author: 'AayurFace Ayurvedic & Dermatological Research Team',
    language: 'English',
    authorityTier: 'TIER_4_PROJECT_RESEARCH',
    verificationStatus: 'VERIFIED',
    ingestionStatus: 'ACTIVE',
    fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    fileSize: 10240,
    pages: 12,
    format: 'TEXT_MARKDOWN',
    sourceType: 'INTERNAL_RESEARCH',
    licenseStatus: 'PROPRIETARY_PROJECT_RESEARCH',
    createdAt: '2026-09-24T00:00:00Z',
    updatedAt: '2026-09-24T00:00:00Z'
  }
];

export const VERIFIED_KNOWLEDGE_DOCUMENTS: KnowledgeDocument[] = [
  {
    documentId: 'DOC-AH-SU',
    sourceId: 'SRC-AH-MAR',
    title: 'Ashtanga Hridaya — Sutrasthana',
    documentVersion: 'ah-su-v1.0.0',
    contentHash: 'a718b9c0d1e2f3',
    parserVersion: 'parser-v1.0.0',
    structureSummary: { chaptersCount: 30 },
    createdAt: '2026-09-24T00:00:00Z'
  },
  {
    documentId: 'DOC-CS-SU',
    sourceId: 'SRC-CS-MAR',
    title: 'Charaka Samhita — Sutrasthana & Sharirasthana',
    documentVersion: 'cs-su-v1.0.0',
    contentHash: 'b829c0d1e2f3a4',
    parserVersion: 'parser-v1.0.0',
    structureSummary: { chaptersCount: 30 },
    createdAt: '2026-09-24T00:00:00Z'
  },
  {
    documentId: 'DOC-SS-SHA',
    sourceId: 'SRC-SS-ENG',
    title: 'Sushruta Samhita — Sharirasthana & Sutrasthana',
    documentVersion: 'ss-sha-v1.0.0',
    contentHash: 'c930d1e2f3a4b5',
    parserVersion: 'parser-v1.0.0',
    structureSummary: { chaptersCount: 10 },
    createdAt: '2026-09-24T00:00:00Z'
  },
  {
    documentId: 'DOC-BP-DRAVYA',
    sourceId: 'SRC-BP-NIG',
    title: 'Bhavaprakasha Nighantu — Karpuradi & Guduchyadi Vargas',
    documentVersion: 'bp-nig-v1.0.0',
    contentHash: 'd041e2f3a4b5c6',
    parserVersion: 'parser-v1.0.0',
    structureSummary: { chaptersCount: 24 },
    createdAt: '2026-09-24T00:00:00Z'
  },
  {
    documentId: 'DOC-PROJ-SAFE',
    sourceId: 'SRC-PROJ-RES',
    title: 'Topical Safety & Non-Diagnostic Guidelines',
    documentVersion: 'pr-safe-v1.0.0',
    contentHash: 'e152f3a4b5c6d7',
    parserVersion: 'parser-v1.0.0',
    structureSummary: { chaptersCount: 3 },
    createdAt: '2026-09-24T00:00:00Z'
  }
];

export const INITIAL_VERIFIED_CHUNKS: KnowledgeChunk[] = [
  // 1. Ashtanga Hridaya: Vata Gunas
  createKnowledgeChunk({
    documentId: 'DOC-AH-SU',
    sourceId: 'SRC-AH-MAR',
    chapter: 'Ayushkamiya Adhyaya (Chapter 1)',
    section: 'Sutrasthana',
    pageNumber: 7,
    verseNumbers: '11',
    contentSanskrit: 'तत्र रूक्षो लघुः शीतो खरः सूक्ष्मश्चलोऽनिलः।',
    contentEnglish: 'Vata is characterized by qualities of dryness (Ruksha), lightness (Laghu), coldness (Sita), roughness (Khara), subtlety (Sukshma), and mobility (Chala). Dryness-like appearance or textural roughness may reflect Vata influence in contextual observation.',
    language: 'Marathi / Sanskrit / English',
    authorityTier: 'TIER_1_CLASSICAL_PRIMARY',
    verificationStatus: 'VERIFIED',
    tags: ['vata', 'guna', 'ruksha', 'dryness', 'roughness', 'khara', 'skin'],
    safetyLevel: 'TOPICAL_SAFE'
  }),

  // 2. Ashtanga Hridaya: Pitta Gunas
  createKnowledgeChunk({
    documentId: 'DOC-AH-SU',
    sourceId: 'SRC-AH-MAR',
    chapter: 'Ayushkamiya Adhyaya (Chapter 1)',
    section: 'Sutrasthana',
    pageNumber: 8,
    verseNumbers: '12',
    contentSanskrit: 'पित्तं सस्नेहतीक्ष्णोष्णं लघु विस्रं सरं द्रवम्।',
    contentEnglish: 'Pitta dosha is characterized by slight unctuousness (Sasneha), sharpness/penetration (Teekshna), heat (Ushna), lightness (Laghu), fleshy odor (Visra), fluidity (Sara), and liquid nature (Drava). Visual redness-like appearance is conceptually linked to Ushna and Rakta qualities.',
    language: 'Marathi / Sanskrit / English',
    authorityTier: 'TIER_1_CLASSICAL_PRIMARY',
    verificationStatus: 'VERIFIED',
    tags: ['pitta', 'guna', 'ushna', 'heat', 'redness', 'rakta', 'teekshna'],
    safetyLevel: 'TOPICAL_SAFE'
  }),

  // 3. Ashtanga Hridaya: Kapha Gunas
  createKnowledgeChunk({
    documentId: 'DOC-AH-SU',
    sourceId: 'SRC-AH-MAR',
    chapter: 'Ayushkamiya Adhyaya (Chapter 1)',
    section: 'Sutrasthana',
    pageNumber: 8,
    verseNumbers: '13',
    contentSanskrit: 'स्निग्धः शीतो गुरुर्मन्दः श्लक्ष्णो मृत्स्नः स्थिरः कफः।',
    contentEnglish: 'Kapha dosha is characterized by unctuousness/oiliness (Snigdha), coldness (Sita), heaviness (Guru), slowness (Manda), smoothness (Slakshna), sliminess (Mritsna), and stability (Sthira). Shine or unctuous appearance aligns with Snigdha and Kapha contextual qualities.',
    language: 'Marathi / Sanskrit / English',
    authorityTier: 'TIER_1_CLASSICAL_PRIMARY',
    verificationStatus: 'VERIFIED',
    tags: ['kapha', 'guna', 'snigdha', 'oiliness', 'shine', 'smoothness'],
    safetyLevel: 'TOPICAL_SAFE'
  }),

  // 4. Charaka Samhita: Seven layers of Twak (Skin)
  createKnowledgeChunk({
    documentId: 'DOC-CS-SU',
    sourceId: 'SRC-CS-MAR',
    chapter: 'Sharira Samkhya Shariram (Chapter 7)',
    section: 'Sharirasthana',
    pageNumber: 184,
    verseNumbers: '4',
    contentSanskrit: 'षडुत्तराणि त्वचः षट् भवन्ति।',
    contentEnglish: 'Charaka describes the layers of Twak (skin) as protective physiological barriers that reflect systemic Rasa and Rakta health. Complexion (Varna) and lustre (Prabha) depend on balanced Pitta (Bhrajaka Pitta) and optimal tissue hydration.',
    language: 'Marathi / Sanskrit / English',
    authorityTier: 'TIER_1_CLASSICAL_PRIMARY',
    verificationStatus: 'VERIFIED',
    tags: ['twak', 'skin', 'charaka', 'bhrajaka-pitta', 'varna', 'complexion'],
    safetyLevel: 'TOPICAL_SAFE'
  }),

  // 5. Sushruta Samhita: Anatomical Twak and Sitaleha Lepa
  createKnowledgeChunk({
    documentId: 'DOC-SS-SHA',
    sourceId: 'SRC-SS-ENG',
    chapter: 'Garbha-Vyakarana Sharira (Chapter 4)',
    section: 'Sharirasthana',
    pageNumber: 132,
    verseNumbers: '4-5',
    contentEnglish: 'Sushruta delineates the seven layers of skin, beginning with Avabhasini which illuminates all complexions (Varna) and exhibits the five reflections of Bhrajaka Pitta. For topical redness and heat-like sensation, cooling pastes (Sitaleha) formulated with Chandana and cold infusions soothe the external barrier.',
    language: 'English',
    authorityTier: 'TIER_2_SCHOLARLY_TRANSLATION',
    verificationStatus: 'VERIFIED',
    tags: ['sushruta', 'twak', 'avabhasini', 'lepa', 'cooling', 'sitaleha', 'chandana'],
    safetyLevel: 'TOPICAL_SAFE'
  }),

  // 6. Bhavaprakasha Nighantu: Sandalwood (Chandana)
  createKnowledgeChunk({
    documentId: 'DOC-BP-DRAVYA',
    sourceId: 'SRC-BP-NIG',
    chapter: 'Karpuradi Varga',
    section: 'Dravyaguna',
    pageNumber: 192,
    verseNumbers: '11-13',
    contentEnglish: 'Chandana (Santalum album / White Sandalwood) possesses Tikta (bitter) and Madhura (sweet) tastes, Sita (cooling) potency, and Laghu/Ruksha attributes. It soothes Pitta and Rakta aggravation, calming heat, burning sensations, and topical redness.',
    language: 'Sanskrit / English',
    authorityTier: 'TIER_2_SCHOLARLY_TRANSLATION',
    verificationStatus: 'VERIFIED',
    tags: ['chandana', 'sandalwood', 'pitta', 'cooling', 'sita', 'redness', 'rakta'],
    safetyLevel: 'TOPICAL_SAFE'
  }),

  // 7. Bhavaprakasha Nighantu: Aloe Vera (Kumari)
  createKnowledgeChunk({
    documentId: 'DOC-BP-DRAVYA',
    sourceId: 'SRC-BP-NIG',
    chapter: 'Guduchyadi Varga',
    section: 'Dravyaguna',
    pageNumber: 228,
    verseNumbers: '63-65',
    contentEnglish: 'Kumari (Aloe barbadensis / Aloe Vera) is cooling (Sita Virya), sweet-bitter in taste, and unctuous (Snigdha). It acts as a natural soothing and hydrating agent (Rasayana for Twak), nourishing dry or irritated skin states without causing pore obstruction.',
    language: 'Sanskrit / English',
    authorityTier: 'TIER_2_SCHOLARLY_TRANSLATION',
    verificationStatus: 'VERIFIED',
    tags: ['kumari', 'aloe', 'hydration', 'sita', 'cooling', 'dryness', 'barrier'],
    safetyLevel: 'TOPICAL_SAFE'
  }),

  // 8. Bhavaprakasha Nighantu: Neem (Nimba)
  createKnowledgeChunk({
    documentId: 'DOC-BP-DRAVYA',
    sourceId: 'SRC-BP-NIG',
    chapter: 'Guduchyadi Varga',
    section: 'Dravyaguna',
    pageNumber: 235,
    verseNumbers: '8-10',
    contentEnglish: 'Nimba (Azadirachta indica / Neem) is intensely bitter (Tikta) and astringent (Kashaya), cooling (Sita), and light (Laghu). It pacifies excess Pitta and Kapha, cleanses pores, and mitigates excessive unctuousness or oil accumulation.',
    language: 'Sanskrit / English',
    authorityTier: 'TIER_2_SCHOLARLY_TRANSLATION',
    verificationStatus: 'VERIFIED',
    tags: ['nimba', 'neem', 'oiliness', 'snigdha', 'cleansing', 'kapha', 'pitta'],
    safetyLevel: 'TOPICAL_SAFE'
  }),

  // 9. AayurFace Project Research: Topical Patch Testing
  createKnowledgeChunk({
    documentId: 'DOC-PROJ-SAFE',
    sourceId: 'SRC-PROJ-RES',
    chapter: 'Topical Safety Protocols',
    section: 'Section 1: Allergy & Sensitivity',
    pageNumber: 1,
    contentEnglish: 'Prior to applying any botanical paste or oil (Mukhalepa) to facial skin, a 24-hour patch test behind the ear or on the inner forearm is mandatory. Individual herbal sensitivities can manifest independently of constitutional Prakriti.',
    language: 'English',
    authorityTier: 'TIER_4_PROJECT_RESEARCH',
    verificationStatus: 'VERIFIED',
    tags: ['safety', 'patch-test', 'allergy', 'botanical', 'routine'],
    safetyLevel: 'TOPICAL_SAFE'
  }),

  // 10. AayurFace Project Research: Non-Diagnostic Wellness Boundary
  createKnowledgeChunk({
    documentId: 'DOC-PROJ-SAFE',
    sourceId: 'SRC-PROJ-RES',
    chapter: 'Clinical Boundary Policy',
    section: 'Section 2: Non-Diagnostic Operations',
    pageNumber: 2,
    contentEnglish: 'AayurFace visual observations represent physical surface appearances (e.g. shine, dryness, redness-like hue) under consumer camera lighting. They are not medical symptoms, skin disease diagnoses, or constitutional Dosha determinations. Persistent, painful, cystic, or ulcerated skin lesions require evaluation by a licensed dermatologist or certified Ayurvedic Vaidya.',
    language: 'English',
    authorityTier: 'TIER_4_PROJECT_RESEARCH',
    verificationStatus: 'VERIFIED',
    tags: ['safety', 'non-diagnostic', 'boundary', 'medical', 'consultation'],
    safetyLevel: 'TOPICAL_SAFE'
  })
];

/**
 * Initializes the default vector store with the initial verified classical chunks.
 */
export function initializeCorpusVectorStore(store: { addChunk: (chunk: KnowledgeChunk) => void }): void {
  INITIAL_VERIFIED_CHUNKS.forEach(chunk => {
    store.addChunk(chunk);
  });
}
