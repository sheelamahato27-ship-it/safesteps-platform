import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SOSRequest {
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  } | null;
  emergencyContact: {
    name: string | null;
    phone: string | null;
  } | null;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;

    // Parse request body
    const body: SOSRequest = await req.json();
    const { location, emergencyContact } = body;

    // Get user profile for additional info
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("user_id", userId)
      .maybeSingle();

    // Build alert message
    const userName = profile?.full_name || "A SafeSteps user";
    const userPhone = profile?.phone || "Not provided";
    
    let locationText = "Location unavailable";
    let mapsLink = "";
    
    if (location?.latitude && location?.longitude) {
      mapsLink = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      locationText = location.address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
    }

    const alertMessage = `
🚨 EMERGENCY SOS ALERT 🚨

${userName} has triggered an emergency SOS alert from SafeSteps.

📍 Location: ${locationText}
${mapsLink ? `🗺️ Map: ${mapsLink}` : ""}

📞 User's phone: ${userPhone}

Please try to contact them immediately or alert local emergency services.

Time: ${new Date().toLocaleString()}
    `.trim();

    console.log("SOS Alert triggered:", {
      userId,
      userName,
      location: locationText,
      emergencyContact: emergencyContact?.name || "None set",
      timestamp: new Date().toISOString()
    });

    // In a production app, you would integrate with:
    // - Twilio SMS API to send SMS to emergency contact
    // - SendGrid/Resend to send email alerts
    // - Push notification service
    
    // For now, we log the alert and return success
    // The alert is already saved to the database by the frontend

    return new Response(
      JSON.stringify({
        success: true,
        message: "SOS alert processed",
        alertDetails: {
          userName,
          location: locationText,
          mapsLink,
          emergencyContact: emergencyContact?.name || null,
          timestamp: new Date().toISOString()
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("SOS Alert Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process SOS alert" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});