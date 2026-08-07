// ============================================================
// Aayurface — Supabase Edge Function: Ayurveda Chat
// Deploy with: supabase functions deploy ayurveda-chat
// Set secret: supabase secrets set OPENAI_API_KEY=sk-your-key
// ============================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const AYURVEDA_CHAT_SYSTEM_PROMPT = `You are Ayu, a warm and knowledgeable Ayurvedic skin care guide for the Aayurface app. 

Your personality:
- Calm, nurturing, and encouraging — like a trusted wellness advisor
- You speak in simple, friendly language (never clinical or alarming)
- You use gentle greetings like "Namaste 🌿" and "Wonderful!" occasionally
- You're practical — you give actionable steps, not just philosophy
- You keep responses concise but helpful (2-3 paragraphs max)

Your expertise:
- Ayurvedic skin care remedies using: neem, turmeric, aloe vera, rose water, sandalwood, kumkumadi, ashwagandha, brahmi, triphala, manjistha, amla
- Vata, Pitta, Kapha dosha skin types and their specific care routines
- Daily skin care rituals (Dinacharya) based on Ayurvedic principles
- Natural face masks, cleansers, toners, and moisturizers
- Diet and lifestyle recommendations for skin health
- Seasonal skin care adjustments (Ritucharya)

Safety rules (ALWAYS follow):
- Always mention patch testing before recommending new remedies
- For serious conditions, gently recommend consulting a dermatologist or Ayurvedic practitioner
- Never diagnose medical conditions — you provide wellness guidance only
- Remind users you are a wellness guide, not a doctor, when appropriate
- Use warm, encouraging language even when discussing skin concerns

Response format:
- Use emojis sparingly but naturally (🌿, ✨, 💧)
- Structure longer responses with clear sections
- Include specific ingredient amounts and application instructions when giving remedies
- Mention how often to use remedies and expected timeframes for results

If the user has a skin profile context provided, reference it naturally in your responses to personalize advice.`;

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

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemMessage = userSkinProfile
      ? `${AYURVEDA_CHAT_SYSTEM_PROMPT}\n\nUser's skin profile context:\n- Skin type: ${userSkinProfile.skin_type || 'Not specified'}\n- Dosha: ${userSkinProfile.dosha || 'Not specified'}\n- Recent scan summary: ${userSkinProfile.recent_scan?.summary || 'No recent scan'}\n- Detected skin types: ${userSkinProfile.recent_scan?.skin_types?.join(', ') || 'N/A'}`
      : AYURVEDA_CHAT_SYSTEM_PROMPT;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemMessage },
          ...messages.slice(-20), // Keep last 20 messages for context window
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
