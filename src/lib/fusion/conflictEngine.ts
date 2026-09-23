// ============================================================
// AayurFace — Evidence Conflict Engine
// Phase 12: Multimodal Fusion, Evidence Conflict Detection & Classification
// Deterministic Conflict Identification with Automatic Certainty Downgrading
// ============================================================

import type {
  FusionEvidenceItem,
  EvidenceConflictDetail,
  ConflictState
} from '@/types/fusion';

export interface ConflictEvaluationResult {
  conflicts: EvidenceConflictDetail[];
  overallConflictState: ConflictState;
  rulesFired: string[];
}

/**
 * Identifies and classifies semantic conflicts across modalities.
 * Conflict strictly degrades certainty and prevents high-confidence inflation.
 */
export function evaluateEvidenceConflicts(
  evidenceItems: FusionEvidenceItem[]
): ConflictEvaluationResult {
  const conflicts: EvidenceConflictDetail[] = [];
  const rulesFired: string[] = [];

  const activeItems = evidenceItems.filter((i) => i.usageStatus === 'USED');

  // 1. Conflict: Visual Observation vs User-Reported Skin Type
  const reportedSkinTypeItem = activeItems.find(
    (i) => i.modality === 'USER_CONTEXT' && i.contextType === 'REPORTED_SKIN_TYPE'
  );
  const reportedSkinType = String(reportedSkinTypeItem?.payload?.reportedSkinType || '').toLowerCase();

  const visualSkinObs = activeItems.filter(
    (i) => i.modality === 'VISUAL' && i.observationType !== 'FACE_GEOMETRY_METRICS' && i.state === 'SUPPORTED'
  );

  for (const obs of visualSkinObs) {
    if (obs.observationType === 'DRYNESS_LIKE_APPEARANCE' && reportedSkinType.includes('oily')) {
      conflicts.push({
        id: `cnf-dryness-oily-${obs.id}`,
        severity: 'MATERIAL_CONFLICT',
        evidenceIds: [obs.id, reportedSkinTypeItem?.id || 'ctx-skintype'],
        description: 'Visual observation suggests surface dryness/flakiness, while user reported oily skin type.',
        competingInterpretations: ['Cutaneous barrier dehydration', 'Epidermal sebaceous excess'],
        resolutionRuleApplied: 'rule-conflict-downgrade-to-combination-observation',
        downgradeApplied: true
      });
      rulesFired.push('rule-conflict-visual-dryness-vs-reported-oily');
    }

    if (obs.observationType === 'SHINE_LIKE_APPEARANCE' && reportedSkinType.includes('dry')) {
      conflicts.push({
        id: `cnf-shine-dry-${obs.id}`,
        severity: 'MATERIAL_CONFLICT',
        evidenceIds: [obs.id, reportedSkinTypeItem?.id || 'ctx-skintype'],
        description: 'Visual observation suggests surface shine/lipids, while user reported dry skin type.',
        competingInterpretations: ['Barrier lipid deficiency', 'Surface lipid shine'],
        resolutionRuleApplied: 'rule-conflict-downgrade-to-combination-observation',
        downgradeApplied: true
      });
      rulesFired.push('rule-conflict-visual-shine-vs-reported-dry');
    }
  }

  // 2. Conflict: Hardware / Capture Rejection vs High User Confidence Expectations
  const rejectedCaptureItem = evidenceItems.find(
    (i) => i.modality === 'VISUAL' && i.observationType === 'FACE_GEOMETRY_METRICS' && i.usageStatus === 'DISCOUNTED'
  );

  const hasHighContextItems = activeItems.some(
    (i) => i.modality === 'USER_CONTEXT' && i.strength === 'MODERATE'
  );

  if (rejectedCaptureItem && hasHighContextItems) {
    conflicts.push({
      id: `cnf-rejected-capture-vs-context`,
      severity: 'UNRESOLVED_CONFLICT',
      evidenceIds: [rejectedCaptureItem.id],
      description: 'User provided detailed profile context, but camera visual capture failed quality/readiness checks.',
      competingInterpretations: ['Contextual baseline known', 'Visual ground truth absent due to rejection'],
      resolutionRuleApplied: 'rule-conflict-gate-rejection-precedence',
      downgradeApplied: true
    });
    rulesFired.push('rule-conflict-rejected-capture-vs-context');
  }

  // 3. Conflict: Contradictory Ayurvedic Concept Claims
  const ayurItems = activeItems.filter((i) => i.modality === 'AYURVEDIC_CONTEXT');
  const hasHeatConcept = ayurItems.some((i) => String(i.rawConceptId || '').includes('pita') || String(i.statusReason || '').includes('heat'));
  const hasExtremeColdConcept = ayurItems.some((i) => String(i.rawConceptId || '').includes('vata-cold') || String(i.statusReason || '').includes('shita'));

  if (hasHeatConcept && hasExtremeColdConcept) {
    conflicts.push({
      id: `cnf-ayur-heat-vs-cold`,
      severity: 'MINOR_CONFLICT',
      evidenceIds: ayurItems.map((a) => a.id),
      description: 'Simultaneous indications of elevated Ushna (heat) and Shita (cold) properties.',
      competingInterpretations: ['Pitta thermal escalation', 'Vata cold constriction'],
      resolutionRuleApplied: 'rule-conflict-dual-doshic-context',
      downgradeApplied: true
    });
    rulesFired.push('rule-conflict-ayur-heat-vs-cold');
  }

  // Determine overall conflict state
  let overallConflictState: ConflictState = 'NO_CONFLICT';
  if (conflicts.some((c) => c.severity === 'UNRESOLVED_CONFLICT')) {
    overallConflictState = 'UNRESOLVED_CONFLICT';
  } else if (conflicts.some((c) => c.severity === 'MATERIAL_CONFLICT')) {
    overallConflictState = 'MATERIAL_CONFLICT';
  } else if (conflicts.some((c) => c.severity === 'MINOR_CONFLICT')) {
    overallConflictState = 'MINOR_CONFLICT';
  }

  return {
    conflicts,
    overallConflictState,
    rulesFired
  };
}
