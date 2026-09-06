// ============================================================
// AayurFace — Assessment Domain Store
// Client-side user-scoped assessment lifecycle management
// Transitional architecture prior to backend RLS integration
// ============================================================

import type { Assessment, ScanCause, ScanRemedy, PreventionTip } from '@/types';

const STORAGE_PREFIX = 'aayurface_assessments_';

function getStorageKey(userId: string): string {
  return `${STORAGE_PREFIX}${userId}`;
}

// Generate cryptographically random unique identifier
export function generateAssessmentId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `scan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Baseline reference data (Prototype / Non-AI Guidance)
const BASELINE_CAUSES: ScanCause[] = [
  { icon: '🌿', text: 'Natural barrier variations observed across environmental and seasonal shifts.' },
  { icon: '💧', text: 'Daily hydration balance and moisture retention in the epidermal layers.' },
  { icon: '☀️', text: 'Ambient environmental exposure, temperature transitions, and sun interaction.' },
  { icon: '🧘', text: 'Daily stress, rest rhythm, and natural circadian repair cycles.' },
];

const BASELINE_REMEDIES: ScanRemedy[] = [
  {
    name: 'Gentle Rose Water & Aloe Refresh',
    ingredient: 'Rose Water & Aloe Vera',
    what_to_use: 'Pure distilled rose water mist followed by fresh soothing aloe vera gel',
    how_to_apply: [
      'Cleanse face gently with lukewarm water.',
      'Mist pure rose water across forehead, cheeks, and neck.',
      'Smooth a thin veil of aloe vera gel over clean skin.',
      'Allow natural absorption without heavy friction.',
    ],
    how_often: 'Morning & evening daily',
  },
  {
    name: 'Purifying Herbal Lepa',
    ingredient: 'Turmeric & Sandalwood',
    what_to_use: 'Equal parts wild turmeric and pure sandalwood powder mixed with raw honey',
    how_to_apply: [
      'Blend herbal powders with organic honey into a smooth soothing paste.',
      'Apply an even layer over facial contours, avoiding sensitive eye areas.',
      'Rest quietly for 10–15 minutes until dry.',
      'Rinse with cool water in gentle circular motions.',
    ],
    how_often: '2 times per week',
  },
];

const BASELINE_PREVENTION_TIPS: PreventionTip[] = [
  { icon: '💧', text: 'Maintain consistent daily internal hydration with warm or room-temperature water.' },
  { icon: '🌙', text: 'Honor restful evening dinacharya rituals to support nightly cellular rejuvenation.' },
  { icon: '🥗', text: 'Incorporate fresh, seasonal whole foods to support calm internal digestive fire (Agni).' },
  { icon: '🛡️', text: 'Conduct a patch test behind the ear before applying any new topical formulation.' },
];

/**
 * Creates, persists, and returns a new authentic assessment for the authenticated user.
 */
export function createAssessment(
  userId: string,
  capturedImage: string,
  userProfile?: { dosha?: string | null; skin_type?: string | null }
): Assessment {
  if (!userId) {
    throw new Error('Cannot create assessment without an authenticated user ID.');
  }
  if (!capturedImage) {
    throw new Error('Cannot create assessment without a captured image.');
  }

  const primaryDosha = userProfile?.dosha
    ? userProfile.dosha.charAt(0).toUpperCase() + userProfile.dosha.slice(1)
    : 'Vata-Pitta';

  const skinTypeLabel = userProfile?.skin_type
    ? userProfile.skin_type.charAt(0).toUpperCase() + userProfile.skin_type.slice(1)
    : 'Combination';

  const newAssessment: Assessment = {
    id: generateAssessmentId(),
    userId,
    capturedImage,
    createdAt: new Date().toISOString(),
    isDemo: false,
    summary: `${skinTypeLabel} Skin Wellness Observation`,
    skinTypes: [skinTypeLabel, 'Baseline Record'],
    doshaTendency: {
      primary: primaryDosha,
      description: `${primaryDosha} baseline balance recorded during observation.`,
    },
    causes: BASELINE_CAUSES,
    remedies: BASELINE_REMEDIES,
    preventionTips: BASELINE_PREVENTION_TIPS,
  };

  saveAssessment(userId, newAssessment);
  return newAssessment;
}

/**
 * Saves an assessment to the user's isolated local store.
 */
export function saveAssessment(userId: string, assessment: Assessment): void {
  if (!userId) return;
  const key = getStorageKey(userId);
  const existing = getUserAssessments(userId);
  const updated = [assessment, ...existing.filter((a) => a.id !== assessment.id)];
  try {
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (err) {
    console.error('[AssessmentStore] Failed to save assessment to localStorage:', err);
  }
}

/**
 * Retrieves an assessment by ID strictly scoped to the authenticated user.
 * Returns null if the assessment does not exist or belongs to another user.
 */
export function getAssessmentById(userId: string, assessmentId: string): Assessment | null {
  if (!userId || !assessmentId) return null;

  // If explicitly requesting the sample/demo scan, return the isolated sample record
  if (assessmentId === 'demo-scan') {
    return getDemoAssessment();
  }

  const userAssessments = getUserAssessments(userId);
  const match = userAssessments.find((a) => a.id === assessmentId);
  return match || null;
}

/**
 * Retrieves all assessments owned by the specified user, sorted newest first.
 */
export function getUserAssessments(userId: string): Assessment[] {
  if (!userId) return [];
  const key = getStorageKey(userId);
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    const list: Assessment[] = JSON.parse(raw);
    return Array.isArray(list) ? list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];
  } catch {
    return [];
  }
}

/**
 * Isolated sample reference assessment for /results/demo-scan.
 * Explicitly demarcated as a demo reference.
 */
export function getDemoAssessment(): Assessment {
  return {
    id: 'demo-scan',
    userId: 'sample-system',
    capturedImage: '/images/1.jpg',
    createdAt: '2026-02-28T10:00:00.000Z',
    isDemo: true,
    summary: 'Sample Skin Wellness Insight (Demonstration Reference)',
    skinTypes: ['Oily', 'Acne-Prone'],
    doshaTendency: {
      primary: 'Pitta (Fire)',
      description: 'Primary Pitta warmth with subtle dryness in peripheral zones.',
    },
    causes: [
      { icon: '🍔', text: 'Dietary patterns with excess heat, spice, or oily preparations can elevate Pitta.' },
      { icon: '😴', text: 'Irregular sleep or late evenings disrupt the body\'s natural nocturnal repair cycle.' },
      { icon: '😰', text: 'Elevated stress levels trigger heightened sebum production and topical sensitivity.' },
      { icon: '🌤️', text: 'Humidity and environmental pollutants can challenge skin breathability.' },
      { icon: '💧', text: 'Inadequate daily hydration can prompt the skin barrier to overcompensate.' },
    ],
    remedies: [
      {
        name: 'Neem & Aloe Clarifying Wash',
        ingredient: 'Neem & Aloe Vera',
        what_to_use: 'Fresh cooling neem decoction or gentle organic botanical cleanser',
        how_to_apply: [
          'Warm face with lukewarm water.',
          'Gently massage cleanser across T-zone and cheeks.',
          'Rinse with cool water and gently pat dry.',
        ],
        how_often: 'Daily morning & evening',
      },
      {
        name: 'Turmeric & Raw Honey Spot Mask',
        ingredient: 'Kasturi Turmeric & Honey',
        what_to_use: 'A pinch of organic kasturi turmeric stirred into raw mountain honey',
        how_to_apply: [
          'Dab onto areas of warmth or active breakout.',
          'Rest comfortably for 15 minutes.',
          'Rinse gently with tepid water.',
        ],
        how_often: '2–3 times weekly',
      },
    ],
    preventionTips: [
      { icon: '💧', text: 'Drink at least 8 glasses of pure room-temperature water daily.' },
      { icon: '🌙', text: 'Aim to sleep before 10 PM during natural Pitta repair hours.' },
      { icon: '🥗', text: 'Prioritize cooling, fresh foods like cucumber, mint, and cilantro.' },
      { icon: '☀️', text: 'Protect the facial barrier against harsh solar exposure.' },
    ],
  };
}
