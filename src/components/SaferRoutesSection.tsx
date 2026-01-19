import { 
  Database, 
  MessageSquare, 
  MapPin, 
  Clock, 
  Users, 
  Building2, 
  Calculator, 
  Route,
  Lightbulb,
  ShieldCheck,
  AlertTriangle,
  Minus,
  Plus
} from "lucide-react";

export const SaferRoutesSection = () => {
  const dataSourceCards = [
    {
      icon: MessageSquare,
      title: "Community Reports",
      items: ["Poorly lit areas", "Harassment-prone zones", "Isolated streets"],
      note: "Time-stamped reports"
    },
    {
      icon: Database,
      title: "Historical Data",
      items: ["Past incident hotspots", "Static data for prototype"],
      note: "Demo-ready data"
    },
    {
      icon: MapPin,
      title: "Environmental Indicators",
      items: ["Time of day", "Crowd density", "Nearby safe points"],
      note: "Real-time analysis"
    }
  ];

  const scoringItems = [
    { label: "Good lighting", points: "+2", type: "positive" },
    { label: "Crowd presence", points: "+2", type: "positive" },
    { label: "Near police station", points: "+3", type: "positive" },
    { label: "Past incidents", points: "-3", type: "negative" },
    { label: "Isolated area", points: "-2", type: "negative" },
  ];

  return (
    <section id="how-it-works" className="relative py-24 lg:py-32">
      {/* Background accents */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-glow-pink/5 blur-3xl rounded-full" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Route className="w-4 h-4" />
              Feature Spotlight
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Safer Routes – <span className="text-gradient">How It Works</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A three-step process to ensure you always have the safest path available
            </p>
          </div>

          {/* Step 1: Data Collection */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Collect Safety Data</h3>
                <p className="text-muted-foreground">No extra hardware needed</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {dataSourceCards.map((card, index) => (
                <div 
                  key={index} 
                  className="glass-card p-6 hover:bg-white/[0.05] transition-colors group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <card.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground">{card.title}</h4>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {card.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="text-xs text-primary/80 font-medium">{card.note}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-secondary/50 border border-border">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-caution mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">For hackathons and demos:</strong> This data can be simulated for demonstration purposes.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2: Safety Scoring */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Safety Scoring System</h3>
                <p className="text-muted-foreground">Each road segment gets a safety score</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Calculator className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-foreground">Scoring Factors</h4>
                </div>
                
                <div className="space-y-3">
                  {scoringItems.map((item, index) => (
                    <div 
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        item.type === "positive" ? "bg-safe/10" : "bg-danger/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.type === "positive" ? (
                          <Plus className="w-4 h-4 text-safe" />
                        ) : (
                          <Minus className="w-4 h-4 text-danger" />
                        )}
                        <span className="text-sm text-foreground">{item.label}</span>
                      </div>
                      <span className={`font-mono font-semibold ${
                        item.type === "positive" ? "text-safe" : "text-danger"
                      }`}>
                        {item.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6 flex flex-col justify-center">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-safe/20 mb-4">
                    <ShieldCheck className="w-10 h-10 text-safe" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-2">Higher Score = Safer Route</h4>
                  <p className="text-muted-foreground text-sm">
                    Our algorithm aggregates all factors to provide you with the safest possible journey.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Route Recommendation */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Route Recommendation</h3>
                <p className="text-muted-foreground">Choose your preferred safety level</p>
              </div>
            </div>

            <div className="glass-card p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-safe/10 border-2 border-safe/30 relative">
                  <div className="absolute -top-3 left-4 px-3 py-1 rounded-full bg-safe text-safe-foreground text-xs font-semibold">
                    Recommended
                  </div>
                  <div className="flex items-center gap-3 mb-4 mt-2">
                    <div className="w-4 h-4 rounded-full bg-safe" />
                    <h5 className="font-bold text-foreground text-lg">Safest Route</h5>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-safe" />
                      Maximum safety score
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-safe" />
                      Well-populated areas
                    </li>
                    <li className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-safe" />
                      Near safe points
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-xl bg-caution/10 border border-caution/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-4 h-4 rounded-full bg-caution" />
                    <h5 className="font-bold text-foreground text-lg">Balanced Route</h5>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-caution" />
                      Moderate travel time
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-caution" />
                      Acceptable safety level
                    </li>
                    <li className="flex items-center gap-2">
                      <Route className="w-4 h-4 text-caution" />
                      Mixed route conditions
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-xl bg-danger/10 border border-danger/20 opacity-70">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-4 h-4 rounded-full bg-danger" />
                    <h5 className="font-bold text-foreground text-lg">Avoid Route</h5>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-danger" />
                      Low safety score
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-danger" />
                      Isolated areas
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-danger" />
                      Limited visibility
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
                <p className="text-foreground font-medium">
                  "Our system prioritizes <span className="text-gradient font-bold">safety over speed</span>."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
