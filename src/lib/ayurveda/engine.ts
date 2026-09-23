import type {
  VisualObservationSet,
  AyurvedicContext,
  AyurvedicInterpretationSet,
  Interpretation,
  VersionInfo,
  EvidenceStatus
} from './types';
import { getKnowledgeItem, CURRENT_KNOWLEDGE_VERSION } from './knowledge';

export const CURRENT_RULE_VERSION = 'ayur-r-v1.0.0';
export const CURRENT_SCHEMA_VERSION = 'ayur-s-v1.0.0';

export const VERSION_INFO: VersionInfo = {
  knowledgeVersion: CURRENT_KNOWLEDGE_VERSION,
  ruleVersion: CURRENT_RULE_VERSION,
  schemaVersion: CURRENT_SCHEMA_VERSION,
};

/**
 * Generates a unique ID for interpretations.
 */
function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `interp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Deterministic rule engine for Ayurvedic Interpretation.
 * STRICT LIMITATION: Cannot diagnose dosha directly from face.
 */
export function evaluateAyurvedicContext(
  observations: VisualObservationSet | null,
  context: AyurvedicContext | null
): AyurvedicInterpretationSet {
  
  const interpretations: Interpretation[] = [];
  let overallEvidence: EvidenceStatus = 'INSUFFICIENT_EVIDENCE';

  // Guard against missing inputs
  if (!observations && !context) {
    return {
      interpretationId: generateId(),
      userId: 'unknown',
      timestamp: new Date().toISOString(),
      interpretations: [],
      overallEvidenceState: 'INSUFFICIENT_EVIDENCE',
      versionInfo: VERSION_INFO,
    };
  }

  // Evaluate Visual Observations safely
  if (observations && observations.observations.length > 0) {
    observations.observations.forEach(obs => {
      if (obs.state !== 'OBSERVED') return;

      if (obs.type === 'REDNESS_LIKE_APPEARANCE') {
        const ki = getKnowledgeItem('concept-pita-heat');
        if (ki) {
          interpretations.push({
            id: generateId(),
            rationale: {
              observedIds: [obs.id],
              contextIds: [],
              ayurvedicConceptIds: [ki.id],
              description: 'Redness-like visual observation may be relevant to Ayurvedic heat-related considerations.'
            },
            evidence: 'PARTIALLY_SUPPORTED',
            limitations: 'Visual appearance alone is insufficient to establish constitutional or clinical status. It is one signal among multiple contextual inputs.',
            safetyBoundaries: null,
            ruleVersion: CURRENT_RULE_VERSION
          });
        }
      }

      if (obs.type === 'DRYNESS_LIKE_APPEARANCE') {
        const ki = getKnowledgeItem('concept-vata-dryness');
        if (ki) {
          interpretations.push({
            id: generateId(),
            rationale: {
              observedIds: [obs.id],
              contextIds: [],
              ayurvedicConceptIds: [ki.id],
              description: 'Dryness-like visual observation may relate to Vata (Ruksha/dry) considerations.'
            },
            evidence: 'PARTIALLY_SUPPORTED',
            limitations: 'Visual dryness alone does not confirm a Vata imbalance. Contextual evaluation is required.',
            safetyBoundaries: null,
            ruleVersion: CURRENT_RULE_VERSION
          });
        }
      }

      if (obs.type === 'SHINE_LIKE_APPEARANCE') {
        const ki = getKnowledgeItem('concept-kapha-oiliness');
        if (ki) {
          interpretations.push({
            id: generateId(),
            rationale: {
              observedIds: [obs.id],
              contextIds: [],
              ayurvedicConceptIds: [ki.id],
              description: 'Shine or oiliness observation may relate to Kapha (Snigdha/unctuous) considerations.'
            },
            evidence: 'PARTIALLY_SUPPORTED',
            limitations: 'Shine is a surface observation and does not constitute a clinical Kapha diagnosis.',
            safetyBoundaries: null,
            ruleVersion: CURRENT_RULE_VERSION
          });
        }
      }
    });
  }

  // Contextual Evaluation (Prakriti, Lifestyle)
  if (context?.prakriti.status === 'REPORTED') {
    // If user explicitly reported Prakriti, we consider it stronger evidence context
    interpretations.push({
      id: generateId(),
      rationale: {
        observedIds: [],
        contextIds: ['prakriti-context'],
        ayurvedicConceptIds: [], // We don't link a specific dosha concept indiscriminately
        description: `User reported Prakriti context (${context.prakriti.value}) provides a constitutional baseline.`
      },
      evidence: 'SUPPORTED',
      limitations: 'Self-reported Prakriti is contextual and subject to user understanding.',
      safetyBoundaries: null,
      ruleVersion: CURRENT_RULE_VERSION
    });
  }

  if (interpretations.length > 0) {
    overallEvidence = 'PARTIALLY_SUPPORTED';
  }

  return {
    interpretationId: generateId(),
    userId: context?.userId || 'unknown',
    timestamp: new Date().toISOString(),
    interpretations,
    overallEvidenceState: overallEvidence,
    versionInfo: VERSION_INFO,
  };
}
