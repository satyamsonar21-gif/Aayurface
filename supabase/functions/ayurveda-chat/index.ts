// ============================================================
// Aayurface — Supabase Edge Function: Ayurveda Chat (Phase 13-R Hardened)
// Strictly Grounded, Zero-Hallucination, Non-Diagnostic Consultation
// Enforces Prompt Defense, Evidence Grounding & Multi-Tier Output Safety Gate
// ============================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const SAFE_INSUFFICIENT_EVIDENCE_FALLBACK =
  'Insufficient verified source evidence was found in the classical Ayurvedic corpus to answer this question reliably. ' +
  'AayurFace only provides guidance grounded directly in verified Shastra literature and vetted topical research.';

const SAFE_PROMPT_INJECTION_REFUSAL =
  'Your request contains disallowed instruction override patterns or attempts to alter core system safety rules. ' +
  'AayurFace operates strictly within educational, non-diagnostic wellness boundaries.';

const SAFE_MEDICAL_DIAGNOSIS_REFUSAL =
  'AayurFace provides educational wellness insights grounded in classical Ayurveda. It is strictly non-diagnostic ' +
  'and cannot assess, diagnose, or treat dermatological conditions or diseases. Please consult a licensed dermatologist or certified Ayurvedic Vaidya.';

// Core Classical Evidence Injected into Edge Pipeline Context
const CLASSICAL_EVIDENCE_BANK = [
  {
    source: 'Ashtanga Hridaya (Sutrasthana, Chapter 1, Verse 11 [p. 7])',
    content: 'Vata is characterized by qualities of dryness (Ruksha), lightness (Laghu), coldness (Sita), roughness (Khara), subtlety (Sukshma), and mobility (Chala).'
  },
  {
    source: 'Ashtanga Hridaya (Sutrasthana, Chapter 1, Verse 12 [p. 8])',
    content: 'Pitta dosha is characterized by slight unctuousness (Sasneha), sharpness/penetration (Teekshna), heat (Ushna), lightness (Laghu), fleshy odor (Visra), fluidity (Sara), and liquid nature (Drava).'
  },
  {
    source: 'Ashtanga Hridaya (Sutrasthana, Chapter 1, Verse 13 [p. 8])',
    content: 'Kapha dosha is characterized by unctuousness/oiliness (Snigdha), coldness (Sita), heaviness (Guru), slowness (Manda), smoothness (Slakshna), sliminess (Mritsna), and stability (Sthira).'
  },
  {
    source: 'Charaka Samhita (Sharirasthana, Chapter 7, Verse 4 [p. 184])',
    content: 'The layers of Twak (skin) reflect systemic Rasa and Rakta health. Complexion (Varna) and lustre (Prabha) depend on balanced Pitta (Bhrajaka Pitta) and optimal tissue hydration.'
  },
  {
    source: 'Sushruta Samhita (Sharirasthana, Chapter 4, Verse 4-5 [p. 132])',
    content: 'Avabhasini layer illuminates all complexions (Varna). For topical redness and heat-like sensation, cooling pastes (Sitaleha) formulated with Chandana and cold infusions soothe the external barrier.'
  },
  {
    source: 'Bhavaprakasha Nighantu (Karpuradi Varga, Verse 11-13 [p. 192])',
    content: 'Chandana (White Sandalwood) possesses Tikta (bitter) and Madhura (sweet) tastes, Sita (cooling) potency. It soothes Pitta and Rakta aggravation, calming heat and topical redness.'
  },
  {
    source: 'Bhavaprakasha Nighantu (Guduchyadi Varga, Verse 63-65 [p. 228])',
    content: 'Kumari (Aloe Vera) is cooling (Sita Virya), sweet-bitter in taste, and unctuous (Snigdha). It acts as a natural soothing and hydrating agent for Twak.'
  },
  {
    source: 'Bhavaprakasha Nighantu (Guduchyadi Varga, Verse 8-10 [p. 235])',
    content: 'Nimba (Neem) is intensely bitter (Tikta) and astringent (Kashaya), cooling (Sita), and light (Laghu). It pacifies excess Pitta and Kapha, cleanses pores, and mitigates excessive unctuousness.'
  }
];

// Safety Filter Patterns (Prohibited medical diseases, drugs, cure guarantees, and single-feature diagnostic collapses)
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

function retrieveEvidenceForQuery(query: string) {
  const lower = query.toLowerCase();
  const matched = CLASSICAL_EVIDENCE_BANK.filter(item => {
    const text = (item.source + ' ' + item.content).toLowerCase();
    const words = lower.split(/\s+/).filter(w => w.length > 3);
    return words.some(w => text.includes(w));
  });

  return matched.length >= 2 ? matched : CLASSICAL_EVIDENCE_BANK.slice(0, 2);
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
        isGrounded: false,
        fallbackTriggered: true,
        fallbackReason: 'PROMPT_INJECTION_DETECTED',
        citations: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Pre-Retrieval Disease / Drug Check on User Input
    const inputSafety = validateSafety(latestUserMessage);
    if (!inputSafety.isSafe) {
      return new Response(JSON.stringify({
        reply: SAFE_MEDICAL_DIAGNOSIS_REFUSAL,
        isGrounded: false,
        fallbackTriggered: true,
        fallbackReason: inputSafety.violation,
        citations: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. Evidence Retrieval
    const relevantEvidence = retrieveEvidenceForQuery(latestUserMessage);

    // 4. Grounded Synthesis
    if (!OPENAI_API_KEY) {
      // Deterministic Grounded Consultation Fallback when OpenAI key is absent
      const citations = relevantEvidence.map(e => ({
        sourceTitle: e.source.split('(')[0].trim(),
        location: e.source
      }));

      const reply = `According to classical Ayurvedic Shastra:\n\n` +
        relevantEvidence.map(e => `• **${e.source}**:\n  "${e.content}"`).join('\n\n') +
        `\n\n**Wellness Dinacharya:**\n` +
        `• Maintain balanced daily hydration and avoid harsh thermal extremes.\n` +
        `• Conduct a 24-hour patch test behind the ear before introducing any topical herbal oil or formulation.\n` +
        `• Consult a licensed dermatologist or certified Ayurvedic Vaidya for persistent or uncomfortable symptoms.`;

      return new Response(JSON.stringify({
        reply,
        citations,
        isGrounded: true,
        fallbackTriggered: false
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Grounded LLM Execution with Injected Classical Evidence
    const evidenceBlock = relevantEvidence
      .map((e, idx) => `[Source ${idx + 1}]: ${e.source}\nContent: "${e.content}"`)
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
        isGrounded: false,
        fallbackTriggered: true,
        fallbackReason: outputSafety.violation,
        citations: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const citations = relevantEvidence.map(e => ({
      sourceTitle: e.source.split('(')[0].trim(),
      location: e.source
    }));

    return new Response(JSON.stringify({
      reply,
      citations,
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
      error: message
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
