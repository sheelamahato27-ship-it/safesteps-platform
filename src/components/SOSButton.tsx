import { useState, useEffect, useCallback } from "react";
import { AlertTriangle, Phone, X, MapPin, Shield, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EmergencyContact {
  name: string | null;
  phone: string | null;
}

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

export const SOSButton = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact | null>(null);
  const [alertSent, setAlertSent] = useState(false);

  // Fetch emergency contact on mount
  useEffect(() => {
    if (user) {
      fetchEmergencyContact();
    }
  }, [user]);

  const fetchEmergencyContact = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("profiles")
      .select("emergency_contact_name, emergency_contact_phone")
      .eq("user_id", user.id)
      .maybeSingle();
    
    if (data) {
      setEmergencyContact({
        name: data.emergency_contact_name,
        phone: data.emergency_contact_phone
      });
    }
  };

  const getCurrentLocation = useCallback((): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };

          // Try to get address from coordinates (reverse geocoding)
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            );
            const data = await response.json();
            if (data.display_name) {
              locationData.address = data.display_name;
            }
          } catch (e) {
            console.log("Could not fetch address:", e);
          }

          resolve(locationData);
        },
        (error) => {
          console.error("Geolocation error:", error);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }, []);

  const startCountdown = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to use the SOS feature.",
        variant: "destructive"
      });
      return;
    }

    setIsActivating(true);
    setCountdown(5);

    // Get location while counting down
    try {
      const loc = await getCurrentLocation();
      setLocation(loc);
    } catch (e) {
      console.error("Location error:", e);
      toast({
        title: "Location unavailable",
        description: "SOS will be sent without precise location.",
      });
    }
  };

  // Handle countdown
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      triggerSOS();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const cancelSOS = () => {
    setCountdown(null);
    setIsActivating(false);
    toast({
      title: "SOS Cancelled",
      description: "Emergency alert was cancelled.",
    });
  };

  const triggerSOS = async () => {
    if (!user) return;

    try {
      // Log SOS alert to database
      const { error: dbError } = await supabase
        .from("sos_alerts")
        .insert({
          user_id: user.id,
          latitude: location?.latitude || null,
          longitude: location?.longitude || null,
          address: location?.address || null,
          status: "active"
        });

      if (dbError) {
        console.error("Error logging SOS:", dbError);
      }

      // Call edge function to send alerts
      const { data: session } = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-sos-alert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.session?.access_token}`
          },
          body: JSON.stringify({
            location,
            emergencyContact
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send SOS alert");
      }

      setAlertSent(true);
      setCountdown(null);
      setIsActivating(false);

      toast({
        title: "🚨 SOS Alert Sent!",
        description: emergencyContact?.phone 
          ? `Alert sent to ${emergencyContact.name || "your emergency contact"}`
          : "Alert logged. Add an emergency contact for notifications.",
      });

    } catch (error) {
      console.error("SOS error:", error);
      toast({
        title: "Alert logged",
        description: "Your SOS was recorded. Share your location manually if needed.",
      });
      setAlertSent(true);
      setCountdown(null);
      setIsActivating(false);
    }
  };

  const resetSOS = () => {
    setAlertSent(false);
    setIsExpanded(false);
    setLocation(null);
  };

  const callEmergency = () => {
    window.location.href = "tel:911";
  };

  if (!user) return null;

  return (
    <>
      {/* Floating SOS Button */}
      <div className="fixed bottom-24 right-6 z-50">
        {!isExpanded && !isActivating && !alertSent && (
          <button
            onClick={() => setIsExpanded(true)}
            className="group relative w-16 h-16 rounded-full bg-danger text-white shadow-lg hover:shadow-danger/50 transition-all duration-300 hover:scale-110 animate-pulse-slow"
            aria-label="SOS Emergency"
          >
            <div className="absolute inset-0 rounded-full bg-danger animate-ping opacity-25" />
            <AlertTriangle className="w-8 h-8 mx-auto" />
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-danger whitespace-nowrap">
              SOS
            </span>
          </button>
        )}

        {/* Expanded SOS Panel */}
        {isExpanded && !isActivating && !alertSent && (
          <div className="glass rounded-2xl p-4 w-72 border border-danger/30 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5 text-danger" />
                Emergency SOS
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              This will alert your emergency contact with your current location.
            </p>

            {emergencyContact?.phone ? (
              <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                Will notify: {emergencyContact.name || emergencyContact.phone}
              </p>
            ) : (
              <p className="text-xs text-warning mb-4">
                ⚠️ No emergency contact set. Add one in your profile.
              </p>
            )}

            <div className="space-y-2">
              <Button
                onClick={startCountdown}
                variant="emergency"
                className="w-full gap-2"
                size="lg"
              >
                <AlertTriangle className="w-5 h-5" />
                Activate SOS
              </Button>

              <Button
                onClick={callEmergency}
                variant="outline"
                className="w-full gap-2 border-danger/30 text-danger hover:bg-danger/10"
              >
                <Phone className="w-4 h-4" />
                Call 911
              </Button>
            </div>
          </div>
        )}

        {/* Countdown State */}
        {isActivating && countdown !== null && (
          <div className="glass rounded-2xl p-6 w-72 border border-danger/50 shadow-2xl animate-scale-in text-center">
            <div className="mb-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-danger/20 border-4 border-danger flex items-center justify-center animate-pulse">
                <span className="text-4xl font-bold text-danger">{countdown}</span>
              </div>
            </div>

            <p className="text-foreground font-medium mb-2">Sending SOS in {countdown}s</p>
            
            {location ? (
              <p className="text-xs text-safe flex items-center justify-center gap-1 mb-4">
                <MapPin className="w-3 h-3" />
                Location acquired
              </p>
            ) : (
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mb-4">
                <Loader2 className="w-3 h-3 animate-spin" />
                Getting location...
              </p>
            )}

            <Button
              onClick={cancelSOS}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        )}

        {/* Alert Sent State */}
        {alertSent && (
          <div className="glass rounded-2xl p-6 w-72 border border-safe/50 shadow-2xl animate-scale-in text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-safe/20 border-2 border-safe flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-safe" />
            </div>

            <h3 className="text-lg font-bold text-foreground mb-2">Alert Sent!</h3>
            
            <p className="text-sm text-muted-foreground mb-4">
              Your emergency contact has been notified with your location.
            </p>

            {location?.address && (
              <p className="text-xs text-muted-foreground mb-4 flex items-start gap-1">
                <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span className="text-left">{location.address}</span>
              </p>
            )}

            <div className="space-y-2">
              <Button
                onClick={callEmergency}
                variant="emergency"
                className="w-full gap-2"
              >
                <Phone className="w-4 h-4" />
                Call 911
              </Button>

              <Button
                onClick={resetSOS}
                variant="ghost"
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};