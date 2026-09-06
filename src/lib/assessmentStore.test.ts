// ============================================================
// AayurFace — Assessment Store Unit Tests
// Tests for unique ID generation, user scoping, persistence,
// cross-account isolation, and demo isolation
// ============================================================

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createAssessment,
  getAssessmentById,
  getUserAssessments,
  getDemoAssessment,
  generateAssessmentId,
} from './assessmentStore';

describe('AssessmentStore & Domain Lifecycle', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('generates cryptographically unique IDs', () => {
    const id1 = generateAssessmentId();
    const id2 = generateAssessmentId();
    expect(id1).toBeTruthy();
    expect(id2).toBeTruthy();
    expect(id1).not.toBe(id2);
  });

  it('creates and persists an authentic assessment for a user', () => {
    const userId = 'user-alice-123';
    const fakeImage = 'data:image/jpeg;base64,sampleAliceFaceImageData';
    const assessment = createAssessment(userId, fakeImage, {
      dosha: 'pitta',
      skin_type: 'oily',
    });

    expect(assessment.id).toBeTruthy();
    expect(assessment.userId).toBe(userId);
    expect(assessment.capturedImage).toBe(fakeImage);
    expect(assessment.createdAt).toBeTruthy();
    expect(assessment.isDemo).toBe(false);
    expect(assessment.summary).toContain('Oily');
    expect(assessment.doshaTendency.primary).toBe('Pitta');

    // Verify persisted in localStorage under user-scoped key
    const userKey = `aayurface_assessments_${userId}`;
    const stored = JSON.parse(localStorage.getItem(userKey) || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(assessment.id);
  });

  it('enforces strict cross-account isolation (User B cannot access User A assessment)', () => {
    const userA = 'user-alice-111';
    const userB = 'user-bob-222';
    const imgA = 'data:image/jpeg;base64,aliceFace';
    const imgB = 'data:image/jpeg;base64,bobFace';

    const assessmentA = createAssessment(userA, imgA);
    const assessmentB = createAssessment(userB, imgB);

    // Both IDs and images must differ
    expect(assessmentA.id).not.toBe(assessmentB.id);
    expect(assessmentA.capturedImage).not.toBe(assessmentB.capturedImage);

    // Alice can access Alice's assessment
    expect(getAssessmentById(userA, assessmentA.id)).not.toBeNull();
    expect(getAssessmentById(userA, assessmentA.id)?.id).toBe(assessmentA.id);

    // Bob CANNOT access Alice's assessment (returns null / not found)
    expect(getAssessmentById(userB, assessmentA.id)).toBeNull();

    // Alice CANNOT access Bob's assessment
    expect(getAssessmentById(userA, assessmentB.id)).toBeNull();

    // Bob can access Bob's assessment
    expect(getAssessmentById(userB, assessmentB.id)?.id).toBe(assessmentB.id);
  });

  it('retrieves user assessments sorted newest first', () => {
    const userId = 'user-charlie-333';
    const a1 = createAssessment(userId, 'data:image/jpeg;base64,frame1');
    const a2 = createAssessment(userId, 'data:image/jpeg;base64,frame2');

    const list = getUserAssessments(userId);
    expect(list).toHaveLength(2);
    // a2 was created second, so it should be first
    expect(list[0].id).toBe(a2.id);
    expect(list[1].id).toBe(a1.id);
  });

  it('isolates the demo-scan sample reference', () => {
    const demo = getDemoAssessment();
    expect(demo.id).toBe('demo-scan');
    expect(demo.isDemo).toBe(true);
    expect(demo.userId).toBe('sample-system');

    // Requesting 'demo-scan' via getAssessmentById returns the demo record
    const retrieved = getAssessmentById('any-user', 'demo-scan');
    expect(retrieved?.id).toBe('demo-scan');
    expect(retrieved?.isDemo).toBe(true);
  });

  it('throws when attempting to create assessment without userId or capturedImage', () => {
    expect(() => createAssessment('', 'data:image/jpeg;base64,valid')).toThrow();
    expect(() => createAssessment('user-1', '')).toThrow();
  });
});
