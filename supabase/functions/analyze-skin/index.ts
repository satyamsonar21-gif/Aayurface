// ============================================================
// Aayurface — Supabase Edge Function: Skin Analysis
// Deploy with: supabase functions deploy analyze-skin
// Set secret: supabase secrets set OPENAI_API_KEY=sk-your-key
// ============================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const SKIN_ANALYSIS_SYSTEM_PROMPT = `You are a calm, knowledgeable Ayurvedic skin care expert. 
Analyze the provided facial image and return a structured JSON response with the following schema:
{
  "summary": "Brief skin condition label (e.g., 'Oily Skin with Mild Acne')",
  "skin_types": ["array of detected skin type tags, e.g., 'Oily', 'Acne-Prone'"],
  "severity": "mild|moderate|high",
  "causes": [
    {"icon": "emoji", "text": "Cause description in gentle, explanatory language"}
  ],
  "remedies": [
    {
      "name": "Remedy name",
      "ingredient": "Main Ayurvedic ingredient",
      "what_to_use": "Description of what to use",
      "how_to_apply": ["Step 1", "Step 2", "Step 3"],
      "how_often": "Frequency like '3 times per week'"
    }
  ],
  "prevention_tips": [
    {"icon": "emoji", "text": "Prevention tip in warm language"}
  ],
  "serious_condition_flag": false
}

Guidelines:
- Focus exclusively on Ayurvedic remedies using ingredients like neem, turmeric, aloe vera, rose water, sandalwood, kumkumadi, ashwagandha, brahmi, triphala.
- Use warm, non-clinical, nurturing language throughout.
- Always recommend patch testing before trying new remedies.
- If you detect potentially serious conditions (severe cystic acne, deep scarring, unusual lesions), set serious_condition_flag to true and add a gentle advisory in the causes.
- Provide 2-3 remedy suggestions and 4-5 prevention tips.
- Relate causes to Ayurvedic principles (doshas, diet, lifestyle) where appropriate.`;

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { imageBase64, userId } = await req.json();

    if (!imageBase64 || !userId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
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

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SKIN_ANALYSIS_SYSTEM_PROMPT },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Please analyze this facial image for skin conditions and provide Ayurvedic guidance.' },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}`, detail: 'high' } },
            ],
          },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    const analysis = JSON.parse(analysisText);

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Skin analysis error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
