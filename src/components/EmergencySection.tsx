import { 
  AlertCircle, 
  Building2, 
  Cross, 
  Shield,
  MapPin,
  Zap
} from "lucide-react";
import { Button } from "./ui/button";

export const EmergencySection = () => {
  const safePoints = [
    { icon: Shield, label: "Police Stations", count: "150+" },
    { icon: Cross, label: "Hospitals", count: "80+" },
    { icon: Building2, label: "Public Places", count: "500+" },
  ];

  return (
    <section id="emergency" className="relative py-24 lg:py-32 bg-danger/5">
      {/* Emergency glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-danger/5 to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-danger/20 text-danger text-sm font-medium mb-6 animate-pulse-soft">
              <AlertCircle className="w-4 h-4" />
              Emergency Features
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Emergency Integration <span className="text-gradient">During Routes</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Immediate access to help when you need it most
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: SOS Button */}
            <div className="text-center lg:text-left">
              <div className="inline-block">
                <div className="relative">
                  {/* Pulsing rings */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border-2 border-danger/30 animate-ping" style={{ animationDuration: "2s" }} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 rounded-full border-2 border-danger/40 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.5s" }} />
                  </div>
                  
                  {/* SOS Button */}
                  <div className="relative">
                    <Button 
                      variant="emergency" 
                      className="w-32 h-32 rounded-full text-2xl font-bold"
                    >
                      SOS
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-foreground mb-2">One-Tap SOS Button</h3>
                <p className="text-muted-foreground">
                  Always visible during navigation. One tap sends your location to emergency contacts and nearby authorities.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 text-caution" />
                <span>Response time: under 30 seconds</span>
              </div>
            </div>

            {/* Right: Safe Points */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-safe" />
                Instant Access to Nearest Safe Places
              </h3>

              <div className="space-y-4">
                {safePoints.map((point, index) => (
                  <div 
                    key={index}
                    className="glass-card p-5 flex items-center gap-4 hover:bg-white/[0.05] transition-colors"
                  >
                    <div className="p-3 rounded-xl bg-safe/10">
                      <point.icon className="w-6 h-6 text-safe" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{point.label}</h4>
                      <p className="text-sm text-muted-foreground">Available in your area</p>
                    </div>
                    <div className="text-2xl font-bold text-safe">{point.count}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-secondary/50 border border-border">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-1">Smart Suggestions</h4>
                    <p className="text-xs text-muted-foreground">
                      Our app prioritizes nearby safe points based on your current location, time of day, and route conditions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
