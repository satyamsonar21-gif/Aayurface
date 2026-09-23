import { describe, it, expect } from 'vitest';
import { evaluateAyurvedicContext } from './engine';
import type { VisualObservationSet, AyurvedicContext } from './types';

describe('Phase 11: Ayurvedic Intelligence Foundation - Engine', () => {
  it('returns INSUFFICIENT_EVIDENCE when provided no data', () => {
    const result = evaluateAyurvedicContext(null, null);
    expect(result.overallEvidenceState).toBe('INSUFFICIENT_EVIDENCE');
    expect(result.interpretations.length).toBe(0);
  });

  it('preserves uncertainty for UNCERTAIN observations', () => {
    const observations: VisualObservationSet = {
      observations: [
        {
          id: 'obs-1',
          type: 'REDNESS_LIKE_APPEARANCE',
          state: 'UNCERTAIN',
          confidence: 'UNCERTAIN',
          timestamp: new Date().toISOString(),
          source: 'SYSTEM_DERIVED'
        }
      ]
    };
    
    const result = evaluateAyurvedicContext(observations, null);
    // Should not trigger the redness rule
    expect(result.interpretations.length).toBe(0);
    expect(result.overallEvidenceState).toBe('INSUFFICIENT_EVIDENCE');
  });

  it('evaluates REDNESS_LIKE_APPEARANCE without diagnosing Pitta directly', () => {
    const observations: VisualObservationSet = {
      observations: [
        {
          id: 'obs-2',
          type: 'REDNESS_LIKE_APPEARANCE',
          state: 'OBSERVED',
          confidence: 'SUPPORTED',
          timestamp: new Date().toISOString(),
          source: 'SYSTEM_DERIVED'
        }
      ]
    };

    const result = evaluateAyurvedicContext(observations, null);
    expect(result.interpretations.length).toBe(1);
    
    const interp = result.interpretations[0];
    // Check safety limitation is strictly enforced
    expect(interp.limitations).toContain('insufficient to establish constitutional or clinical status');
    expect(interp.rationale.description).not.toContain('diagnos');
    expect(interp.rationale.description).not.toContain('You have Pitta');
    expect(interp.evidence).toBe('PARTIALLY_SUPPORTED'); // NOT full supported
  });

  it('safely handles user-reported Prakriti context with appropriate limitations', () => {
    const context: AyurvedicContext = {
      userId: 'test-user',
      prakriti: {
        value: 'PITTA',
        source: 'USER_REPORTED',
        status: 'REPORTED'
      },
      lifestyle: []
    };

    const result = evaluateAyurvedicContext(null, context);
    expect(result.interpretations.length).toBe(1);
    expect(result.interpretations[0].limitations).toContain('Self-reported');
    expect(result.interpretations[0].rationale.contextIds).toContain('prakriti-context');
  });

  it('combines observations and context with deterministic rule matching', () => {
    const observations: VisualObservationSet = {
      observations: [
        {
          id: 'obs-3',
          type: 'DRYNESS_LIKE_APPEARANCE',
          state: 'OBSERVED',
          confidence: 'SUPPORTED',
          timestamp: new Date().toISOString(),
          source: 'SYSTEM_DERIVED'
        }
      ]
    };
    const context: AyurvedicContext = {
      userId: 'test-user',
      prakriti: {
        value: 'VATA',
        source: 'USER_REPORTED',
        status: 'REPORTED'
      },
      lifestyle: []
    };

    const result = evaluateAyurvedicContext(observations, context);
    expect(result.interpretations.length).toBe(2);
    expect(result.versionInfo.ruleVersion).toBeDefined();
    expect(result.versionInfo.knowledgeVersion).toBeDefined();
  });

  describe('STRICT REGRESSIONS: No deterministic diagnosis from single signals', () => {
    it('REGRESSION: redness does NOT deterministically equal Pitta diagnosis', () => {
      const observations: VisualObservationSet = {
        observations: [{ id: 'obs-red', type: 'REDNESS_LIKE_APPEARANCE', state: 'OBSERVED', confidence: 'SUPPORTED', timestamp: '', source: 'SYSTEM_DERIVED' }]
      };
      const result = evaluateAyurvedicContext(observations, null);
      const rednessInterp = result.interpretations[0];
      
      expect(rednessInterp.rationale.description).not.toContain('You have Pitta');
      expect(rednessInterp.evidence).not.toBe('SUPPORTED');
      expect(rednessInterp.limitations).toContain('insufficient');
    });

    it('REGRESSION: dryness does NOT deterministically equal Vata diagnosis', () => {
      const observations: VisualObservationSet = {
        observations: [{ id: 'obs-dry', type: 'DRYNESS_LIKE_APPEARANCE', state: 'OBSERVED', confidence: 'SUPPORTED', timestamp: '', source: 'SYSTEM_DERIVED' }]
      };
      const result = evaluateAyurvedicContext(observations, null);
      const drynessInterp = result.interpretations[0];
      
      expect(drynessInterp.rationale.description).not.toContain('You have Vata');
      expect(drynessInterp.evidence).not.toBe('SUPPORTED');
      expect(drynessInterp.limitations).toContain('Contextual evaluation is required');
    });

    it('REGRESSION: oiliness does NOT deterministically equal Kapha diagnosis', () => {
      const observations: VisualObservationSet = {
        observations: [{ id: 'obs-shine', type: 'SHINE_LIKE_APPEARANCE', state: 'OBSERVED', confidence: 'SUPPORTED', timestamp: '', source: 'SYSTEM_DERIVED' }]
      };
      const result = evaluateAyurvedicContext(observations, null);
      const shineInterp = result.interpretations[0];
      
      expect(shineInterp.rationale.description).not.toContain('You have Kapha');
      expect(shineInterp.evidence).not.toBe('SUPPORTED');
      expect(shineInterp.limitations).toContain('does not constitute a clinical Kapha diagnosis');
    });
  });
});
