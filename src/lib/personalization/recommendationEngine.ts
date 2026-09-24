// ============================================================
// AayurFace — Phase 14: Personalization & Recommendation Intelligence
// Core Deterministic Recommendation Rule Engine
// Strict Non-Diagnostic, Evidence-Grounded, Deterministic Architecture
// ============================================================

import type {
  RecommendationItem,
  RecommendationDecisionTrace,
  RecommendationCategory,
  RecommendationPriority,
  RecommendedFormulation,
  UserPreferences,
  RecommendationRationale,
} from '@/types/personalization';
import type { FusionResult, Modality } from '@/types/fusion';
import type { AyurvedicInterpretationSet } from '@/lib/ayurveda/types';
import type { RAGResponse } from '@/types/rag';

import {
  CURRENT_PERSONALIZATION_RULE_VERSION,
  PERSONALIZATION_SAFETY_LIMITS,
  CONFIDENCE_CEILING_MAP,
} from './constants';
import { getIngredient } from './ingredientKnowledge';

// ------------------------------------------------------------
// 1. ENGINE INPUT / OUTPUT CONTRACTS
// ------------------------------------------------------------

export interface RecommendationEngineInput {
  fusionResult: FusionResult;
  ayurvedicSet?: AyurvedicInterpretationSet | null;
  ragResponse?: RAGResponse | null;
  userDosha?: string | null;
  userSkinType?: string | null;
  userPreferences: UserPreferences;
}

export interface RecommendationEngineOutput {
  recommendations: RecommendationItem[];
  decisionTraces: RecommendationDecisionTrace[];
  rulesEvaluated: number;
  rulesFired: number;
  rulesSkipped: number;
  rulesExcluded: number;
  ceilingsApplied: string[];
}

// ------------------------------------------------------------
// 2. INTERNAL RULE DEFINITION CONTRACT
// ------------------------------------------------------------

interface InternalRecommendationRule {
  ruleId: string;
  ruleName: string;
  category: RecommendationCategory;
  priority: RecommendationPriority;
  condition: (input: RecommendationEngineInput) => boolean;
  action: (
    input: RecommendationEngineInput,
    ruleId: string,
  ) => {
    item: RecommendationItem;
    ceilingApplied?: string;
  };
}

// ------------------------------------------------------------
// 3. RULE IMPLEMENTATIONS
// ------------------------------------------------------------

/**
 * Priority rank comparator for sorting recommendations:
 * PRIMARY (0) > SECONDARY (1) > SUPPLEMENTARY (2)
 */
const PRIORITY_ORDER: Record<RecommendationPriority, number> = {
  PRIMARY: 0,
  SECONDARY: 1,
  SUPPLEMENTARY: 2,
};

// ------------------------------------------------------------
// RULE 001: Dosha-Aligned Topical Botanical
// ------------------------------------------------------------
const rule001: InternalRecommendationRule = {
  ruleId: 'P14-RULE-001',
  ruleName: 'Dosha-Aligned Topical Botanical',
  category: 'TOPICAL_BOTANICAL',
  priority: 'PRIMARY',
  condition: (input) => {
    const dosha = input.userDosha?.trim().toLowerCase();
    const hasValidDosha = dosha === 'vata' || dosha === 'pitta' || dosha === 'kapha';
    const evidenceStrength = input.fusionResult.evidenceStrength;
    const isEligibleStrength =
      evidenceStrength === 'LOW' ||
      evidenceStrength === 'MODERATE' ||
      evidenceStrength === 'HIGH';
    return hasValidDosha && isEligibleStrength;
  },
  action: (input, ruleId) => {
    const dosha = input.userDosha!.trim().toLowerCase();
    const evidenceStrength = input.fusionResult.evidenceStrength;
    const ceilingConfidence = CONFIDENCE_CEILING_MAP[evidenceStrength] ?? 'LOW_CONFIDENCE';

    // Supporting fusion evidence IDs
    const supportingIds = input.fusionResult.supportingEvidence.map((e) => e.id);
    const contributingModalities: Modality[] = ['USER_CONTEXT'];
    if (input.fusionResult.supportingEvidence.some((e) => e.modality === 'VISUAL')) {
      contributingModalities.push('VISUAL');
    }
    if (input.fusionResult.supportingEvidence.some((e) => e.modality === 'AYURVEDIC_CONTEXT')) {
      contributingModalities.push('AYURVEDIC_CONTEXT');
    }

    let formulation: RecommendedFormulation;
    let title: string;
    let sanskritName: string;
    let description: string;
    let guidanceText: string;
    let ayurvedicPrinciple: string;

    if (dosha === 'pitta') {
      title = 'Cooling Sandalwood & Rose Water Soothing Paste';
      sanskritName = 'Chandana Gulab Lepa';
      description =
        'A traditional cooling botanical application to soothe heat-related skin sensitivity and redness-like appearances.';
      guidanceText =
        'Blend pure sandalwood powder with distilled rose water into a smooth paste. Smooth over facial contours and rinse after 10–15 minutes.';
      ayurvedicPrinciple = 'Sita (cooling) virya pacifies Pitta Ushna (heat) and Rakta irritation.';

      const chandana = getIngredient('chandana')!;
      const gulab = getIngredient('gulab-jal')!;
      const kumari = getIngredient('kumari')!;

      formulation = {
        id: `form-pitta-${Date.now()}`,
        name: 'Chandana & Kumari Shita Lepa',
        ingredients: [chandana, gulab, kumari],
        preparationSteps: [
          'Take 1 teaspoon of pure Chandana (Sandalwood) powder.',
          'Add 1–2 teaspoons of distilled Gulab Jal (Rose Water) to form a smooth paste.',
          'Stir in 1/2 teaspoon of fresh Kumari (Aloe Vera) gel until homogenous.',
        ],
        applicationSteps: [
          'Cleanse face with cool or lukewarm water.',
          'Apply an even layer over facial contours, avoiding immediate eye contours.',
          'Allow paste to rest for 10–15 minutes until semi-dry.',
          'Rinse gently with cool water in circular motions.',
        ],
        frequency: '2 to 3 times per week',
        durationGuidance: 'Apply for 10–15 minutes; do not allow to fully crack on skin.',
        safetyWarnings: [
          'Perform a 24-hour patch test behind the ear prior to initial use.',
          'Discontinue immediately if erythema, burning, or itching occurs.',
        ],
        patchTestRequired: true,
      };
    } else if (dosha === 'vata') {
      title = 'Nourishing Sesame Oil & Aloe Barrier Infusion';
      sanskritName = 'Tila Kumari Sneha';
      description =
        'A grounding lipid application designed to replenish moisture and reinforce epidermal barrier comfort against dryness.';
      guidanceText =
        'Gently warm 3–4 drops of cold-pressed sesame oil, blend with pure aloe vera, and press into clean skin before evening rest.';
      ayurvedicPrinciple = 'Snigdha (unctuous) and Guru (heavy) qualities pacify Vata Ruksha (dryness) and Khara (roughness).';

      const tila = getIngredient('tila-taila')!;
      const kumari = getIngredient('kumari')!;
      const madhu = getIngredient('madhu')!;

      formulation = {
        id: `form-vata-${Date.now()}`,
        name: 'Tila & Kumari Rasayana Lepa',
        ingredients: [tila, kumari, madhu],
        preparationSteps: [
          'Gently warm 1/2 teaspoon of organic cold-pressed Tila Taila (Sesame Oil).',
          'Whisk with 1 teaspoon of pure Kumari (Aloe Vera) gel.',
          'Add 1/4 teaspoon of raw organic Madhu (Honey).',
        ],
        applicationSteps: [
          'Cleanse face gently with warm water.',
          'Press the warm blend into temples, cheeks, and neck with gentle upward strokes.',
          'Leave on as an evening treatment or rinse after 20 minutes if preferred.',
        ],
        frequency: 'Daily or 3–4 times per week in evening',
        durationGuidance: 'Leave overnight or rinse after 20 minutes with lukewarm water.',
        safetyWarnings: [
          'Perform a 24-hour patch test behind the ear prior to use.',
          'Do not apply over actively weeping or broken skin.',
        ],
        patchTestRequired: true,
      };
    } else {
      // Kapha
      title = 'Clarifying Neem & Turmeric Purifying Wash';
      sanskritName = 'Nimba Haridra Prakshalana';
      description =
        'A clarifying botanical cleanser formulated to balance excess sebum and clear epidermal surface stagnation.';
      guidanceText =
        'Infuse dried neem leaves in warm water, add a pinch of wild turmeric, and cleanse the facial surface in circular motions.';
      ayurvedicPrinciple = 'Tikta (bitter) and Kashaya (astringent) rasas balance Kapha Snigdha (unctuousness) and Kleda (moisture).';

      const nimba = getIngredient('nimba')!;
      const haridra = getIngredient('haridra')!;

      formulation = {
        id: `form-kapha-${Date.now()}`,
        name: 'Nimba & Haridra Shodhana Lepa',
        ingredients: [nimba, haridra],
        preparationSteps: [
          'Mix 1 teaspoon of Nimba (Neem) leaf powder with a pinch of pure Haridra (Turmeric).',
          'Add warm distilled water or rose water to create a spreadable paste.',
        ],
        applicationSteps: [
          'Apply evenly across T-zone and congested facial contours.',
          'Gently massage for 60 seconds, then allow to sit for 8–10 minutes.',
          'Rinse thoroughly with lukewarm water.',
        ],
        frequency: '2 to 3 times per week',
        durationGuidance: '8–10 minutes; rinse before paste becomes completely dry.',
        safetyWarnings: [
          'Perform a 24-hour patch test behind the ear prior to use.',
          'Turmeric may temporarily leave a slight warm tint on light skin tones.',
        ],
        patchTestRequired: true,
      };
    }

    const rationale: RecommendationRationale = {
      supportingEvidenceIds: supportingIds,
      citationIds: [],
      contributingModalities,
      explanation: `Selected based on user-reported ${dosha.toUpperCase()} constitution and upstream evidence strength of ${evidenceStrength}.`,
      ayurvedicPrinciple,
    };

    const item: RecommendationItem = {
      id: `p14-rec-${ruleId}-${Date.now()}`,
      category: 'TOPICAL_BOTANICAL',
      priority: 'PRIMARY',
      confidence: ceilingConfidence,
      title,
      description,
      guidanceText,
      sanskritName,
      rationale,
      formulation,
      safety: {
        patchTestRequired: true,
        contraindications: formulation.safetyWarnings,
        warnings: [
          PERSONALIZATION_SAFETY_LIMITS.STANDARD_DISCLAIMER,
          'Always conduct a 24-hour patch test before full facial application.',
        ],
        pregnancyCaution: false,
        professionalConsultationRecommended: false,
      },
      ruleId,
      ruleVersion: CURRENT_PERSONALIZATION_RULE_VERSION,
    };

    return {
      item,
      ceilingApplied: `Capped at ${ceilingConfidence} by fusion evidence strength ${evidenceStrength}`,
    };
  },
};

// ------------------------------------------------------------
// RULE 002: Universal Mandatory Patch Test Safety Notice
// ------------------------------------------------------------
const rule002: InternalRecommendationRule = {
  ruleId: 'P14-RULE-002',
  ruleName: 'Universal Patch Test Mandatory Safety Notice',
  category: 'TOPICAL_BOTANICAL',
  priority: 'SUPPLEMENTARY',
  condition: () => true, // ALWAYS FIRES
  action: (_input, ruleId) => {
    const rationale: RecommendationRationale = {
      supportingEvidenceIds: [],
      citationIds: [],
      contributingModalities: ['STATIC_KNOWLEDGE' as any],
      explanation:
        'Universal safety prerequisite for all topical botanical applications, grounded in AayurFace Topical Safety Protocols.',
      ayurvedicPrinciple: 'Ahara-Vihara safety and individual Dravya sensitivity management.',
    };

    const item: RecommendationItem = {
      id: `p14-rec-${ruleId}-${Date.now()}`,
      category: 'TOPICAL_BOTANICAL',
      priority: 'SUPPLEMENTARY',
      confidence: 'HIGH_CONFIDENCE', // Safety notices are always high confidence
      title: 'Mandatory 24-Hour Botanical Patch Test Protocol',
      description:
        'A mandatory preliminary safety protocol before introducing any new topical herbal formulation or facial Lepa.',
      guidanceText:
        'Apply a small dab of the prepared herbal formulation behind the earlobe or on the inner forearm. Observe for 24 hours. If any redness, swelling, burning, or itchiness develops, do not apply to the face.',
      sanskritName: 'Twak Pariksha Vidhi',
      rationale,
      safety: {
        patchTestRequired: false,
        contraindications: [],
        warnings: [
          'Individual botanical sensitivities can occur independently of constitutional Dosha.',
          PERSONALIZATION_SAFETY_LIMITS.STANDARD_DISCLAIMER,
        ],
        pregnancyCaution: false,
        professionalConsultationRecommended: false,
      },
      ruleId,
      ruleVersion: CURRENT_PERSONALIZATION_RULE_VERSION,
    };

    return { item };
  },
};

// ------------------------------------------------------------
// RULE 003: Constitutional Hydration Guidance
// ------------------------------------------------------------
const rule003: InternalRecommendationRule = {
  ruleId: 'P14-RULE-003',
  ruleName: 'Constitutional Hydration Guidance',
  category: 'HYDRATION_GUIDANCE',
  priority: 'SECONDARY',
  condition: (input) => {
    const hasHydration =
      Boolean(input.userPreferences.lifestyleFactors?.hydrationLevel) ||
      Boolean(input.userDosha);
    return hasHydration;
  },
  action: (input, ruleId) => {
    const dosha = input.userDosha?.trim().toLowerCase();
    const evidenceStrength = input.fusionResult.evidenceStrength;
    const ceilingConfidence = CONFIDENCE_CEILING_MAP[evidenceStrength] ?? 'LOW_CONFIDENCE';

    let title: string;
    let guidanceText: string;
    let ayurvedicPrinciple: string;

    if (dosha === 'pitta') {
      title = 'Cooling Herb-Infused Hydration Protocol';
      guidanceText =
        'Drink pure room-temperature water infused with cooling herbs like fresh mint leaves, cucumber slices, or vetiver root. Avoid ice-cold beverages, which dampen digestive Agni.';
      ayurvedicPrinciple = 'Sita and Madhura hydration pacifies Bhrajaka Pitta and supports internal thermal equilibrium.';
    } else if (dosha === 'vata') {
      title = 'Warm Lipid-Supporting Hydration Ritual';
      guidanceText =
        'Sip warm or hot water consistently throughout the day. Consider warm cumin-coriander-fennel (CCF) tea to encourage internal moisture retention and smooth peristalsis.';
      ayurvedicPrinciple = 'Ushna (warm) fluids counter Vata Sita (cold) and Ruksha (dry) qualities.';
    } else if (dosha === 'kapha') {
      title = 'Stimulating Warm Digestive Water Routine';
      guidanceText =
        'Drink warm water with a dash of fresh lemon juice or dry ginger upon waking. Moderate excessive fluid volume to avoid sluggish water retention.';
      ayurvedicPrinciple = 'Deepana and Pachana warm fluids reduce Kapha Kleda and support Agni.';
    } else {
      title = 'Foundational Daily Dinacharya Hydration';
      guidanceText =
        'Maintain a baseline intake of 1.5 to 2.5 liters of pure room-temperature water daily. Sip gradually rather than consuming large volumes at once.';
      ayurvedicPrinciple = 'Rasa Dhatu nourishment requires consistent, unchilled hydration.';
    }

    const rationale: RecommendationRationale = {
      supportingEvidenceIds: input.fusionResult.supportingEvidence.map((e) => e.id),
      citationIds: [],
      contributingModalities: ['USER_CONTEXT'],
      explanation: `Calibrated to user-reported ${dosha ? dosha.toUpperCase() : 'general'} baseline.`,
      ayurvedicPrinciple,
    };

    const item: RecommendationItem = {
      id: `p14-rec-${ruleId}-${Date.now()}`,
      category: 'HYDRATION_GUIDANCE',
      priority: 'SECONDARY',
      confidence: ceilingConfidence,
      title,
      description: 'Constitutional hydration rhythm to support skin barrier suppleness from within.',
      guidanceText,
      rationale,
      safety: {
        patchTestRequired: false,
        contraindications: [],
        warnings: [PERSONALIZATION_SAFETY_LIMITS.STANDARD_DISCLAIMER],
        pregnancyCaution: false,
        professionalConsultationRecommended: false,
      },
      ruleId,
      ruleVersion: CURRENT_PERSONALIZATION_RULE_VERSION,
    };

    return { item };
  },
};

// ------------------------------------------------------------
// RULE 004: Stress-Aware Nervous System Balancing
// ------------------------------------------------------------
const rule004: InternalRecommendationRule = {
  ruleId: 'P14-RULE-004',
  ruleName: 'Stress-Aware Nervous System Balancing',
  category: 'STRESS_MANAGEMENT',
  priority: 'SECONDARY',
  condition: (input) => {
    const stress = input.userPreferences.lifestyleFactors?.stressLevel?.toLowerCase();
    return stress === 'elevated' || stress === 'moderate';
  },
  action: (input, ruleId) => {
    const stress = input.userPreferences.lifestyleFactors?.stressLevel;
    const evidenceStrength = input.fusionResult.evidenceStrength;
    const ceilingConfidence = CONFIDENCE_CEILING_MAP[evidenceStrength] ?? 'LOW_CONFIDENCE';

    const item: RecommendationItem = {
      id: `p14-rec-${ruleId}-${Date.now()}`,
      category: 'STRESS_MANAGEMENT',
      priority: 'SECONDARY',
      confidence: ceilingConfidence,
      title: 'Nadi Shodhana Pranayama for Skin & Rest Equilibrium',
      sanskritName: 'Nadi Shodhana',
      description:
        'Gentle alternate nostril breathing to soothe sympathetic nervous activation and reduce stress-induced skin flare-ups.',
      guidanceText:
        'Practice 5–10 minutes of slow, unforced alternate nostril breathing (Nadi Shodhana) before meals or at sunset (Sandhyakal) to ground autonomic tone.',
      rationale: {
        supportingEvidenceIds: [],
        citationIds: [],
        contributingModalities: ['USER_CONTEXT'],
        explanation: `Triggered by reported stress level: "${stress}". Elevated stress impairs epidermal microcirculation and barrier lipid synthesis.`,
        ayurvedicPrinciple: 'Pranayama grounds Prana Vayu and pacifies reactive Sadhaka Pitta.',
      },
      safety: {
        patchTestRequired: false,
        contraindications: [],
        warnings: [
          'Practice gently without strain or prolonged breath holding.',
          PERSONALIZATION_SAFETY_LIMITS.STANDARD_DISCLAIMER,
        ],
        pregnancyCaution: false,
        professionalConsultationRecommended: false,
      },
      ruleId,
      ruleVersion: CURRENT_PERSONALIZATION_RULE_VERSION,
    };

    return { item };
  },
};

// ------------------------------------------------------------
// RULE 005: Circadian Sleep Optimization
// ------------------------------------------------------------
const rule005: InternalRecommendationRule = {
  ruleId: 'P14-RULE-005',
  ruleName: 'Circadian Sleep Optimization',
  category: 'SLEEP_HYGIENE',
  priority: 'SECONDARY',
  condition: (input) => {
    const sleep = input.userPreferences.lifestyleFactors?.sleepHours?.toLowerCase();
    return sleep === '<6 hrs' || sleep === 'less than 6 hours' || sleep === '<6';
  },
  action: (input, ruleId) => {
    const sleep = input.userPreferences.lifestyleFactors?.sleepHours;
    const evidenceStrength = input.fusionResult.evidenceStrength;
    const ceilingConfidence = CONFIDENCE_CEILING_MAP[evidenceStrength] ?? 'LOW_CONFIDENCE';

    const item: RecommendationItem = {
      id: `p14-rec-${ruleId}-${Date.now()}`,
      category: 'SLEEP_HYGIENE',
      priority: 'SECONDARY',
      confidence: ceilingConfidence,
      title: 'Pada Abhyanga (Sole Massage) for Nocturnal Skin Recovery',
      sanskritName: 'Pada Abhyanga',
      description:
        'Foot sole massage with warm sesame oil or ghee to promote deep restorative sleep essential for cellular skin renewal.',
      guidanceText:
        'Rub a small coin-sized amount of warm sesame oil or pure cow ghee into the soles of both feet for 3–5 minutes before retiring to bed. Wear soft cotton socks.',
      rationale: {
        supportingEvidenceIds: [],
        citationIds: [],
        contributingModalities: ['USER_CONTEXT'],
        explanation: `Triggered by reported sleep duration: "${sleep}". Sub-optimal rest disrupts nocturnal cellular mitosis and elevates cortisol.`,
        ayurvedicPrinciple: 'Nidra (sleep) is one of the three pillars (Trayopastambha) of biological balance and Twak health.',
      },
      safety: {
        patchTestRequired: false,
        contraindications: [],
        warnings: [
          'Take care when walking on smooth floors after applying oil to feet.',
          PERSONALIZATION_SAFETY_LIMITS.STANDARD_DISCLAIMER,
        ],
        pregnancyCaution: false,
        professionalConsultationRecommended: false,
      },
      ruleId,
      ruleVersion: CURRENT_PERSONALIZATION_RULE_VERSION,
    };

    return { item };
  },
};

// ------------------------------------------------------------
// RULE 006: Seasonal Climatic Adjustment
// ------------------------------------------------------------
const rule006: InternalRecommendationRule = {
  ruleId: 'P14-RULE-006',
  ruleName: 'Seasonal Climatic Adjustment',
  category: 'SEASONAL_ADJUSTMENT',
  priority: 'SUPPLEMENTARY',
  condition: (input) => {
    const climate = input.userPreferences.lifestyleFactors?.climate;
    return Boolean(climate && climate.trim().length > 0);
  },
  action: (input, ruleId) => {
    const climate = input.userPreferences.lifestyleFactors?.climate?.trim() || '';
    const climateLower = climate.toLowerCase();
    const evidenceStrength = input.fusionResult.evidenceStrength;
    const ceilingConfidence = CONFIDENCE_CEILING_MAP[evidenceStrength] ?? 'LOW_CONFIDENCE';

    let title: string;
    let guidanceText: string;
    let ayurvedicPrinciple: string;

    if (climateLower.includes('dry') || climateLower.includes('cool')) {
      title = 'Dry & Cool Climate Lipid Shielding';
      guidanceText =
        'Counter dry environmental air by layering a light facial oil over damp skin after cleansing. Minimize hot water exposure, which strips natural sebum.';
      ayurvedicPrinciple = 'Shita and Ruksha environmental gunas aggregate Vata; Snigdha tailam preserves barrier integrity.';
    } else if (climateLower.includes('warm') || climateLower.includes('humid')) {
      title = 'Warm & Humid Climate Clarifying Care';
      guidanceText =
        'Utilize light herbal hydrosols (rose or vetiver water) throughout the day. Avoid heavy occlusive waxes that trap perspiration and elevate microcomedone formation.';
      ayurvedicPrinciple = 'Ushna and Drava environmental gunas elevate Pitta-Kapha kleda; gentle astringents balance sebum flow.';
    } else {
      title = 'Temperate Seasonal Equilibrium Care';
      guidanceText =
        'Honor balanced dinacharya routines; adjust lipid hydration gently according to indoor artificial heating or air conditioning exposure.';
      ayurvedicPrinciple = 'Ritu Sandhi (seasonal junction) requires conscious awareness of environmental shifts.';
    }

    const item: RecommendationItem = {
      id: `p14-rec-${ruleId}-${Date.now()}`,
      category: 'SEASONAL_ADJUSTMENT',
      priority: 'SUPPLEMENTARY',
      confidence: ceilingConfidence,
      title,
      description: 'Environmental adaptation guidance to maintain cutaneous harmony across climatic factors.',
      guidanceText,
      rationale: {
        supportingEvidenceIds: [],
        citationIds: [],
        contributingModalities: ['USER_CONTEXT'],
        explanation: `Customized for reported ambient environment: "${climate}".`,
        ayurvedicPrinciple,
      },
      safety: {
        patchTestRequired: false,
        contraindications: [],
        warnings: [PERSONALIZATION_SAFETY_LIMITS.STANDARD_DISCLAIMER],
        pregnancyCaution: false,
        professionalConsultationRecommended: false,
      },
      ruleId,
      ruleVersion: CURRENT_PERSONALIZATION_RULE_VERSION,
    };

    return { item };
  },
};

// ------------------------------------------------------------
// RULE 007: Skin-Type Calibrated Daily Dinacharya
// ------------------------------------------------------------
const rule007: InternalRecommendationRule = {
  ruleId: 'P14-RULE-007',
  ruleName: 'Skin-Type Calibrated Daily Dinacharya',
  category: 'DINACHARYA_ROUTINE',
  priority: 'PRIMARY',
  condition: (input) => {
    return Boolean(input.userSkinType && input.userSkinType.trim().length > 0);
  },
  action: (input, ruleId) => {
    const skinType = input.userSkinType!.trim().toLowerCase();
    const evidenceStrength = input.fusionResult.evidenceStrength;
    const ceilingConfidence = CONFIDENCE_CEILING_MAP[evidenceStrength] ?? 'LOW_CONFIDENCE';

    let title: string;
    let guidanceText: string;
    let sanskritName: string;
    let ayurvedicPrinciple: string;

    if (skinType === 'dry') {
      title = 'Nourishing Morning & Evening Care for Dry Skin';
      sanskritName = 'Ruksha Twak Dinacharya';
      guidanceText =
        'Cleanse with lukewarm water without foaming detergents. Apply 3–4 drops of warm botanical oil (sesame or almond) over damp skin to seal moisture.';
      ayurvedicPrinciple = 'Snehana (oleation) mitigates epidermal dehydration and roughness.';
    } else if (skinType === 'oily') {
      title = 'Clarifying Morning & Evening Care for Oily Skin';
      sanskritName = 'Snigdha Twak Dinacharya';
      guidanceText =
        'Cleanse twice daily with a gentle neem or triphala infusion. Follow with lightweight rose water mist; avoid pore-clogging heavy creams.';
      ayurvedicPrinciple = 'Shodhana (cleansing) and Tikta dravyas regulate excessive sebum without over-drying.';
    } else if (skinType === 'combination') {
      title = 'Dual-Zone Balancing Dinacharya';
      sanskritName = 'Mishra Twak Dinacharya';
      guidanceText =
        'Treat T-zone with clarifying botanical hydrosols, while applying a gentle nourishing oil exclusively to the cheek and temple areas.';
      ayurvedicPrinciple = 'Mishra dosha management balances contrasting local qualities.';
    } else if (skinType === 'sensitive') {
      title = 'Ultra-Gentle Soothing Care for Sensitive Skin';
      sanskritName = 'Sukshma Twak Dinacharya';
      guidanceText =
        'Keep rituals minimalist. Mist with pure distilled rose water and smooth fresh aloe vera gel. Avoid scrubs, acids, or heavily scented botanicals.';
      ayurvedicPrinciple = 'Prasadhana (calming) care protects delicate Bhrajaka Pitta barrier function.';
    } else {
      title = 'Equilibrium Maintenance Dinacharya';
      sanskritName = 'Sama Twak Dinacharya';
      guidanceText =
        'Cleanse gently each morning with water, protect with light botanical hydration, and let skin breathe overnight with minimal application.';
      ayurvedicPrinciple = 'Sama (balanced) dosha preservation through moderate, consistent care.';
    }

    const item: RecommendationItem = {
      id: `p14-rec-${ruleId}-${Date.now()}`,
      category: 'DINACHARYA_ROUTINE',
      priority: 'PRIMARY',
      confidence: ceilingConfidence,
      title,
      sanskritName,
      description: 'Daily morning and evening rhythm structured around self-reported skin baseline.',
      guidanceText,
      rationale: {
        supportingEvidenceIds: input.fusionResult.supportingEvidence.map((e) => e.id),
        citationIds: [],
        contributingModalities: ['USER_CONTEXT'],
        explanation: `Structured specifically for reported skin type: "${skinType.toUpperCase()}".`,
        ayurvedicPrinciple,
      },
      safety: {
        patchTestRequired: false,
        contraindications: [],
        warnings: [PERSONALIZATION_SAFETY_LIMITS.STANDARD_DISCLAIMER],
        pregnancyCaution: false,
        professionalConsultationRecommended: false,
      },
      ruleId,
      ruleVersion: CURRENT_PERSONALIZATION_RULE_VERSION,
    };

    return { item };
  },
};

// ------------------------------------------------------------
// 4. RULE REGISTRY
// ------------------------------------------------------------

export const RECOMMENDATION_RULES: readonly InternalRecommendationRule[] = [
  rule001,
  rule002,
  rule003,
  rule004,
  rule005,
  rule006,
  rule007,
] as const;

// ------------------------------------------------------------
// 5. HELPER: CHECK USER EXCLUSIONS
// ------------------------------------------------------------

/**
 * Checks whether any ingredient in a recommendation item's formulation
 * matches any item in the user's excludedIngredients list.
 */
function isExcludedByUser(
  item: RecommendationItem,
  excludedIngredients: string[],
): { excluded: boolean; matchedIngredient?: string } {
  if (!item.formulation || excludedIngredients.length === 0) {
    return { excluded: false };
  }

  const normalizedExclusions = excludedIngredients
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0);

  for (const ing of item.formulation.ingredients) {
    const id = ing.id.toLowerCase();
    const name = ing.name.toLowerCase();
    const sanskrit = ing.sanskritName ? ing.sanskritName.toLowerCase() : '';

    for (const ex of normalizedExclusions) {
      // 1. Exact match on id, English name, or Sanskrit name
      if (id === ex || name === ex || sanskrit === ex) {
        return { excluded: true, matchedIngredient: ing.name };
      }

      // 2. Substring match for tokens of at least 3 characters (e.g., "aloe" matches "aloe vera", "sesame" matches "sesame oil")
      if (ex.length >= 3) {
        if (name.includes(ex) || id.includes(ex) || (sanskrit && sanskrit.includes(ex))) {
          return { excluded: true, matchedIngredient: ing.name };
        }
      }

      // 3. Known allergens match (e.g., "curcumin" matches Turmeric's knownAllergens)
      if (
        ing.knownAllergens &&
        ing.knownAllergens.some((allergen) => {
          const a = allergen.toLowerCase();
          return a.includes(ex) || (ex.length >= 3 && ex.includes(a));
        })
      ) {
        return { excluded: true, matchedIngredient: ing.name };
      }
    }
  }

  return { excluded: false };
}

// ------------------------------------------------------------
// 6. MASTER RULE EVALUATION FUNCTION
// ------------------------------------------------------------

/**
 * Evaluates all recommendation rules against input signals.
 * Deterministic and pure — identical inputs produce identical outputs.
 */
export function evaluateRecommendationRules(
  input: RecommendationEngineInput,
): RecommendationEngineOutput {
  const recommendations: RecommendationItem[] = [];
  const decisionTraces: RecommendationDecisionTrace[] = [];
  const ceilingsApplied: string[] = [];

  let rulesFired = 0;
  let rulesSkipped = 0;
  let rulesExcluded = 0;

  const userExclusions = input.userPreferences.excludedIngredients ?? [];

  for (const rule of RECOMMENDATION_RULES) {
    const inputSignals: string[] = [];
    if (input.userDosha) inputSignals.push(`dosha:${input.userDosha}`);
    if (input.userSkinType) inputSignals.push(`skinType:${input.userSkinType}`);
    inputSignals.push(`fusionStrength:${input.fusionResult.evidenceStrength}`);
    inputSignals.push(`conflictState:${input.fusionResult.conflictState}`);

    const conditionMet = rule.condition(input);

    if (!conditionMet) {
      rulesSkipped++;
      decisionTraces.push({
        ruleId: rule.ruleId,
        ruleName: rule.ruleName,
        inputSignals,
        matchedConditions: [],
        outputAction: 'SKIPPED',
        confidenceAssignment: 'BASELINE_ONLY',
        priorityAssignment: rule.priority,
        excluded: false,
      });
      continue;
    }

    // Condition met: fire the rule
    const { item, ceilingApplied } = rule.action(input, rule.ruleId);

    if (ceilingApplied) {
      ceilingsApplied.push(`${rule.ruleId}: ${ceilingApplied}`);
    }

    // Check user exclusions
    const exclusionCheck = isExcludedByUser(item, userExclusions);

    if (exclusionCheck.excluded) {
      rulesExcluded++;
      decisionTraces.push({
        ruleId: rule.ruleId,
        ruleName: rule.ruleName,
        inputSignals,
        matchedConditions: ['condition_met'],
        outputAction: 'BLOCKED_BY_USER_EXCLUSION',
        confidenceAssignment: item.confidence,
        priorityAssignment: rule.priority,
        ceilingApplied,
        excluded: true,
        exclusionReason: `User preference excludes ingredient: ${exclusionCheck.matchedIngredient}`,
      });
      continue;
    }

    // Passed all checks: accept recommendation
    rulesFired++;
    recommendations.push(item);

    decisionTraces.push({
      ruleId: rule.ruleId,
      ruleName: rule.ruleName,
      inputSignals,
      matchedConditions: ['condition_met', 'not_excluded'],
      outputAction: 'RECOMMENDATION_GENERATED',
      confidenceAssignment: item.confidence,
      priorityAssignment: rule.priority,
      ceilingApplied,
      excluded: false,
    });
  }

  // Sort by priority: PRIMARY > SECONDARY > SUPPLEMENTARY
  recommendations.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

  return {
    recommendations,
    decisionTraces,
    rulesEvaluated: RECOMMENDATION_RULES.length,
    rulesFired,
    rulesSkipped,
    rulesExcluded,
    ceilingsApplied,
  };
}
