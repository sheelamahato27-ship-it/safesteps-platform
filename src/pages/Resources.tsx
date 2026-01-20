import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SafetyChatbot } from "@/components/SafetyChatbot";
import { 
  BookOpen, 
  FileText, 
  Video, 
  Download,
  ExternalLink,
  Shield,
  Heart,
  Scale,
  Users,
  Headphones
} from "lucide-react";
import { Button } from "@/components/ui/button";

const resources = [
  {
    category: "Guides & Articles",
    icon: BookOpen,
    items: [
      { title: "Personal Safety 101", description: "Essential tips for staying safe in public spaces", type: "Article" },
      { title: "Digital Safety for Women", description: "Protect yourself online and on social media", type: "Guide" },
      { title: "Traveling Alone Safely", description: "Comprehensive guide for solo travelers", type: "Guide" },
      { title: "Recognizing Warning Signs", description: "How to identify potentially dangerous situations", type: "Article" },
    ]
  },
  {
    category: "Video Tutorials",
    icon: Video,
    items: [
      { title: "Self-Defense Basics", description: "Learn essential self-defense techniques", type: "Video" },
      { title: "Using SafeSteps App", description: "Complete tutorial on app features", type: "Tutorial" },
      { title: "Emergency Response Training", description: "What to do in emergency situations", type: "Video" },
    ]
  },
  {
    category: "Downloadable Resources",
    icon: Download,
    items: [
      { title: "Safety Checklist PDF", description: "Daily safety checklist for commuters", type: "PDF" },
      { title: "Emergency Contacts Card", description: "Printable card with emergency numbers", type: "PDF" },
      { title: "Safety Planning Worksheet", description: "Plan your safety strategy", type: "PDF" },
    ]
  }
];

const supportOrganizations = [
  {
    name: "Women's Safety Alliance",
    description: "Non-profit dedicated to women's safety education and advocacy",
    icon: Shield,
    link: "#"
  },
  {
    name: "Crisis Support Hotline",
    description: "24/7 confidential support for women in crisis",
    icon: Headphones,
    link: "#"
  },
  {
    name: "Legal Aid Society",
    description: "Free legal assistance for domestic violence survivors",
    icon: Scale,
    link: "#"
  },
  {
    name: "Community Support Groups",
    description: "Connect with local support groups and communities",
    icon: Users,
    link: "#"
  },
  {
    name: "Mental Health Resources",
    description: "Trauma-informed counseling and mental health support",
    icon: Heart,
    link: "#"
  }
];

const Resources = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Safety <span className="text-gradient">Resources</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Educational materials, guides, and support resources to help you stay informed and empowered.
          </p>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="space-y-16">
            {resources.map((category) => (
              <div key={category.category}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">{category.category}</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((item) => (
                    <div 
                      key={item.title}
                      className="glass rounded-2xl p-6 hover:border-primary/30 border border-white/10 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                          {item.type}
                        </span>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Organizations */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Support Organizations</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Connect with organizations dedicated to women's safety and support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {supportOrganizations.map((org) => (
              <a 
                key={org.name}
                href={org.link}
                className="glass rounded-2xl p-6 hover:border-primary/30 border border-white/10 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <org.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {org.name}
                </h3>
                <p className="text-sm text-muted-foreground">{org.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="glass rounded-3xl p-12 max-w-3xl mx-auto text-center">
            <FileText className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
            <p className="text-muted-foreground mb-8">
              Check out our frequently asked questions or chat with our AI safety assistant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="glow">
                View FAQs
              </Button>
              <Button variant="outline">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <SafetyChatbot />
    </div>
  );
};

export default Resources;
