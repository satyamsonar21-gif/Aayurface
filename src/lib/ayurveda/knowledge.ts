import type { KnowledgeItem } from './types';

export const CURRENT_KNOWLEDGE_VERSION = 'ayur-k-v1.0.0';

/**
 * Verified knowledge base using Project Research and standard Ayurvedic literature.
 * No fabricated claims. All associations are contextual.
 */
export const AYURVEDIC_KNOWLEDGE_BASE: Record<string, KnowledgeItem> = {
  'concept-pita-heat': {
    id: 'concept-pita-heat',
    conceptType: 'DOSHA',
    content: 'Pitta dosha is conceptually associated with Ushna (heat) and Rakta (blood/redness). Visual redness-like appearance may be considered alongside other context in an Ayurvedic interpretation.',
    source: 'Ashtanga Hridayam, Sutrasthana',
    sourceReference: {
      text: 'Pitta is slightly unctuous, penetrating, hot, light, foul-smelling, free-flowing and liquid.',
      author: 'Vagbhata',
    },
    provenanceType: 'CLASSICAL_SOURCE',
    evidenceStatus: 'SUPPORTED',
    version: CURRENT_KNOWLEDGE_VERSION,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  'concept-vata-dryness': {
    id: 'concept-vata-dryness',
    conceptType: 'DOSHA',
    content: 'Vata dosha is conceptually associated with Ruksha (dryness) and Khara (roughness). Visual dryness-like appearance is a signal but insufficient alone to determine Vata imbalance.',
    source: 'Ashtanga Hridayam, Sutrasthana',
    sourceReference: {
      text: 'Vata is dry, light, cold, rough, subtle and mobile.',
      author: 'Vagbhata',
    },
    provenanceType: 'CLASSICAL_SOURCE',
    evidenceStatus: 'SUPPORTED',
    version: CURRENT_KNOWLEDGE_VERSION,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  'concept-kapha-oiliness': {
    id: 'concept-kapha-oiliness',
    conceptType: 'DOSHA',
    content: 'Kapha dosha is associated with Snigdha (unctuousness/oiliness) and Manda (slowness). Shine or oiliness is a signal but does not guarantee a Kapha diagnosis.',
    source: 'Ashtanga Hridayam, Sutrasthana',
    sourceReference: {
      text: 'Kapha is unctuous, cool, heavy, slow, smooth, slimy and stable.',
      author: 'Vagbhata',
    },
    provenanceType: 'CLASSICAL_SOURCE',
    evidenceStatus: 'SUPPORTED',
    version: CURRENT_KNOWLEDGE_VERSION,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  'ingredient-sandalwood': {
    id: 'ingredient-sandalwood',
    conceptType: 'DRAVYA',
    content: 'Sandalwood (Chandana) is traditionally used for its cooling (Sita) properties. It is often applied to soothe heat-related or redness-like skin states.',
    source: 'Project Research - Ingredient Knowledge',
    provenanceType: 'PROJECT_RESEARCH',
    evidenceStatus: 'SUPPORTED',
    version: CURRENT_KNOWLEDGE_VERSION,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  'ingredient-aloe': {
    id: 'ingredient-aloe',
    conceptType: 'DRAVYA',
    content: 'Aloe Vera (Kumari) acts as a soothing, cooling agent, hydrating the skin without excess oiliness.',
    source: 'Project Research - Ingredient Knowledge',
    provenanceType: 'PROJECT_RESEARCH',
    evidenceStatus: 'SUPPORTED',
    version: CURRENT_KNOWLEDGE_VERSION,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};

export function getKnowledgeItem(id: string): KnowledgeItem | null {
  return AYURVEDIC_KNOWLEDGE_BASE[id] || null;
}
