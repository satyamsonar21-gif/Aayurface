// ============================================================
// AayurFace — Phase 13: Semantic-Preserving Text Normalizer
// Standardizes text formatting while protecting Sanskrit & technical terminology
// ============================================================

export interface TextNormalizationOptions {
  stripHeadersFooters?: boolean;
  normalizeHyphens?: boolean;
  normalizeWhitespace?: boolean;
}

/**
 * Normalizes input text while strictly preserving Ayurvedic concepts and terms.
 * Prohibits translating or altering original classical words.
 */
export function normalizeText(text: string, options: TextNormalizationOptions = {}): string {
  if (!text) return '';

  const {
    stripHeadersFooters = true,
    normalizeHyphens = true,
    normalizeWhitespace = true
  } = options;

  let cleaned = text;

  // 1. Remove non-printable control characters except standard whitespace (\n, \r, \t)
  cleaned = cleaned.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');

  // 2. Strip standard scanned PDF header/footer artifacts like "Page 123 of 456" or isolated numbers
  if (stripHeadersFooters) {
    cleaned = cleaned.replace(/^\s*(?:Page\s+\d+(?:\s+of\s+\d+)?|\d+)\s*$/gim, '');
  }

  // 3. Repair line-break hyphenation (e.g., "Ush- \n na" -> "Ushna")
  if (normalizeHyphens) {
    cleaned = cleaned.replace(/([a-zA-Z\u0900-\u097F])-\s*[\r\n]+\s*([a-zA-Z\u0900-\u097F])/g, '$1$2');
  }

  // 4. Standardize line endings and multiple spaces
  if (normalizeWhitespace) {
    cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    cleaned = cleaned.replace(/[ \t]+/g, ' ');
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  }

  // 5. Unicode normalization (NFC preserves Devanagari combined glyphs correctly)
  return cleaned.normalize('NFC').trim();
}
