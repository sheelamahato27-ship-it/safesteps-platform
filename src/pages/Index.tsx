import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { GoalSection } from "@/components/GoalSection";
import { SafetyMap } from "@/components/SafetyMap";
import { SaferRoutesSection } from "@/components/SaferRoutesSection";
import { LiveMonitoringSection } from "@/components/LiveMonitoringSection";
import { SafeTransportSection } from "@/components/SafeTransportSection";
import { EmergencySection } from "@/components/EmergencySection";
import { ClosingSection } from "@/components/ClosingSection";
import { Footer } from "@/components/Footer";
import { SafetyChatbot } from "@/components/SafetyChatbot";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <GoalSection />
      <SafetyMap />
      <SaferRoutesSection />
      <LiveMonitoringSection />
      <SafeTransportSection />
      <EmergencySection />
      <ClosingSection />
      <Footer />
      <SafetyChatbot />
    </div>
  );
};

export default Index;
