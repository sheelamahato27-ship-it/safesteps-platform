import { Route, Clock, Shield } from "lucide-react";

export const GoalSection = () => {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-glow-purple/5 blur-3xl rounded-full" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Route className="w-4 h-4" />
                Our Mission
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
                Safety First,
                <br />
                <span className="text-gradient">Not Just the Shortest Route</span>
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                We help users choose the <strong className="text-foreground">safest path</strong>, not just the fastest one. 
                Our intelligent routing system considers multiple safety factors to ensure you reach your destination securely.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-safe/10">
                    <Shield className="w-5 h-5 text-safe" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Safety-First Algorithm</h4>
                    <p className="text-sm text-muted-foreground">Routes are scored based on safety, not just distance</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Real-Time Updates</h4>
                    <p className="text-sm text-muted-foreground">Continuous monitoring adapts to changing conditions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="glass-card p-8 lg:p-10">
                {/* Route comparison */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-safe/10 border border-safe/20">
                    <div className="w-3 h-3 rounded-full bg-safe" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">Safest Route</div>
                      <div className="text-xs text-muted-foreground">18 min • Well-lit areas</div>
                    </div>
                    <div className="text-sm font-semibold text-safe">Recommended</div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-caution/10 border border-caution/20">
                    <div className="w-3 h-3 rounded-full bg-caution" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">Balanced Route</div>
                      <div className="text-xs text-muted-foreground">12 min • Mixed areas</div>
                    </div>
                    <div className="text-sm font-semibold text-caution">Moderate</div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-danger/10 border border-danger/20 opacity-60">
                    <div className="w-3 h-3 rounded-full bg-danger" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">Fastest Route</div>
                      <div className="text-xs text-muted-foreground">8 min • Low visibility</div>
                    </div>
                    <div className="text-sm font-semibold text-danger">Avoid</div>
                  </div>
                </div>

                {/* Decorative map lines */}
                <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
                    <path d="M10 80 Q 30 60, 50 50 T 90 20" stroke="currentColor" fill="none" strokeWidth="2" strokeDasharray="4 4"/>
                    <circle cx="10" cy="80" r="4" fill="currentColor"/>
                    <circle cx="90" cy="20" r="4" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
