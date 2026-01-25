import { 
  Car, 
  CheckCircle2, 
  AlertTriangle, 
  Star, 
  Heart, 
  Users, 
  Bus, 
  MapPin,
  Shield,
  Share2,
  Radio,
  Code
} from "lucide-react";

export const SafeTransportSection = () => {
  const verificationChecks = [
    { icon: CheckCircle2, label: "Driver ID verification", verified: true },
    { icon: CheckCircle2, label: "Vehicle number match", verified: true },
    { icon: Star, label: "Community ratings", verified: true },
  ];

  const trustedTransports = [
    { icon: Car, label: "Auto drivers" },
    { icon: Car, label: "Cab drivers" },
    { icon: Bus, label: "College buses" },
    { icon: Users, label: "Local services" },
  ];

  return (
    <section id="features" className="relative py-24 lg:py-32">
      {/* Background accents */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-glow-pink/5 blur-3xl rounded-full" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Car className="w-4 h-4" />
              Transportation Safety
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Safe Transport <span className="text-gradient">Features</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive safety features for every mode of transportation
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Feature A: Safe Ride Verification */}
            <div className="glass-card p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-safe/10">
                  <Shield className="w-6 h-6 text-safe" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Safe Ride Verification</h3>
                  <p className="text-xs text-muted-foreground">Before your ride starts</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {verificationChecks.map((check, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-safe/5">
                    <check.icon className="w-5 h-5 text-safe" />
                    <span className="text-sm text-foreground">{check.label}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-safe/10 border border-safe/30">
                  <CheckCircle2 className="w-5 h-5 text-safe" />
                  <span className="font-medium text-foreground">Verified Safe Ride</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-caution/10 border border-caution/30">
                  <AlertTriangle className="w-5 h-5 text-caution" />
                  <span className="font-medium text-foreground">Limited Data (Use Caution)</span>
                </div>
              </div>
            </div>

            {/* Feature B: Trusted Transport List */}
            <div className="glass-card p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Trusted Transport List</h3>
                  <p className="text-xs text-muted-foreground">Save your favorites</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                Pre-save trusted transport providers for quick and safe booking:
              </p>

              <div className="grid grid-cols-2 gap-3">
                {trustedTransports.map((transport, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <transport.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">{transport.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-caution" />
                  <span className="text-sm font-medium text-foreground">Quick Tip</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Add your regular drivers to get instant verification on future rides
                </p>
              </div>
            </div>

            {/* Feature C: Ride Sharing Safety Mode */}
            <div className="glass-card p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-glow-blue/10">
                  <Share2 className="w-6 h-6 text-glow-blue" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Ride Sharing Safety</h3>
                  <p className="text-xs text-muted-foreground">During your ride</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                  <MapPin className="w-5 h-5 text-glow-blue mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-foreground">Live Location Sharing</div>
                    <div className="text-xs text-muted-foreground">Share with trusted contacts</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                  <Radio className="w-5 h-5 text-danger mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-foreground">SOS Button Always Visible</div>
                    <div className="text-xs text-muted-foreground">One tap emergency access</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                  <AlertTriangle className="w-5 h-5 text-caution mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-foreground">Auto-Alert on Deviation</div>
                    <div className="text-xs text-muted-foreground">Automatic notification system</div>
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
