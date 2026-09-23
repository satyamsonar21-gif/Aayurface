// ============================================================
// AayurFace — Evidence Agreement Engine
// Phase 12: Multimodal Fusion, Evidence Agreement & Cross-Modality Congruence
// Deterministic Semantic Agreement Without Diagnostic Overreach
// ============================================================

import type {
  FusionEvidenceItem,
  EvidenceAgreementDetail
} from '@/types/fusion';

export interface AgreementEvaluationResult {
  agreements: EvidenceAgreementDetail[];
  rulesFired: string[];
}

/**
 * Evaluates semantic agreement across distinct modalities.
 * Enforces strict boundary: Visual redness + Pitta context = CONTEXTUAL_SUPPORT, NEVER a dosha diagnosis.
 */
export function evaluateEvidenceAgreement(
  evidenceItems: FusionEvidenceItem[]
): AgreementEvaluationResult {
  const agreements: EvidenceAgreementDetail[] = [];
  const rulesFired: string[] = [];

  // Filter to active, non-discounted evidence items
  const activeItems = evidenceItems.filter(
    (item) => item.usageStatus === 'USED' && item.state !== 'NOT_ASSESSED' && item.state !== 'INSUFFICIENT_EVIDENCE'
  );

  // 1. Direct Visual Gateway Congruence
  const visualReadyItems = activeItems.filter(
    (item) => item.modality === 'VISUAL' && item.observationType === 'FACE_GEOMETRY_METRICS' && item.state === 'SUPPORTED'
  );
  if (visualReadyItems.length > 0) {
    agreements.push({
      id: `agr-vis-geom-${Date.now()}`,
      agreementType: 'DIRECT_OBSERVATION',
      supportingEvidenceIds: visualReadyItems.map((i) => i.id),
      targetInterpretation: 'Facial Surface Observable for Assessment',
      semanticRationale: 'Phase 10 hardware and facial geometry metrics confirm the face is sufficiently observable.',
      strengthContribution: 'MODERATE'
    });
    rulesFired.push('rule-agreement-visual-geometry-supported');
  }

  // 2. Cross-Modality: User Context + Ayurvedic Knowledge Baseline
  const userPrakriti = activeItems.find(
    (item) => item.modality === 'USER_CONTEXT' && item.contextType === 'REPORTED_PRAKRITI'
  );

  const ayurInterpretations = activeItems.filter(
    (item) => item.modality === 'AYURVEDIC_CONTEXT'
  );

  if (userPrakriti && userPrakriti.payload?.reportedPrakriti) {
    const prakriti = String(userPrakriti.payload.reportedPrakriti).toLowerCase();

    // Check if Ayurvedic interpretation contains conceptual alignment
    for (const ayurItem of ayurInterpretations) {
      const desc = String(ayurItem.statusReason || '').toLowerCase();
      const conceptId = String(ayurItem.rawConceptId || '').toLowerCase();

      const isAligned =
        (prakriti.includes('pitta') && (desc.includes('pitta') || desc.includes('pita') || conceptId.includes('pita'))) ||
        (prakriti.includes('vata') && (desc.includes('vata') || conceptId.includes('vata'))) ||
        (prakriti.includes('kapha') && (desc.includes('kapha') || conceptId.includes('kapha')));

      if (isAligned) {
        agreements.push({
          id: `agr-ctx-ayur-${ayurItem.id}`,
          agreementType: 'CONTEXTUAL_SUPPORT',
          supportingEvidenceIds: [userPrakriti.id, ayurItem.id],
          targetInterpretation: `Contextual Alignment with User-Reported ${prakriti.toUpperCase()} Baseline`,
          semanticRationale: `Self-reported ${prakriti.toUpperCase()} baseline contextually supports classical Ayurvedic guidance principles. This does NOT infer or diagnose constitution from the image.`,
          strengthContribution: 'MODERATE'
        });
        rulesFired.push(`rule-agreement-context-ayur-${prakriti}`);
      }
    }
  }

  // 3. Visual Skin Observation + Ayurvedic Context Congruence (when visual observation is active)
  const activeSkinObs = activeItems.filter(
    (item) => item.modality === 'VISUAL' && item.observationType !== 'FACE_GEOMETRY_METRICS' && item.state === 'SUPPORTED'
  );

  for (const obs of activeSkinObs) {
    if (obs.observationType === 'REDNESS_LIKE_APPEARANCE') {
      const matchingAyur = ayurInterpretations.find(
        (a) => String(a.rawConceptId || '').includes('pita') || String(a.statusReason || '').includes('heat')
      );
      if (matchingAyur) {
        agreements.push({
          id: `agr-vis-ayur-redness`,
          agreementType: 'CONTEXTUAL_SUPPORT',
          supportingEvidenceIds: [obs.id, matchingAyur.id],
          targetInterpretation: 'Redness Observation Contextualized with Thermal Care Principles',
          semanticRationale: 'Visual redness-like observation aligns contextually with cooling care principles without establishing clinical diagnosis.',
          strengthContribution: 'MODERATE'
        });
        rulesFired.push('rule-agreement-visual-redness-ayur-heat');
      }
    } else if (obs.observationType === 'DRYNESS_LIKE_APPEARANCE') {
      const matchingAyur = ayurInterpretations.find(
        (a) => String(a.rawConceptId || '').includes('vata') || String(a.statusReason || '').includes('dry')
      );
      if (matchingAyur) {
        agreements.push({
          id: `agr-vis-ayur-dryness`,
          agreementType: 'CONTEXTUAL_SUPPORT',
          supportingEvidenceIds: [obs.id, matchingAyur.id],
          targetInterpretation: 'Dryness Observation Contextualized with Lipid Nourishment Principles',
          semanticRationale: 'Visual dryness-like observation aligns contextually with grounding oil care principles without establishing clinical diagnosis.',
          strengthContribution: 'MODERATE'
        });
        rulesFired.push('rule-agreement-visual-dryness-ayur-vata');
      }
    } else if (obs.observationType === 'SHINE_LIKE_APPEARANCE') {
      const matchingAyur = ayurInterpretations.find(
        (a) => String(a.rawConceptId || '').includes('kapha') || String(a.statusReason || '').includes('oil')
      );
      if (matchingAyur) {
        agreements.push({
          id: `agr-vis-ayur-shine`,
          agreementType: 'CONTEXTUAL_SUPPORT',
          supportingEvidenceIds: [obs.id, matchingAyur.id],
          targetInterpretation: 'Shine Observation Contextualized with Clarifying Care Principles',
          semanticRationale: 'Visual shine observation aligns contextually with clarifying care principles without establishing clinical diagnosis.',
          strengthContribution: 'MODERATE'
        });
        rulesFired.push('rule-agreement-visual-shine-ayur-kapha');
      }
    }
  }

  return {
    agreements,
    rulesFired
  };
}
