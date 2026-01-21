import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Phone, 
  Shield, 
  Car, 
  Plus, 
  Trash2, 
  Save, 
  Bell,
  MapPin,
  Moon,
  Users,
  AlertTriangle,
  Edit2,
  X
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TrustedDriver {
  id: string;
  driver_name: string;
  driver_phone: string;
  vehicle_number: string | null;
  vehicle_type: string | null;
  notes: string | null;
}

interface SafetyPreferences {
  share_location_with_contacts: boolean;
  auto_sos_enabled: boolean;
  sos_delay_seconds: number;
  preferred_route_type: string;
  night_mode_enabled: boolean;
  crowd_alerts_enabled: boolean;
}

interface Profile {
  full_name: string | null;
  phone: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
}

const Profile = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    phone: "",
    emergency_contact_name: "",
    emergency_contact_phone: ""
  });
  
  const [trustedDrivers, setTrustedDrivers] = useState<TrustedDriver[]>([]);
  const [newDriver, setNewDriver] = useState({
    driver_name: "",
    driver_phone: "",
    vehicle_number: "",
    vehicle_type: "",
    notes: ""
  });
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [editingDriver, setEditingDriver] = useState<string | null>(null);
  
  const [preferences, setPreferences] = useState<SafetyPreferences>({
    share_location_with_contacts: true,
    auto_sos_enabled: false,
    sos_delay_seconds: 10,
    preferred_route_type: "safest",
    night_mode_enabled: true,
    crowd_alerts_enabled: true
  });
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchTrustedDrivers();
      fetchPreferences();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user!.id)
      .maybeSingle();
    
    if (data) {
      setProfile({
        full_name: data.full_name || "",
        phone: data.phone || "",
        emergency_contact_name: data.emergency_contact_name || "",
        emergency_contact_phone: data.emergency_contact_phone || ""
      });
    }
    if (error) console.error("Error fetching profile:", error);
  };

  const fetchTrustedDrivers = async () => {
    const { data, error } = await supabase
      .from("trusted_drivers")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    
    if (data) setTrustedDrivers(data);
    if (error) console.error("Error fetching drivers:", error);
  };

  const fetchPreferences = async () => {
    const { data, error } = await supabase
      .from("safety_preferences")
      .select("*")
      .eq("user_id", user!.id)
      .maybeSingle();
    
    if (data) {
      setPreferences({
        share_location_with_contacts: data.share_location_with_contacts ?? true,
        auto_sos_enabled: data.auto_sos_enabled ?? false,
        sos_delay_seconds: data.sos_delay_seconds ?? 10,
        preferred_route_type: data.preferred_route_type ?? "safest",
        night_mode_enabled: data.night_mode_enabled ?? true,
        crowd_alerts_enabled: data.crowd_alerts_enabled ?? true
      });
    }
    if (error) console.error("Error fetching preferences:", error);
  };

  const saveProfile = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        emergency_contact_name: profile.emergency_contact_name,
        emergency_contact_phone: profile.emergency_contact_phone
      })
      .eq("user_id", user!.id);
    
    setSaving(false);
    if (error) {
      toast({ title: "Error saving profile", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile saved", description: "Your profile has been updated successfully." });
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    
    // Try to update first, if no rows affected, insert
    const { data: existing } = await supabase
      .from("safety_preferences")
      .select("id")
      .eq("user_id", user!.id)
      .maybeSingle();

    let error;
    if (existing) {
      const result = await supabase
        .from("safety_preferences")
        .update(preferences)
        .eq("user_id", user!.id);
      error = result.error;
    } else {
      const result = await supabase
        .from("safety_preferences")
        .insert({ ...preferences, user_id: user!.id });
      error = result.error;
    }
    
    setSaving(false);
    if (error) {
      toast({ title: "Error saving preferences", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Preferences saved", description: "Your safety preferences have been updated." });
    }
  };

  const addDriver = async () => {
    if (!newDriver.driver_name || !newDriver.driver_phone) {
      toast({ title: "Missing information", description: "Please provide driver name and phone.", variant: "destructive" });
      return;
    }

    const { error } = await supabase
      .from("trusted_drivers")
      .insert({
        user_id: user!.id,
        driver_name: newDriver.driver_name,
        driver_phone: newDriver.driver_phone,
        vehicle_number: newDriver.vehicle_number || null,
        vehicle_type: newDriver.vehicle_type || null,
        notes: newDriver.notes || null
      });

    if (error) {
      toast({ title: "Error adding driver", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Driver added", description: "Trusted driver has been added to your list." });
      setNewDriver({ driver_name: "", driver_phone: "", vehicle_number: "", vehicle_type: "", notes: "" });
      setShowAddDriver(false);
      fetchTrustedDrivers();
    }
  };

  const updateDriver = async (driver: TrustedDriver) => {
    const { error } = await supabase
      .from("trusted_drivers")
      .update({
        driver_name: driver.driver_name,
        driver_phone: driver.driver_phone,
        vehicle_number: driver.vehicle_number,
        vehicle_type: driver.vehicle_type,
        notes: driver.notes
      })
      .eq("id", driver.id);

    if (error) {
      toast({ title: "Error updating driver", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Driver updated", description: "Driver information has been updated." });
      setEditingDriver(null);
    }
  };

  const deleteDriver = async (id: string) => {
    const { error } = await supabase
      .from("trusted_drivers")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error deleting driver", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Driver removed", description: "Trusted driver has been removed from your list." });
      fetchTrustedDrivers();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Profile</h1>
            <p className="text-muted-foreground">Manage your safety settings and emergency contacts</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
              <TabsTrigger value="profile" className="gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="drivers" className="gap-2">
                <Car className="w-4 h-4" />
                <span className="hidden sm:inline">Trusted Drivers</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Safety Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile & Emergency Contacts Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Your basic profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        value={profile.full_name || ""}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 000-0000"
                        value={profile.phone || ""}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Email: {user.email}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    Emergency Contact
                  </CardTitle>
                  <CardDescription>This person will be notified in case of emergency</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyName">Contact Name</Label>
                      <Input
                        id="emergencyName"
                        placeholder="Emergency contact name"
                        value={profile.emergency_contact_name || ""}
                        onChange={(e) => setProfile({ ...profile, emergency_contact_name: e.target.value })}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Contact Phone</Label>
                      <Input
                        id="emergencyPhone"
                        placeholder="+1 (555) 000-0000"
                        value={profile.emergency_contact_phone || ""}
                        onChange={(e) => setProfile({ ...profile, emergency_contact_phone: e.target.value })}
                        className="bg-white/5 border-white/10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={saveProfile} disabled={saving} className="gap-2" variant="glow">
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </TabsContent>

            {/* Trusted Drivers Tab */}
            <TabsContent value="drivers" className="space-y-6">
              <Card className="glass border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Car className="w-5 h-5 text-primary" />
                        Trusted Drivers
                      </CardTitle>
                      <CardDescription>Pre-verified drivers you trust for safe rides</CardDescription>
                    </div>
                    <Button 
                      onClick={() => setShowAddDriver(!showAddDriver)} 
                      size="sm" 
                      variant={showAddDriver ? "ghost" : "glow"}
                      className="gap-2"
                    >
                      {showAddDriver ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      {showAddDriver ? "Cancel" : "Add Driver"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {showAddDriver && (
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-4">
                      <h4 className="font-medium text-foreground">Add New Trusted Driver</h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Driver Name *</Label>
                          <Input
                            placeholder="Driver's full name"
                            value={newDriver.driver_name}
                            onChange={(e) => setNewDriver({ ...newDriver, driver_name: e.target.value })}
                            className="bg-white/5 border-white/10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone Number *</Label>
                          <Input
                            placeholder="+1 (555) 000-0000"
                            value={newDriver.driver_phone}
                            onChange={(e) => setNewDriver({ ...newDriver, driver_phone: e.target.value })}
                            className="bg-white/5 border-white/10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Vehicle Number</Label>
                          <Input
                            placeholder="License plate"
                            value={newDriver.vehicle_number}
                            onChange={(e) => setNewDriver({ ...newDriver, vehicle_number: e.target.value })}
                            className="bg-white/5 border-white/10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Vehicle Type</Label>
                          <Input
                            placeholder="e.g., White Honda Civic"
                            value={newDriver.vehicle_type}
                            onChange={(e) => setNewDriver({ ...newDriver, vehicle_type: e.target.value })}
                            className="bg-white/5 border-white/10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Input
                          placeholder="Any additional notes"
                          value={newDriver.notes}
                          onChange={(e) => setNewDriver({ ...newDriver, notes: e.target.value })}
                          className="bg-white/5 border-white/10"
                        />
                      </div>
                      <Button onClick={addDriver} className="gap-2" variant="glow">
                        <Plus className="w-4 h-4" />
                        Add Driver
                      </Button>
                    </div>
                  )}

                  {trustedDrivers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Car className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No trusted drivers added yet</p>
                      <p className="text-sm">Add drivers you know and trust for safer rides</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {trustedDrivers.map((driver) => (
                        <div 
                          key={driver.id} 
                          className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                        >
                          {editingDriver === driver.id ? (
                            <div className="space-y-4">
                              <div className="grid gap-4 sm:grid-cols-2">
                                <Input
                                  value={driver.driver_name}
                                  onChange={(e) => setTrustedDrivers(drivers => 
                                    drivers.map(d => d.id === driver.id ? { ...d, driver_name: e.target.value } : d)
                                  )}
                                  className="bg-white/5 border-white/10"
                                />
                                <Input
                                  value={driver.driver_phone}
                                  onChange={(e) => setTrustedDrivers(drivers => 
                                    drivers.map(d => d.id === driver.id ? { ...d, driver_phone: e.target.value } : d)
                                  )}
                                  className="bg-white/5 border-white/10"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => updateDriver(driver)} className="gap-1">
                                  <Save className="w-3 h-3" /> Save
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => {
                                  setEditingDriver(null);
                                  fetchTrustedDrivers();
                                }}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-foreground">{driver.driver_name}</span>
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-safe/20 text-safe">Verified</span>
                                </div>
                                <div className="text-sm text-muted-foreground space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-3 h-3" />
                                    {driver.driver_phone}
                                  </div>
                                  {driver.vehicle_type && (
                                    <div className="flex items-center gap-2">
                                      <Car className="w-3 h-3" />
                                      {driver.vehicle_type} {driver.vehicle_number && `• ${driver.vehicle_number}`}
                                    </div>
                                  )}
                                  {driver.notes && (
                                    <div className="text-xs text-muted-foreground/70 mt-1">
                                      {driver.notes}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => setEditingDriver(driver.id)}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-8 w-8 p-0 text-danger hover:text-danger"
                                  onClick={() => deleteDriver(driver.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Safety Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Location & Sharing
                  </CardTitle>
                  <CardDescription>Control how your location is shared</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Share Location with Contacts</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow emergency contacts to see your real-time location during navigation
                      </p>
                    </div>
                    <Switch
                      checked={preferences.share_location_with_contacts}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, share_location_with_contacts: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-warning" />
                    SOS Settings
                  </CardTitle>
                  <CardDescription>Configure emergency alert behavior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Auto-SOS Enabled</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically send SOS if no movement is detected for extended periods
                      </p>
                    </div>
                    <Switch
                      checked={preferences.auto_sos_enabled}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, auto_sos_enabled: checked })
                      }
                    />
                  </div>
                  
                  {preferences.auto_sos_enabled && (
                    <div className="space-y-2 pl-4 border-l-2 border-warning/30">
                      <Label>SOS Delay (seconds)</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          type="number"
                          min={5}
                          max={60}
                          value={preferences.sos_delay_seconds}
                          onChange={(e) => 
                            setPreferences({ ...preferences, sos_delay_seconds: parseInt(e.target.value) || 10 })
                          }
                          className="w-24 bg-white/5 border-white/10"
                        />
                        <span className="text-sm text-muted-foreground">
                          Time to cancel before alert is sent
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-safe" />
                    Route Preferences
                  </CardTitle>
                  <CardDescription>How routes are calculated for you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Preferred Route Type</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "safest", label: "Safest", icon: Shield },
                        { value: "balanced", label: "Balanced", icon: MapPin },
                        { value: "fastest", label: "Fastest", icon: Car }
                      ].map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          onClick={() => setPreferences({ ...preferences, preferred_route_type: value })}
                          className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-1 ${
                            preferences.preferred_route_type === value
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-sm font-medium">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Alert Preferences
                  </CardTitle>
                  <CardDescription>Choose what alerts you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex items-center gap-3">
                      <Moon className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label className="text-base">Night Mode Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Extra safety reminders after dark
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.night_mode_enabled}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, night_mode_enabled: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex items-center gap-3">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label className="text-base">Crowd Density Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Notifications about crowded or isolated areas
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences.crowd_alerts_enabled}
                      onCheckedChange={(checked) => 
                        setPreferences({ ...preferences, crowd_alerts_enabled: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Button onClick={savePreferences} disabled={saving} className="gap-2" variant="glow">
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Preferences"}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;