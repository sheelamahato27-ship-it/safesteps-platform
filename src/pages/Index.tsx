import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { GoalSection } from "@/components/GoalSection";
import { SaferRoutesSection } from "@/components/SaferRoutesSection";
import { LiveMonitoringSection } from "@/components/LiveMonitoringSection";
import { SafeTransportSection } from "@/components/SafeTransportSection";
import { EmergencySection } from "@/components/EmergencySection";
import { ClosingSection } from "@/components/ClosingSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <GoalSection />
      <SaferRoutesSection />
      <LiveMonitoringSection />
      <SafeTransportSection />
      <EmergencySection />
      <ClosingSection />
      <Footer />
    </div>
  );
};

export default Index;
