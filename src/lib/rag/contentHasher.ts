// ============================================================
// AayurFace — Phase 13: Cryptographic Content Hasher & Ingestion Identity
// Guarantees Ingestion Idempotency & Chunk Verification
// ============================================================

/**
 * Standard synchronous SHA-256 implementation (FIPS 180-4 compliant).
 * Runs deterministically across Node.js, Vitest, Browser, and Edge runtimes
 * without external dependencies.
 */
export function computeSha256(input: string): string {
  function rightRotate(value: number, amount: number): number {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i = 0;
  let j = 0;

  let result = '';
  const words: number[] = [];

  // Initial hash values: first 32 bits of the fractional parts of the square roots of the first 8 primes
  let hash: number[] = [];
  // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
  const k: number[] = [];

  let primeCounter = 0;
  const isComposite: Record<number, boolean> = {};

  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = true;
      }
      if (primeCounter < 8) {
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      }
      k[primeCounter] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      primeCounter++;
    }
  }

  // Pre-processing
  const utf8Input = unescape(encodeURIComponent(input));
  for (i = 0; i < utf8Input[lengthProperty]; i++) {
    words[i >> 2] |= utf8Input.charCodeAt(i) << (24 - (i % 4) * 8);
  }

  words[utf8Input[lengthProperty] >> 2] |= 0x80 << (24 - (utf8Input[lengthProperty] % 4) * 8);
  words[(((utf8Input[lengthProperty] + 8) >> 6) << 4) + 15] = utf8Input[lengthProperty] * 8;

  // Process the message in successive 512-bit chunks
  const w: number[] = [];
  for (i = 0; i < words[lengthProperty]; i += 16) {
    const oldHash = hash.slice(0);

    for (j = 0; j < 64; j++) {
      let w15: number, w2: number;
      if (j < 16) {
        w[j] = words[j + i] | 0;
      } else {
        w15 = w[j - 15];
        w2 = w[j - 2];
        const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
        const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
        w[j] = (((w[j - 16] + s0) | 0) + ((w[j - 7] + s1) | 0)) | 0;
      }

      const s0 = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const t2 = (s0 + maj) | 0;
      const s1 = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const t1 = (((((hash[7] + s1) | 0) + ch) | 0) + ((k[j] + w[j]) | 0)) | 0;

      hash[7] = hash[6];
      hash[6] = hash[5];
      hash[5] = hash[4];
      hash[4] = (hash[3] + t1) | 0;
      hash[3] = hash[2];
      hash[2] = hash[1];
      hash[1] = hash[0];
      hash[0] = (t1 + t2) | 0;
    }

    for (j = 0; j < 8; j++) {
      hash[j] = (hash[j] + oldHash[j]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }

  return result;
}

/**
 * Computes deterministic ingestion key to guarantee idempotent indexing:
 * IngestionKey = SHA256(sourceId + sourceVersion + contentHash + parserVersion)
 */
export function computeIngestionKey(
  sourceId: string,
  sourceVersion: string,
  contentHash: string,
  parserVersion: string
): string {
  const payload = `${sourceId}::${sourceVersion}::${contentHash}::${parserVersion}`;
  return computeSha256(payload);
}

/**
 * Computes deterministic, unique Chunk ID for citation binding:
 * e.g., "chunk-ah-su-1-11"
 */
export function computeChunkId(
  sourceId: string,
  chapter: string,
  section: string,
  verseOrPage: string | number
): string {
  const normalized = `${sourceId}-${section}-${chapter}-${verseOrPage}`
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-');
  return `chunk-${normalized}`;
}
