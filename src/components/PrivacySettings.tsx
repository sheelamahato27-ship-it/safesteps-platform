import { useState } from "react";
import { Trash2, Eye, EyeOff, AlertTriangle, Shield, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

export const PrivacySettings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const [hideProfile, setHideProfile] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleDeleteAllData = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    
    try {
      // Delete SOS alerts
      await supabase
        .from("sos_alerts")
        .delete()
        .eq("user_id", user.id);

      // Delete trusted drivers
      await supabase
        .from("trusted_drivers")
        .delete()
        .eq("user_id", user.id);

      // Delete safety preferences
      await supabase
        .from("safety_preferences")
        .delete()
        .eq("user_id", user.id);

      // Clear profile data (but keep the record for RLS)
      await supabase
        .from("profiles")
        .update({
          full_name: null,
          phone: null,
          emergency_contact_name: null,
          emergency_contact_phone: null
        })
        .eq("user_id", user.id);

      toast({
        title: "Data Deleted",
        description: "All your personal data has been permanently deleted.",
      });

      // Sign out the user
      await signOut();
      
    } catch (error) {
      console.error("Error deleting data:", error);
      toast({
        title: "Error",
        description: "Could not delete all data. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsDeleting(false);
  };

  const handleExportData = async () => {
    if (!user) return;
    
    setIsExporting(true);
    
    try {
      // Fetch all user data
      const [profileRes, driversRes, prefsRes, alertsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("trusted_drivers").select("*").eq("user_id", user.id),
        supabase.from("safety_preferences").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("sos_alerts").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      ]);

      const exportData = {
        exportDate: new Date().toISOString(),
        profile: profileRes.data,
        trustedDrivers: driversRes.data,
        safetyPreferences: prefsRes.data,
        sosAlerts: alertsRes.data,
      };

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `safesteps-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data Exported",
        description: "Your data has been downloaded as a JSON file.",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Export Failed",
        description: "Could not export your data. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsExporting(false);
  };

  const handleDeleteSOSHistory = async () => {
    if (!user) return;
    
    try {
      await supabase
        .from("sos_alerts")
        .delete()
        .eq("user_id", user.id);

      toast({
        title: "History Cleared",
        description: "Your SOS alert history has been deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not delete history.",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <Card className="glass border-white/10">
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Please log in to manage your privacy settings.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Privacy & Data Protection
        </CardTitle>
        <CardDescription>
          Control your personal data and privacy settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Visibility */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-3">
            {hideProfile ? <EyeOff className="w-5 h-5 text-muted-foreground" /> : <Eye className="w-5 h-5 text-primary" />}
            <div>
              <Label className="text-base">Hide My Profile</Label>
              <p className="text-sm text-muted-foreground">Make your profile invisible to other users</p>
            </div>
          </div>
          <Switch
            checked={hideProfile}
            onCheckedChange={setHideProfile}
          />
        </div>

        {/* Export Data */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-primary" />
            <div>
              <Label className="text-base">Export My Data</Label>
              <p className="text-sm text-muted-foreground">Download a copy of all your data</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            disabled={isExporting}
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Export"}
          </Button>
        </div>

        {/* Delete SOS History */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-caution" />
            <div>
              <Label className="text-base">Clear SOS History</Label>
              <p className="text-sm text-muted-foreground">Delete all your past SOS alerts</p>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-caution hover:text-caution">
                Clear
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="glass">
              <AlertDialogHeader>
                <AlertDialogTitle>Clear SOS History?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your SOS alert history. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteSOSHistory} className="bg-caution text-caution-foreground hover:bg-caution/90">
                  Clear History
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Delete All Data */}
        <div className="p-4 rounded-lg bg-danger/10 border border-danger/30 space-y-4">
          <div className="flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-danger" />
            <div>
              <Label className="text-base text-danger">Delete All My Data</Label>
              <p className="text-sm text-muted-foreground">
                Permanently delete your profile, preferences, trusted drivers, and all history
              </p>
            </div>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full gap-2">
                <Trash2 className="w-4 h-4" />
                Delete All Data & Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="glass">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-danger flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Delete All Data?
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>This action is <strong>permanent and cannot be undone</strong>. The following will be deleted:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                    <li>Your profile information</li>
                    <li>Emergency contacts</li>
                    <li>Trusted drivers list</li>
                    <li>Safety preferences</li>
                    <li>All SOS alert history</li>
                  </ul>
                  <p className="mt-2">You will be signed out after deletion.</p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAllData}
                  disabled={isDeleting}
                  className="bg-danger text-danger-foreground hover:bg-danger/90"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Everything"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};
