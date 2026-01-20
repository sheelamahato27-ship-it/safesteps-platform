import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SafetyChatbot } from "@/components/SafetyChatbot";
import { 
  MapPin, 
  Shield, 
  Bell, 
  Navigation, 
  Users, 
  Phone, 
  CheckCircle,
  ArrowRight,
  Smartphone,
  Map,
  AlertTriangle,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    title: "Download & Sign Up",
    description: "Create your SafeSteps account in seconds. Add your emergency contacts and customize your safety preferences.",
    icon: Smartphone,
    details: [
      "Quick email or social signup",
      "Add trusted contacts",
      "Set your home & work locations",
      "Customize alert preferences"
    ]
  },
  {
    number: "02",
    title: "Plan Your Route",
    description: "Enter your destination and let our AI find the safest path. We analyze real-time data to keep you protected.",
    icon: Map,
    details: [
      "AI-powered route analysis",
      "Real-time safety scoring",
      "Multiple route options",
      "Estimated safety levels"
    ]
  },
  {
    number: "03",
    title: "Travel Safely",
    description: "Navigate with confidence. Our system monitors your journey and alerts you to any potential risks.",
    icon: Navigation,
    details: [
      "Live route monitoring",
      "Deviation detection",
      "Nearby safe points shown",
      "One-tap SOS always visible"
    ]
  },
  {
    number: "04",
    title: "Get Help When Needed",
    description: "In case of emergency, instantly connect with emergency services and notify your trusted contacts.",
    icon: AlertTriangle,
    details: [
      "Instant SOS activation",
      "Auto-share location",
      "Direct emergency call",
      "Silent alert option"
    ]
  }
];

const features = [
  {
    icon: Shield,
    title: "Safety Scoring",
    description: "Every route segment is scored based on lighting, crowd density, and historical data."
  },
  {
    icon: Clock,
    title: "Real-Time Updates",
    description: "Safety conditions are updated continuously as you travel."
  },
  {
    icon: Users,
    title: "Community Reports",
    description: "Benefit from safety reports submitted by other users in real-time."
  },
  {
    icon: Phone,
    title: "24/7 Support",
    description: "Access to safety resources and emergency support around the clock."
  }
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            How <span className="text-gradient">SafeSteps</span> Works
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your safety journey in four simple steps. From signup to safe arrival.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="space-y-24">
            {steps.map((step, index) => (
              <div 
                key={step.number}
                className={`flex flex-col lg:flex-row gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Content */}
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-5xl font-bold text-gradient">{step.number}</span>
                  </div>
                  <h2 className="text-3xl font-bold">{step.title}</h2>
                  <p className="text-lg text-muted-foreground">{step.description}</p>
                  <ul className="space-y-3">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-safe flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual */}
                <div className="flex-1">
                  <div className="glass rounded-3xl p-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-glow-pink/10 rounded-3xl" />
                    <div className="relative flex items-center justify-center h-64">
                      <div className="w-24 h-24 rounded-2xl bg-primary/20 flex items-center justify-center">
                        <step.icon className="w-12 h-12 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Makes Us <span className="text-gradient">Different</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              SafeSteps combines cutting-edge technology with real-world safety expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="glass rounded-2xl p-6 text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="glass rounded-3xl p-12 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Travel Safer?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of women who trust SafeSteps for their daily commute.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button variant="glow" size="lg">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/features">
                <Button variant="outline" size="lg">
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <SafetyChatbot />
    </div>
  );
};

export default HowItWorks;
