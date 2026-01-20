import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SaferRoutesSection } from "@/components/SaferRoutesSection";
import { LiveMonitoringSection } from "@/components/LiveMonitoringSection";
import { SafeTransportSection } from "@/components/SafeTransportSection";
import { SafetyMap } from "@/components/SafetyMap";
import { SafetyChatbot } from "@/components/SafetyChatbot";

const Features = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Powerful <span className="text-gradient">Safety Features</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore all the features designed to keep you safe, from AI-powered route recommendations to real-time monitoring.
          </p>
        </div>
      </section>

      <SafetyMap />
      <SaferRoutesSection />
      <LiveMonitoringSection />
      <SafeTransportSection />
      <Footer />
      <SafetyChatbot />
    </div>
  );
};

export default Features;
