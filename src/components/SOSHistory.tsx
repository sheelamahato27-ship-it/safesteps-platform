import { useState, useEffect } from "react";
import { AlertTriangle, MapPin, Clock, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface SOSAlert {
  id: string;
  created_at: string;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  status: string;
  resolved_at: string | null;
  notes: string | null;
}

export const SOSHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<SOSAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAlerts();
    }
  }, [user]);

  const fetchAlerts = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("sos_alerts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching SOS alerts:", error);
      toast({
        title: "Error loading history",
        description: "Could not load your SOS alert history.",
        variant: "destructive"
      });
    } else {
      setAlerts(data || []);
    }
    setLoading(false);
  };

  const resolveAlert = async (alertId: string) => {
    const { error } = await supabase
      .from("sos_alerts")
      .update({ 
        status: "resolved",
        resolved_at: new Date().toISOString()
      })
      .eq("id", alertId);

    if (error) {
      toast({
        title: "Error",
        description: "Could not resolve the alert.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Alert Resolved",
        description: "The SOS alert has been marked as resolved.",
      });
      fetchAlerts();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="destructive" className="gap-1"><AlertTriangle className="w-3 h-3" /> Active</Badge>;
      case "resolved":
        return <Badge variant="default" className="gap-1 bg-safe text-white"><CheckCircle className="w-3 h-3" /> Resolved</Badge>;
      case "cancelled":
        return <Badge variant="secondary" className="gap-1"><XCircle className="w-3 h-3" /> Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const openInMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

  if (!user) {
    return (
      <Card className="glass border-white/10">
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Please log in to view your SOS history.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="glass border-white/10">
        <CardContent className="py-8 text-center">
          <div className="animate-pulse text-muted-foreground">Loading history...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-danger" />
          SOS Alert History
        </CardTitle>
        <CardDescription>
          View and manage your past emergency alerts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No SOS alerts recorded</p>
            <p className="text-sm mt-1">Your safety history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-lg bg-secondary/50 border border-white/5 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      {format(new Date(alert.created_at), "PPp")}
                    </span>
                  </div>
                  {getStatusBadge(alert.status)}
                </div>

                {alert.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{alert.address}</span>
                  </div>
                )}

                {alert.latitude && alert.longitude && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-xs"
                      onClick={() => openInMaps(alert.latitude!, alert.longitude!)}
                    >
                      <ExternalLink className="w-3 h-3" />
                      View on Map
                    </Button>
                    
                    {alert.status === "active" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-xs text-safe hover:text-safe/80"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        <CheckCircle className="w-3 h-3" />
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                )}

                {alert.resolved_at && (
                  <p className="text-xs text-muted-foreground">
                    Resolved: {format(new Date(alert.resolved_at), "PPp")}
                  </p>
                )}

                {alert.notes && (
                  <p className="text-sm text-muted-foreground italic">"{alert.notes}"</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
