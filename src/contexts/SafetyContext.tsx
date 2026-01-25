import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp: Date;
}

interface SafetyContextType {
  isSafetyActive: boolean;
  activateSafety: () => void;
  deactivateSafety: () => void;
  currentLocation: LocationData | null;
  isLocationSharing: boolean;
  startLocationSharing: () => void;
  stopLocationSharing: () => void;
  locationHistory: LocationData[];
}

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export const SafetyProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isSafetyActive, setIsSafetyActive] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isLocationSharing, setIsLocationSharing] = useState(false);
  const [locationHistory, setLocationHistory] = useState<LocationData[]>([]);
  const [watchId, setWatchId] = useState<number | null>(null);

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
            longitude: position.coords.longitude,
            timestamp: new Date()
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

  const activateSafety = useCallback(async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to activate safety features.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get current location
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      setIsSafetyActive(true);
      
      // Start continuous location tracking
      if (navigator.geolocation) {
        const id = navigator.geolocation.watchPosition(
          async (position) => {
            const newLocation: LocationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: new Date()
            };
            setCurrentLocation(newLocation);
            setLocationHistory(prev => [...prev.slice(-99), newLocation]); // Keep last 100 locations
          },
          (error) => console.error("Watch position error:", error),
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );
        setWatchId(id);
      }

      toast({
        title: "Safety Activated",
        description: "All safety features are now enabled. Stay safe!",
      });
    } catch (error) {
      toast({
        title: "Location Error",
        description: "Could not get your location. Some features may be limited.",
        variant: "destructive"
      });
      setIsSafetyActive(true); // Still activate other features
    }
  }, [user, getCurrentLocation, toast]);

  const deactivateSafety = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsSafetyActive(false);
    setIsLocationSharing(false);
    toast({
      title: "Safety Deactivated",
      description: "Safety monitoring has been turned off.",
    });
  }, [watchId, toast]);

  const startLocationSharing = useCallback(async () => {
    if (!user) return;
    
    setIsLocationSharing(true);
    
    // Update preferences in database
    await supabase
      .from("safety_preferences")
      .upsert({
        user_id: user.id,
        share_location_with_contacts: true
      }, { onConflict: 'user_id' });
    
    toast({
      title: "Location Sharing Started",
      description: "Your emergency contacts can now see your location.",
    });
  }, [user, toast]);

  const stopLocationSharing = useCallback(async () => {
    if (!user) return;
    
    setIsLocationSharing(false);
    
    await supabase
      .from("safety_preferences")
      .upsert({
        user_id: user.id,
        share_location_with_contacts: false
      }, { onConflict: 'user_id' });
    
    toast({
      title: "Location Sharing Stopped",
      description: "Your location is no longer being shared.",
    });
  }, [user, toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  // Load preferences on mount
  useEffect(() => {
    if (user) {
      supabase
        .from("safety_preferences")
        .select("share_location_with_contacts")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.share_location_with_contacts) {
            setIsLocationSharing(true);
          }
        });
    }
  }, [user]);

  return (
    <SafetyContext.Provider
      value={{
        isSafetyActive,
        activateSafety,
        deactivateSafety,
        currentLocation,
        isLocationSharing,
        startLocationSharing,
        stopLocationSharing,
        locationHistory
      }}
    >
      {children}
    </SafetyContext.Provider>
  );
};

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (context === undefined) {
    throw new Error("useSafety must be used within a SafetyProvider");
  }
  return context;
};
