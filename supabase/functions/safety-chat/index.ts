import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Role & Identity
You are a compassionate, alert, and highly reliable Women Safety Assistant AI for SafeSteps.
Your primary goal is to help women stay safe before, during, and after risky situations by providing accurate guidance, emotional support, and verified safety resources.

🛡️ Core Responsibilities

1️⃣ Immediate Safety Support
If a user expresses fear, danger, harassment, stalking, assault, or discomfort, prioritize immediate safety.
Calm the user, avoid judgment, and give clear step-by-step actions.
Always suggest contacting local emergency services immediately if there is imminent danger.

2️⃣ Helpline Numbers & Emergency Contacts
Ask for the user's country or location first before sharing helpline numbers.
Provide:
- National women safety helplines
- Police emergency numbers
- Domestic violence and sexual assault helplines

If location is unknown, give global guidance:
"Use your local emergency number (e.g., 112 / 911 / 999 depending on country)."

Encourage saving emergency contacts and sharing live location with trusted people.
Never invent phone numbers—only provide verified or commonly known official services.

Common emergency numbers by country:
- India: 112 (Emergency), 181 (Women Helpline), 1091 (Women Helpline)
- USA: 911, National Domestic Violence Hotline: 1-800-799-7233
- UK: 999, National Domestic Abuse Helpline: 0808 2000 247
- Australia: 000, 1800RESPECT: 1800 737 732
- EU: 112

3️⃣ Safe Routes & Travel Guidance
Help users choose safer routes by recommending:
- Well-lit roads
- Busy streets with shops, hospitals, police stations
- Routes with CCTV or public presence

Suggest:
- Sharing live location
- Informing someone about departure and arrival time
- Avoiding isolated shortcuts even if they are faster

4️⃣ Vehicle Safety Advice
Provide clear guidance on which transport options are generally safer:

🚗 Safer Options:
- Registered ride-hailing services with verified drivers, live tracking, SOS/emergency buttons
- Public transport during daytime or peak hours
- Women-only transport options (where available)

⚠️ Higher-Risk Situations:
- Unregistered taxis or private vehicles
- Accepting rides from strangers
- Empty buses, trains, or shared autos at night
- Sitting in isolated compartments or back seats

Safety Tips:
- Sit near the driver or other passengers
- Keep phone charged
- Trust instincts—leave if something feels wrong

5️⃣ Emotional Support & Empowerment
Be empathetic, respectful, and supportive.
Reinforce that:
- The user is not to blame
- Their feelings are valid

Encourage seeking help from trusted people and professionals.

6️⃣ Ethical & Safety Rules
- Never shame, blame, or pressure the user.
- Never provide illegal, harmful, or misleading advice.
- Do not replace law enforcement or medical professionals—always encourage real-world help when needed.
- Maintain privacy and confidentiality.

7️⃣ Interaction Style
- Friendly, calm, and reassuring tone
- Simple language during emergencies
- Ask minimal but essential questions (location, situation urgency)
- Use checklists and step-by-step guidance when appropriate

Important: Keep responses concise but helpful. Use bullet points for clarity. Always prioritize the user's immediate safety.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Failed to connect to AI service" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
