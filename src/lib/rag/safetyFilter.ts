// ============================================================
// AayurFace — Phase 13: Deterministic AI Output Safety Filter
// Enforces Non-Diagnostic Boundary, Blocks Disease Names & Cures
// ============================================================

import type { SafetyViolationType, SafetyValidationResult } from '@/types/rag';

// 1. Prohibited Medical Disease Names
const PROHIBITED_DISEASE_TERMS: { pattern: RegExp; name: string }[] = [
  { pattern: /\b(?:cystic\s+acne|acne\s+vulgaris)\b/i, name: 'Cystic Acne / Acne Vulgaris' },
  { pattern: /\b(?:rosacea|erythema\s+multiforme)\b/i, name: 'Rosacea / Erythema' },
  { pattern: /\b(?:eczema|atopic\s+dermatitis|contact\s+dermatitis|seborrheic\s+dermatitis)\b/i, name: 'Eczema / Dermatitis' },
  { pattern: /\b(?:psoriasis|plaque\s+psoriasis)\b/i, name: 'Psoriasis' },
  { pattern: /\b(?:melanoma|carcinoma|skin\s+cancer)\b/i, name: 'Malignancy / Cancer' },
  { pattern: /\b(?:bacterial\s+infection|fungal\s+infection|staph\s+infection|impetigo)\b/i, name: 'Infectious Pathology' },
  { pattern: /\b(?:pathology|pathological\s+condition)\b/i, name: 'Clinical Pathology' },
  { pattern: /\bdiagnose(?:d|s|ing)?\s+(?:you\s+with|as\s+having)\b/i, name: 'Diagnostic Language' }
];

// 2. Prohibited Prescription Pharmaceutical Drugs
const PROHIBITED_DRUG_TERMS: { pattern: RegExp; name: string }[] = [
  { pattern: /\b(?:isotretinoin|accutane)\b/i, name: 'Isotretinoin' },
  { pattern: /\b(?:tretinoin|retin-a)\b/i, name: 'Tretinoin' },
  { pattern: /\b(?:spironolactone)\b/i, name: 'Spironolactone' },
  { pattern: /\b(?:doxycycline|tetracycline|minocycline|antibiotic(?:s)?)\b/i, name: 'Systemic Antibiotics' },
  { pattern: /\b(?:hydrocortisone|corticosteroid(?:s)?|steroid\s+cream)\b/i, name: 'Corticosteroids' }
];

// 3. Prohibited Guaranteed Cure & Medical Promises
const PROHIBITED_CURE_PATTERNS: { pattern: RegExp; name: string }[] = [
  { pattern: /\b(?:guarantee(?:d)?\s+to\s+cure|100%\s+cure|cure\s+guaranteed)\b/i, name: 'Guaranteed Cure' },
  { pattern: /\b(?:permanent(?:ly)?\s+cure|permanently\s+eradicate|eradicate\s+all)\b/i, name: 'Permanent Eradication' },
  { pattern: /\b(?:clinically\s+proven\s+cure|medically\s+certified\s+treatment)\b/i, name: 'Unverified Clinical Efficacy' }
];

// 4. Prohibited Direct Face-to-Dosha or Face-to-Prakriti Diagnostic Inferences
const PROHIBITED_COLLAPSE_PATTERNS: { pattern: RegExp; type: SafetyViolationType; name: string }[] = [
  {
    pattern: /\b(?:your\s+face\s+(?:proves|confirms|shows|diagnoses)(?:\s+conclusively)?(?:\s+that)?\s+(?:your\s+)?(?:dosha|prakriti)\s+is)\b/i,
    type: 'FACE_TO_DOSHA_DIRECT_COLLAPSE',
    name: 'Face-to-Dosha Diagnostic Collapse'
  },
  {
    pattern: /\b(?:diagnose\s+your\s+prakriti\s+from\s+your\s+face|facial\s+scan\s+determines\s+your\s+prakriti)\b/i,
    type: 'FACE_TO_PRAKRITI_DIRECT_COLLAPSE',
    name: 'Face-to-Prakriti Diagnostic Collapse'
  },
  {
    pattern: /\b(?:redness\s+(?:proves|diagnoses)\s+pitta\s+disorder|dryness\s+(?:proves|diagnoses)\s+vata\s+disorder)\b/i,
    type: 'FACE_TO_DOSHA_DIRECT_COLLAPSE',
    name: 'Single Feature to Dosha Collapse'
  }
];

// 5. System Instruction Primacy / Secret Leakage
const PROHIBITED_LEAKAGE_PATTERNS: { pattern: RegExp; type: SafetyViolationType; name: string }[] = [
  { pattern: /\b(?:system\s+prompt\s+is|my\s+instructions\s+are\s+to|here\s+are\s+my\s+internal\s+instructions)\b/i, type: 'SYSTEM_PROMPT_DISCLOSURE', name: 'System Prompt Disclosure' },
  { pattern: /\b(?:service_role_key|supabase_key|sk-[a-zA-Z0-9]{20,})\b/i, type: 'MALICIOUS_INSTRUCTION_LEAKAGE', name: 'Secret/Credential Leakage' }
];

/**
 * Validates text payload against all safety categories.
 * Strict zero-tolerance enforcement for medical diagnostics and clinical cures.
 */
export function validateSafety(text: string): SafetyValidationResult {
  if (!text) return { isSafe: true, violations: [], violationDetails: [] };

  const violations: SafetyViolationType[] = [];
  const violationDetails: string[] = [];

  // Check 1: Disease names
  for (const { pattern, name } of PROHIBITED_DISEASE_TERMS) {
    if (pattern.test(text)) {
      violations.push('PROHIBITED_MEDICAL_DIAGNOSIS');
      violationDetails.push(`Clinical disease terminology detected: ${name}`);
    }
  }

  // Check 2: Pharmaceutical drugs
  for (const { pattern, name } of PROHIBITED_DRUG_TERMS) {
    if (pattern.test(text)) {
      violations.push('PROHIBITED_PRESCRIPTION_DRUG');
      violationDetails.push(`Prescription drug recommendation detected: ${name}`);
    }
  }

  // Check 3: Guaranteed cures
  for (const { pattern, name } of PROHIBITED_CURE_PATTERNS) {
    if (pattern.test(text)) {
      violations.push('GUARANTEED_CURE_PROMISE');
      violationDetails.push(`Unsubstantiated cure claim detected: ${name}`);
    }
  }

  // Check 4: Diagnostic face-to-dosha collapse
  for (const { pattern, type, name } of PROHIBITED_COLLAPSE_PATTERNS) {
    if (pattern.test(text)) {
      violations.push(type);
      violationDetails.push(`Non-diagnostic boundary violation: ${name}`);
    }
  }

  // Check 5: Secret/prompt disclosure
  for (const { pattern, type, name } of PROHIBITED_LEAKAGE_PATTERNS) {
    if (pattern.test(text)) {
      violations.push(type);
      violationDetails.push(`Security violation: ${name}`);
    }
  }

  const isSafe = violations.length === 0;

  return {
    isSafe,
    violations: Array.from(new Set(violations)),
    violationDetails
  };
}
