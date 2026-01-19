import { 
  Navigation, 
  AlertCircle, 
  MapPin, 
  Bell, 
  ShieldAlert,
  Clock,
  Smartphone
} from "lucide-react";

export const LiveMonitoringSection = () => {
  const detectionFeatures = [
    {
      icon: Navigation,
      title: "Route Deviation",
      description: "Instant alert when you stray from your planned path"
    },
    {
      icon: Clock,
      title: "Unusual Stops",
      description: "Detection of unexpected or prolonged stops"
    },
    {
      icon: ShieldAlert,
      title: "Unsafe Zone Entry",
      description: "Warning when entering low-safety areas"
    }
  ];

  const responseActions = [
    {
      icon: Bell,
      title: "Soft Alert",
      description: "Gentle notification to check on you",
      color: "primary"
    },
    {
      icon: Smartphone,
      title: "Check-in Prompt",
      description: "Optional confirmation request",
      color: "caution"
    },
    {
      icon: AlertCircle,
      title: "Emergency Escalation",
      description: "Automatic alert to trusted contacts",
      color: "danger"
    }
  ];

  return (
    <section className="relative py-24 lg:py-32 bg-card/50">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-glow-blue/5 blur-3xl rounded-full" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-glow-blue/10 text-glow-blue text-sm font-medium mb-6">
              <Navigation className="w-4 h-4" />
              Key Differentiator
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Live Route <span className="text-gradient">Monitoring</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Active protection that monitors your journey only when you need it
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Detection Features */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
                During Your Trip, We Detect:
              </h3>
              
              <div className="space-y-4">
                {detectionFeatures.map((feature, index) => (
                  <div 
                    key={index}
                    className="glass-card p-5 hover:bg-white/[0.05] transition-colors group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Actions */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-safe animate-pulse-soft" />
                App Response System:
              </h3>
              
              <div className="space-y-4">
                {responseActions.map((action, index) => (
                  <div 
                    key={index}
                    className={`glass-card p-5 border-l-4 ${
                      action.color === "primary" ? "border-l-primary" :
                      action.color === "caution" ? "border-l-caution" :
                      "border-l-danger"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${
                        action.color === "primary" ? "bg-primary/10" :
                        action.color === "caution" ? "bg-caution/10" :
                        "bg-danger/10"
                      }`}>
                        <action.icon className={`w-6 h-6 ${
                          action.color === "primary" ? "text-primary" :
                          action.color === "caution" ? "text-caution" :
                          "text-danger"
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{action.title}</h4>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visual representation */}
          <div className="mt-16 glass-card p-8 text-center">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary">
                <MapPin className="w-4 h-4 text-safe" />
                <span className="text-sm text-foreground">Start Point</span>
              </div>
              <div className="hidden sm:block w-16 h-0.5 bg-gradient-to-r from-safe via-primary to-safe" />
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 animate-pulse-soft">
                <Navigation className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground font-medium">Live Monitoring Active</span>
              </div>
              <div className="hidden sm:block w-16 h-0.5 bg-gradient-to-r from-safe via-primary to-safe" />
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary">
                <MapPin className="w-4 h-4 text-safe" />
                <span className="text-sm text-foreground">Destination</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Monitoring happens only during an active trip for optimal battery and privacy
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
