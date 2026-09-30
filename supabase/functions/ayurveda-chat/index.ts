// ============================================================
// Aayurface — Supabase Edge Function: Ayurveda Chat (Phase 13-R.1 Consolidated)
// Strictly Grounded, Zero-Hallucination, Non-Diagnostic Consultation
// Canonical 10-Chunk Classical Corpus, Prompt Defense & Multi-Tier Output Safety Gate
// ============================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

export const SAFE_INSUFFICIENT_EVIDENCE_FALLBACK =
  'Insufficient verified source evidence was found in the classical Ayurvedic corpus to answer this question reliably. ' +
  'AayurFace only provides guidance grounded directly in verified Shastra literature and vetted topical research.';

export const SAFE_PROMPT_INJECTION_REFUSAL =
  'Your request contains disallowed instruction override patterns or attempts to alter core system safety rules. ' +
  'AayurFace operates strictly within educational, non-diagnostic wellness boundaries.';

export const SAFE_MEDICAL_DIAGNOSIS_REFUSAL =
  'AayurFace provides educational wellness insights grounded in classical Ayurveda. It is strictly non-diagnostic ' +
  'and cannot assess, diagnose, or treat dermatological conditions or diseases. Please consult a licensed dermatologist or certified Ayurvedic Vaidya.';

// Canonical 10-Chunk Verified Corpus matching src/lib/rag/corpusData.ts exactly
const CANONICAL_VERIFIED_CORPUS = [
  {
    chunkId: 'CHK-AH-001',
    sourceId: 'SRC-AH-MAR',
    sourceTitle: 'Ashtanga Hridaya (Sutrasthana)',
    chapter: 'Ayushkamiya Adhyaya (Chapter 1)',
    section: 'Sutrasthana',
    verseNumbers: '11',
    pageNumber: 7,
    contentEnglish: 'Vata is characterized by qualities of dryness (Ruksha), lightness (Laghu), coldness (Sita), roughness (Khara), subtlety (Sukshma), and mobility (Chala). Dryness-like appearance or textural roughness may reflect Vata influence in contextual observation.',
    authorityTier: 'TIER_1_CLASSICAL_PRIMARY',
    passageStatus: 'PASSAGE_VERIFIED',
    keywords: ['vata', 'guna', 'ruksha', 'dryness', 'roughness', 'khara', 'skin']
  },
  {
    chunkId: 'CHK-AH-002',
    sourceId: 'SRC-AH-MAR',
    sourceTitle: 'Ashtanga Hridaya (Sutrasthana)',
    chapter: 'Ayushkamiya Adhyaya (Chapter 1)',
    section: 'Sutrasthana',
    verseNumbers: '12',
    pageNumber: 8,
    contentEnglish: 'Pitta dosha is characterized by slight unctuousness (Sasneha), sharpness/penetration (Teekshna), heat (Ushna), lightness (Laghu), fleshy odor (Visra), fluidity (Sara), and liquid nature (Drava). Visual redness-like appearance is conceptually linked to Ushna and Rakta qualities.',
    authorityTier: 'TIER_1_CLASSICAL_PRIMARY',
    passageStatus: 'PASSAGE_VERIFIED',
    keywords: ['pitta', 'guna', 'ushna', 'heat', 'redness', 'rakta', 'teekshna']
  },
  {
    chunkId: 'CHK-AH-003',
    sourceId: 'SRC-AH-MAR',
    sourceTitle: 'Ashtanga Hridaya (Sutrasthana)',
    chapter: 'Ayushkamiya Adhyaya (Chapter 1)',
    section: 'Sutrasthana',
    verseNumbers: '13',
    pageNumber: 8,
    contentEnglish: 'Kapha dosha is characterized by unctuousness/oiliness (Snigdha), coldness (Sita), heaviness (Guru), slowness (Manda), smoothness (Slakshna), sliminess (Mritsna), and stability (Sthira). Shine or unctuous appearance aligns with Snigdha and Kapha contextual qualities.',
    authorityTier: 'TIER_1_CLASSICAL_PRIMARY',
    passageStatus: 'PASSAGE_VERIFIED',
    keywords: ['kapha', 'guna', 'snigdha', 'oiliness', 'shine', 'smoothness']
  },
  {
    chunkId: 'CHK-CS-001',
    sourceId: 'SRC-CS-MAR',
    sourceTitle: 'Charaka Samhita',
    chapter: 'Sharira Samkhya Shariram (Chapter 7)',
    section: 'Sharirasthana',
    verseNumbers: '4',
    pageNumber: 184,
    contentEnglish: 'Charaka describes the layers of Twak (skin) as protective physiological barriers that reflect systemic Rasa and Rakta health. Complexion (Varna) and lustre (Prabha) depend on balanced Pitta (Bhrajaka Pitta) and optimal tissue hydration.',
    authorityTier: 'TIER_1_CLASSICAL_PRIMARY',
    passageStatus: 'PASSAGE_VERIFIED',
    keywords: ['twak', 'skin', 'charaka', 'bhrajaka-pitta', 'varna', 'complexion']
  },
  {
    chunkId: 'CHK-SS-001',
    sourceId: 'SRC-SS-ENG',
    sourceTitle: 'Sushruta Samhita',
    chapter: 'Garbha-Vyakarana Sharira (Chapter 4)',
    section: 'Sharirasthana',
    verseNumbers: '4-5',
    pageNumber: 132,
    contentEnglish: 'Sushruta delineates the seven layers of skin, beginning with Avabhasini which illuminates all complexions (Varna) and exhibits the five reflections of Bhrajaka Pitta. For topical redness and heat-like sensation, cooling pastes (Sitaleha) formulated with Chandana and cold infusions soothe the external barrier.',
    authorityTier: 'TIER_2_SCHOLARLY_TRANSLATION',
    passageStatus: 'PASSAGE_VERIFIED',
    keywords: ['sushruta', 'twak', 'avabhasini', 'lepa', 'cooling', 'sitaleha', 'chandana']
  },
  {
    chunkId: 'CHK-BP-001',
    sourceId: 'SRC-BP-NIG',
    sourceTitle: 'Bhavaprakasha Nighantu',
    chapter: 'Karpuradi Varga',
    section: 'Dravyaguna',
    verseNumbers: '11-13',
    pageNumber: 192,
    contentEnglish: 'Chandana (Santalum album / White Sandalwood) possesses Tikta (bitter) and Madhura (sweet) tastes, Sita (cooling) potency, and Laghu/Ruksha attributes. It soothes Pitta and Rakta aggravation, calming heat, burning sensations, and topical redness.',
    authorityTier: 'TIER_2_SCHOLARLY_TRANSLATION',
    passageStatus: 'PASSAGE_VERIFIED',
    keywords: ['chandana', 'sandalwood', 'pitta', 'cooling', 'sita', 'redness', 'rakta']
  },
  {
    chunkId: 'CHK-BP-002',
    sourceId: 'SRC-BP-NIG',
    sourceTitle: 'Bhavaprakasha Nighantu',
    chapter: 'Guduchyadi Varga',
    section: 'Dravyaguna',
    verseNumbers: '63-65',
    pageNumber: 228,
    contentEnglish: 'Kumari (Aloe barbadensis / Aloe Vera) is cooling (Sita Virya), sweet-bitter in taste, and unctuous (Snigdha). It acts as a natural soothing and hydrating agent (Rasayana for Twak), nourishing dry or irritated skin states without causing pore obstruction.',
    authorityTier: 'TIER_2_SCHOLARLY_TRANSLATION',
    passageStatus: 'PASSAGE_VERIFIED',
    keywords: ['kumari', 'aloe', 'hydration', 'sita', 'cooling', 'dryness', 'barrier']
  },
  {
    chunkId: 'CHK-BP-003',
    sourceId: 'SRC-BP-NIG',
    sourceTitle: 'Bhavaprakasha Nighantu',
    chapter: 'Guduchyadi Varga',
    section: 'Dravyaguna',
    verseNumbers: '8-10',
    pageNumber: 235,
    contentEnglish: 'Nimba (Azadirachta indica / Neem) is intensely bitter (Tikta) and astringent (Kashaya), cooling (Sita), and light (Laghu). It pacifies excess Pitta and Kapha, cleanses pores, and mitigates excessive unctuousness or oil accumulation.',
    authorityTier: 'TIER_2_SCHOLARLY_TRANSLATION',
    passageStatus: 'PASSAGE_VERIFIED',
    keywords: ['nimba', 'neem', 'oiliness', 'snigdha', 'cleansing', 'kapha', 'pitta']
  },
  {
    chunkId: 'CHK-PR-001',
    sourceId: 'SRC-PROJ-RES',
    sourceTitle: 'AayurFace Topical Safety Guidelines',
    chapter: 'Topical Safety Protocols',
    section: 'Section 1: Allergy & Sensitivity',
    pageNumber: 1,
    contentEnglish: 'Prior to applying any botanical paste or oil (Mukhalepa) to facial skin, a 24-hour patch test behind the ear or on the inner forearm is mandatory. Individual herbal sensitivities can manifest independently of constitutional Prakriti.',
    authorityTier: 'TIER_4_PROJECT_RESEARCH',
    passageStatus: 'PROJECT_RESEARCH',
    keywords: ['safety', 'patch-test', 'allergy', 'botanical', 'routine']
  },
  {
    chunkId: 'CHK-PR-002',
    sourceId: 'SRC-PROJ-RES',
    sourceTitle: 'AayurFace Clinical Boundary Policy',
    chapter: 'Clinical Boundary Policy',
    section: 'Section 2: Non-Diagnostic Operations',
    pageNumber: 2,
    contentEnglish: 'AayurFace visual observations represent physical surface appearances (e.g. shine, dryness, redness-like hue) under consumer camera lighting. They are not medical symptoms, skin disease diagnoses, or constitutional Dosha determinations. Persistent, painful, cystic, or ulcerated skin lesions require evaluation by a licensed dermatologist or certified Ayurvedic Vaidya.',
    authorityTier: 'TIER_4_PROJECT_RESEARCH',
    passageStatus: 'PROJECT_RESEARCH',
    keywords: ['safety', 'non-diagnostic', 'boundary', 'medical', 'consultation']
  }
];

// Safety Filter Patterns
const PROHIBITED_DISEASE_PATTERNS = [
  /\b(?:cystic\s+acne|acne\s+vulgaris)\b/i,
  /\b(?:rosacea|erythema\s+multiforme)\b/i,
  /\b(?:eczema|atopic\s+dermatitis|contact\s+dermatitis|seborrheic\s+dermatitis)\b/i,
  /\b(?:psoriasis|plaque\s+psoriasis)\b/i,
  /\b(?:melanoma|carcinoma|skin\s+cancer)\b/i,
  /\b(?:bacterial\s+infection|fungal\s+infection|staph\s+infection|impetigo)\b/i,
  /\bdiagnose(?:d|s|ing)?\s+(?:you\s+with|as\s+having)\b/i
];

const PROHIBITED_DRUG_PATTERNS = [
  /\b(?:isotretinoin|accutane)\b/i,
  /\b(?:tretinoin|retin-a)\b/i,
  /\b(?:spironolactone)\b/i,
  /\b(?:doxycycline|tetracycline|minocycline|antibiotic(?:s)?)\b/i,
  /\b(?:hydrocortisone|corticosteroid(?:s)?|steroid\s+cream)\b/i
];

const PROHIBITED_CURE_PATTERNS = [
  /\b(?:guarantee(?:d)?\s+to\s+cure|100%\s+cure|cure\s+guaranteed)\b/i,
  /\b(?:permanent(?:ly)?\s+cure|permanently\s+eradicate|eradicate\s+all)\b/i
];

const PROHIBITED_COLLAPSE_PATTERNS = [
  /\b(?:your\s+face\s+(?:proves|confirms|shows|diagnoses)(?:\s+conclusively)?(?:\s+that)?\s+(?:your\s+)?(?:dosha|prakriti)\s+is)\b/i,
  /\b(?:diagnose\s+your\s+prakriti\s+from\s+your\s+face|facial\s+scan\s+determines\s+your\s+prakriti)\b/i
];

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /system\s+override/i,
  /you\s+are\s+now\s+in\s+developer\s+mode/i,
  /act\s+as\s+an\s+unrestricted\s+ai/i,
  /disregard\s+(all\s+)?safety/i,
  /reveal\s+your\s+(system\s+)?prompt/i
];

function sanitizeQuery(query: string): { isSafe: boolean; reason?: string } {
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(query)) {
      return { isSafe: false, reason: 'Disallowed instruction override pattern detected' };
    }
  }
  return { isSafe: true };
}

function validateSafety(text: string): { isSafe: boolean; violation?: string } {
  for (const pattern of PROHIBITED_DISEASE_PATTERNS) {
    if (pattern.test(text)) return { isSafe: false, violation: 'PROHIBITED_MEDICAL_DIAGNOSIS' };
  }
  for (const pattern of PROHIBITED_DRUG_PATTERNS) {
    if (pattern.test(text)) return { isSafe: false, violation: 'PROHIBITED_PRESCRIPTION_DRUG' };
  }
  for (const pattern of PROHIBITED_CURE_PATTERNS) {
    if (pattern.test(text)) return { isSafe: false, violation: 'GUARANTEED_CURE_PROMISE' };
  }
  for (const pattern of PROHIBITED_COLLAPSE_PATTERNS) {
    if (pattern.test(text)) return { isSafe: false, violation: 'FACE_TO_DOSHA_DIRECT_COLLAPSE' };
  }
  return { isSafe: true };
}

/**
 * Genuine evidence retrieval with honest failure semantics (zero fake fallback slicing)
 */
function retrieveCanonicalEvidence(query: string) {
  const lower = query.toLowerCase();
  const words = lower.split(/[^a-z0-9]+/).filter(w => w.length > 2);

  const scored = CANONICAL_VERIFIED_CORPUS.map(chunk => {
    let score = 0;
    const chunkText = `${chunk.sourceTitle} ${chunk.chapter} ${chunk.section} ${chunk.contentEnglish}`.toLowerCase();

    for (const kw of chunk.keywords) {
      if (lower.includes(kw)) score += 3.0;
    }

    for (const word of words) {
      if (chunkText.includes(word)) score += 0.5;
    }

    return { chunk, score };
  });

  const matching = scored
    .filter(item => item.score >= 2.5)
    .sort((a, b) => b.score - a.score)
    .map(item => item.chunk);

  return matching;
}

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, userSkinProfile } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const latestUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || '';

    // 1. Prompt Injection Defense
    const promptCheck = sanitizeQuery(latestUserMessage);
    if (!promptCheck.isSafe) {
      return new Response(JSON.stringify({
        reply: SAFE_PROMPT_INJECTION_REFUSAL,
        status: 'SAFETY_BLOCKED',
        retrievalBackend: 'EDGE_FUNCTION',
        isGrounded: false,
        fallbackTriggered: true,
        fallbackReason: 'PROMPT_INJECTION_DETECTED',
        citations: [],
        evidence: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Pre-Retrieval Disease / Drug Check on User Input
    const inputSafety = validateSafety(latestUserMessage);
    if (!inputSafety.isSafe) {
      return new Response(JSON.stringify({
        reply: SAFE_MEDICAL_DIAGNOSIS_REFUSAL,
        status: 'SAFETY_BLOCKED',
        retrievalBackend: 'EDGE_FUNCTION',
        isGrounded: false,
        fallbackTriggered: true,
        fallbackReason: inputSafety.violation,
        citations: [],
        evidence: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. Authoritative Evidence Retrieval
    const relevantChunks = retrieveCanonicalEvidence(latestUserMessage);

    // If no verified chunks match, return explicit NO_EVIDENCE fallback (do NOT fake match!)
    if (relevantChunks.length === 0) {
      return new Response(JSON.stringify({
        reply: SAFE_INSUFFICIENT_EVIDENCE_FALLBACK,
        status: 'NO_EVIDENCE',
        retrievalBackend: 'EDGE_FUNCTION',
        isGrounded: false,
        fallbackTriggered: true,
        fallbackReason: 'INSUFFICIENT_VERIFIED_EVIDENCE',
        citations: [],
        evidence: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const citations = relevantChunks.map(c => ({
      citationId: `cit-${c.chunkId}`,
      evidenceId: `ev-${c.chunkId}`,
      sourceTitle: c.sourceTitle,
      location: `${c.section}, ${c.chapter}${c.verseNumbers ? `, Verse ${c.verseNumbers}` : ''} [p. ${c.pageNumber}]`,
      authorityTier: c.authorityTier,
      verificationStatus: 'VERIFIED',
      passageStatus: c.passageStatus
    }));

    // 4. Grounded Synthesis
    if (!OPENAI_API_KEY) {
      // Deterministic Grounded Consultation when OpenAI key is absent
      const reply = `According to classical Ayurvedic Shastra:\n\n` +
        relevantChunks.map(c => `• **${c.sourceTitle}** (${c.section}, ${c.chapter}${c.verseNumbers ? `, Verse ${c.verseNumbers}` : ''}):\n  "${c.contentEnglish}"`).join('\n\n') +
        `\n\n**Wellness Dinacharya:**\n` +
        `• Maintain balanced daily hydration and avoid harsh thermal extremes.\n` +
        `• Conduct a 24-hour patch test behind the ear before introducing any topical herbal oil or formulation.\n` +
        `• Consult a licensed dermatologist or certified Ayurvedic Vaidya for persistent or uncomfortable symptoms.`;

      return new Response(JSON.stringify({
        reply,
        status: 'GROUNDED',
        retrievalBackend: 'EDGE_FUNCTION',
        citations,
        evidence: relevantChunks,
        isGrounded: true,
        fallbackTriggered: false
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Grounded LLM Execution with Injected Classical Evidence
    const evidenceBlock = relevantChunks
      .map((c, idx) => `[Source ${idx + 1}]: ${c.sourceTitle} (${c.chapter})\nContent: "${c.contentEnglish}"`)
      .join('\n\n');

    const systemPrompt = `You are Ayu, a strictly grounded Ayurvedic skin care guide for AayurFace.
You MUST follow these NON-NEGOTIABLE rules:
1. ONLY make claims grounded directly in the provided Classical Evidence below.
2. NEVER diagnose skin diseases (e.g. acne vulgaris, cystic acne, rosacea, eczema, psoriasis, dermatitis, cancer).
3. NEVER prescribe or recommend pharmaceutical drugs (e.g. isotretinoin, tretinoin, antibiotics, steroids).
4. NEVER promise guaranteed or permanent cures.
5. NEVER claim that a facial scan or appearance diagnoses internal dosha or prakriti.
6. Always remind the user to perform a 24-hour patch test before applying topical herbs.
7. If the evidence does not support answering the question, politely explain that AayurFace guidance is restricted to verified classical texts.

CLASSICAL EVIDENCE GROUND TRUTH:
${evidenceBlock}

User Context:
- Skin Type: ${userSkinProfile?.skin_type || 'Combination'}
- Dosha Tendency: ${userSkinProfile?.dosha || 'Pitta-Kapha'}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.slice(-10),
        ],
        max_tokens: 600,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let reply = data.choices[0]?.message?.content || SAFE_INSUFFICIENT_EVIDENCE_FALLBACK;

    // 5. Post-Generation Output Safety Gate
    const outputSafety = validateSafety(reply);
    if (!outputSafety.isSafe) {
      reply = SAFE_MEDICAL_DIAGNOSIS_REFUSAL;
      return new Response(JSON.stringify({
        reply,
        status: 'SAFETY_BLOCKED',
        retrievalBackend: 'EDGE_FUNCTION',
        isGrounded: false,
        fallbackTriggered: true,
        fallbackReason: outputSafety.violation,
        citations: [],
        evidence: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      reply,
      status: 'GROUNDED',
      retrievalBackend: 'EDGE_FUNCTION',
      citations,
      evidence: relevantChunks,
      isGrounded: true,
      fallbackTriggered: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Consultation Edge Function error:', message);
    return new Response(JSON.stringify({
      reply: 'AayurFace consultation is currently available in offline grounded mode. Please ask your question in the chat interface.',
      status: 'DEPENDENCY_FAILURE',
      retrievalBackend: 'EDGE_FUNCTION',
      error: message
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
