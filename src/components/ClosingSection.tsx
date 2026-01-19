import { Shield, ArrowRight, Heart } from "lucide-react";
import { Button } from "./ui/button";

export const ClosingSection = () => {
  return (
    <section id="resources" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-glow opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-glow-purple/20 via-glow-pink/20 to-glow-blue/20 blur-3xl rounded-full" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-2xl animate-pulse-soft" />
              <div className="relative p-4 rounded-2xl glass-card">
                <Heart className="w-12 h-12 text-accent" />
              </div>
            </div>
          </div>

          {/* Main Message */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
            Because getting home safely
            <br />
            <span className="text-gradient">matters more than getting there fast.</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Join thousands of women who trust SafeSteps to navigate their world with confidence. 
            Your safety is our priority, every step of the way.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button variant="glow" size="xl" className="w-full sm:w-auto">
              Start Your Safe Journey
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="glass" size="lg" className="w-full sm:w-auto">
              Download App
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-white/10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-safe" />
              <span>Privacy First</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-safe" />
              <span>End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-safe" />
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
