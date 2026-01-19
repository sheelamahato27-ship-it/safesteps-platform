import { Shield, Radio, MapPin, Bell } from "lucide-react";
import { Button } from "./ui/button";

export const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-glow animate-pulse-glow opacity-60" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-glow-blue/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-glow-pink/10 blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
      </div>

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Shield Icon */}
          <div className="inline-flex items-center justify-center mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-2xl animate-pulse-soft" />
              <div className="relative p-4 rounded-2xl glass-card animate-glow-ring">
                <Shield className="w-16 h-16 text-primary" />
              </div>
            </div>
          </div>

          {/* Brand Name */}
          <h2 className="text-lg font-semibold text-gradient mb-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            SAFESTEPS
          </h2>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            AI-Powered Safety
            <br />
            <span className="text-gradient">for Women</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-up" style={{ animationDelay: "0.4s" }}>
            Real-time alerts, smart location tracking, and instant emergency response—so every woman feels safe, anytime, anywhere.
          </p>

          {/* Live Status Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass mb-10 animate-fade-up" style={{ animationDelay: "0.5s" }}>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-safe opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-safe"></span>
            </span>
            <span className="text-sm font-medium text-foreground">
              LIVE • 24/7 Monitoring Enabled
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.6s" }}>
            <Button variant="glow" size="xl" className="w-full sm:w-auto">
              <Radio className="w-5 h-5" />
              Activate Safety
            </Button>
            <Button variant="glass" size="xl" className="w-full sm:w-auto">
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/10 animate-fade-up" style={{ animationDelay: "0.7s" }}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-primary mb-2">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">50K+</div>
              <div className="text-sm text-muted-foreground">Safe Routes</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-primary mb-2">
                <Bell className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">2M+</div>
              <div className="text-sm text-muted-foreground">Alerts Sent</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-primary mb-2">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
