import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SafetyChatbot } from "@/components/SafetyChatbot";
import { EmergencySection } from "@/components/EmergencySection";
import { 
  Phone, 
  Shield, 
  MapPin, 
  AlertTriangle, 
  Bell,
  Users,
  MessageCircle,
  Siren
} from "lucide-react";
import { Button } from "@/components/ui/button";

const emergencyContacts = [
  { country: "India", number: "112", type: "Emergency", description: "National Emergency Number" },
  { country: "India", number: "181", type: "Women Helpline", description: "Women Helpline (All India)" },
  { country: "India", number: "1091", type: "Women Helpline", description: "Women in Distress" },
  { country: "USA", number: "911", type: "Emergency", description: "Emergency Services" },
  { country: "USA", number: "1-800-799-7233", type: "Domestic Violence", description: "National DV Hotline" },
  { country: "UK", number: "999", type: "Emergency", description: "Emergency Services" },
  { country: "UK", number: "0808 2000 247", type: "Domestic Violence", description: "National DV Helpline" },
];

const safetyTips = [
  {
    icon: MapPin,
    title: "Share Your Location",
    description: "Always share your live location with a trusted contact when traveling alone."
  },
  {
    icon: Users,
    title: "Stay in Crowds",
    description: "Stick to well-lit, busy areas especially during evening hours."
  },
  {
    icon: Bell,
    title: "Trust Your Instincts",
    description: "If something feels wrong, leave the situation immediately and seek help."
  },
  {
    icon: MessageCircle,
    title: "Keep Someone Informed",
    description: "Tell someone your plans, expected arrival time, and route."
  }
];

const Emergency = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-danger/10 border border-danger/20 mb-6">
            <Siren className="w-4 h-4 text-danger" />
            <span className="text-sm font-medium text-danger">Emergency Resources</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gradient">Emergency</span> Help
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Quick access to emergency contacts, safety tips, and immediate help resources.
          </p>
          
          {/* Quick SOS */}
          <Button variant="emergency" size="xl" className="animate-pulse">
            <Phone className="w-6 h-6 mr-2" />
            SOS - Get Help Now
          </Button>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Emergency Contacts</h2>
            <p className="text-muted-foreground">
              Important numbers for immediate assistance. Save these contacts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="glass rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{contact.country}</span>
                    <h3 className="font-semibold">{contact.type}</h3>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    contact.type === 'Emergency' ? 'bg-danger/20 text-danger' : 'bg-primary/20 text-primary'
                  }`}>
                    {contact.type === 'Emergency' ? 'Urgent' : 'Help'}
                  </div>
                </div>
                <a 
                  href={`tel:${contact.number.replace(/\D/g, '')}`}
                  className="text-2xl font-bold text-primary hover:underline"
                >
                  {contact.number}
                </a>
                <p className="text-sm text-muted-foreground mt-2">{contact.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Safety Tips</h2>
            <p className="text-muted-foreground">
              Essential tips to help you stay safe in any situation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {safetyTips.map((tip) => (
              <div key={tip.title} className="glass rounded-2xl p-6 text-center">
                <div className="w-14 h-14 rounded-xl bg-safe/20 flex items-center justify-center mx-auto mb-4">
                  <tip.icon className="w-7 h-7 text-safe" />
                </div>
                <h3 className="font-semibold mb-2">{tip.title}</h3>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EmergencySection />
      
      {/* Alert Box */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="glass rounded-3xl p-8 md:p-12 max-w-4xl mx-auto border-2 border-danger/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-danger/10 to-transparent" />
            <div className="relative flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 rounded-2xl bg-danger/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-10 h-10 text-danger" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">In Immediate Danger?</h3>
                <p className="text-muted-foreground mb-4">
                  If you are in immediate danger, please call your local emergency number immediately. 
                  Your safety is the top priority.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="emergency">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Emergency
                  </Button>
                  <Button variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Silent Alert
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <SafetyChatbot />
    </div>
  );
};

export default Emergency;
