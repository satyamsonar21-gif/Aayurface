// ============================================================
// AayurFace — Phase 14: Personalization & Recommendation Intelligence
// Verified Ingredient Knowledge Catalog
// All provenance references are from authentic classical texts.
// No ingredient is ever recommended without a patch-test warning.
// ============================================================

import type { RecommendedIngredient } from '@/types/personalization';

// ------------------------------------------------------------
// 1. VERIFIED INGREDIENT CATALOG
// Each entry carries full traceability to classical sources.
// ------------------------------------------------------------

export const VERIFIED_INGREDIENT_CATALOG: Record<string, RecommendedIngredient> = {
  // --------------------------------------------------------
  // Chandana — Sandalwood
  // --------------------------------------------------------
  'chandana': {
    id: 'chandana',
    name: 'Sandalwood',
    sanskritName: 'Chandana',
    category: 'HERB',
    safetyLevel: 'TOPICAL_SAFE',
    patchTestRequired: true,
    provenanceType: 'CLASSICAL_SOURCE',
    sourceReference: 'Bhavaprakasha Nighantu, Karpuradi Varga',
    knownAllergens: ['Sandalwood sensitivity'],
    contraindications: [],
  },

  // --------------------------------------------------------
  // Kumari — Aloe Vera
  // --------------------------------------------------------
  'kumari': {
    id: 'kumari',
    name: 'Aloe Vera',
    sanskritName: 'Kumari',
    category: 'HERB',
    safetyLevel: 'TOPICAL_SAFE',
    patchTestRequired: true,
    provenanceType: 'CLASSICAL_SOURCE',
    sourceReference: 'Bhavaprakasha Nighantu, Guduchyadi Varga',
    knownAllergens: ['Aloe latex sensitivity'],
    contraindications: ['Open wounds'],
  },

  // --------------------------------------------------------
  // Nimba — Neem
  // --------------------------------------------------------
  'nimba': {
    id: 'nimba',
    name: 'Neem',
    sanskritName: 'Nimba',
    category: 'HERB',
    safetyLevel: 'TOPICAL_SAFE',
    patchTestRequired: true,
    provenanceType: 'CLASSICAL_SOURCE',
    sourceReference: 'Bhavaprakasha Nighantu, Guduchyadi Varga',
    knownAllergens: [],
    contraindications: [],
  },

  // --------------------------------------------------------
  // Haridra — Turmeric
  // --------------------------------------------------------
  'haridra': {
    id: 'haridra',
    name: 'Turmeric',
    sanskritName: 'Haridra',
    category: 'HERB',
    safetyLevel: 'PATCH_TEST_MANDATORY',
    patchTestRequired: true,
    provenanceType: 'CLASSICAL_SOURCE',
    sourceReference: 'Charaka Samhita, Sutrasthana',
    knownAllergens: ['Curcumin sensitivity'],
    contraindications: ['May stain fair skin temporarily'],
  },

  // --------------------------------------------------------
  // Gulab Jal — Rose Water
  // --------------------------------------------------------
  'gulab-jal': {
    id: 'gulab-jal',
    name: 'Rose Water',
    sanskritName: 'Gulab Jal',
    category: 'PREPARATION',
    safetyLevel: 'TOPICAL_SAFE',
    patchTestRequired: true,
    provenanceType: 'PROJECT_RESEARCH',
    sourceReference: 'AayurFace Topical Safety Guidelines',
    knownAllergens: ['Rose sensitivity'],
    contraindications: [],
  },

  // --------------------------------------------------------
  // Tila Taila — Sesame Oil
  // --------------------------------------------------------
  'tila-taila': {
    id: 'tila-taila',
    name: 'Sesame Oil',
    sanskritName: 'Tila Taila',
    category: 'OIL',
    safetyLevel: 'TOPICAL_SAFE',
    patchTestRequired: true,
    provenanceType: 'CLASSICAL_SOURCE',
    sourceReference: 'Charaka Samhita, Sutrasthana Ch.5',
    knownAllergens: ['Sesame allergy'],
    contraindications: ['Nut/seed allergy history'],
  },

  // --------------------------------------------------------
  // Madhu — Raw Honey
  // --------------------------------------------------------
  'madhu': {
    id: 'madhu',
    name: 'Raw Honey',
    sanskritName: 'Madhu',
    category: 'FOOD',
    safetyLevel: 'TOPICAL_SAFE',
    patchTestRequired: true,
    provenanceType: 'CLASSICAL_SOURCE',
    sourceReference: 'Ashtanga Hridaya, Sutrasthana',
    knownAllergens: ['Bee product sensitivity'],
    contraindications: [],
  },
} as const satisfies Record<string, RecommendedIngredient>;

// ------------------------------------------------------------
// 2. DOSHA → INGREDIENT MAPPING
// Maps each dosha to ingredient IDs suited to its qualities.
// Dosha is ALWAYS user-reported — never inferred from face.
// ------------------------------------------------------------

const DOSHA_INGREDIENT_MAP: Record<string, readonly string[]> = {
  /** Vata: nourishing, grounding, moisturising ingredients */
  vata: ['tila-taila', 'kumari', 'madhu'],
  /** Pitta: cooling, soothing, anti-inflammatory ingredients */
  pitta: ['chandana', 'gulab-jal', 'kumari'],
  /** Kapha: clarifying, warming, stimulating ingredients */
  kapha: ['nimba', 'haridra'],
} as const;

/** Gentle baseline for unknown / unreported dosha */
const DEFAULT_DOSHA_INGREDIENTS: readonly string[] = ['gulab-jal', 'kumari'] as const;

// ------------------------------------------------------------
// 3. PUBLIC LOOKUP FUNCTIONS
// Pure functions — no side effects, no network, no LLM.
// ------------------------------------------------------------

/**
 * Retrieve a single ingredient by its canonical ID.
 * Returns `null` when the ID is not in the verified catalog.
 */
export function getIngredient(id: string): RecommendedIngredient | null {
  return VERIFIED_INGREDIENT_CATALOG[id] ?? null;
}

/**
 * Retrieve the set of ingredients suited to a given dosha.
 *
 * - Normalises the dosha string to lowercase before lookup.
 * - Falls back to a gentle baseline set when the dosha is
 *   unrecognised, empty, or null-ish.
 * - Silently skips any ingredient ID that is missing from the
 *   catalog (defensive against catalog drift).
 */
export function getIngredientsForDosha(dosha: string): RecommendedIngredient[] {
  const normalised = dosha?.trim().toLowerCase() ?? '';
  const ingredientIds = DOSHA_INGREDIENT_MAP[normalised] ?? DEFAULT_DOSHA_INGREDIENTS;

  const results: RecommendedIngredient[] = [];
  for (const id of ingredientIds) {
    const ingredient = VERIFIED_INGREDIENT_CATALOG[id];
    if (ingredient != null) {
      results.push(ingredient);
    }
  }
  return results;
}
