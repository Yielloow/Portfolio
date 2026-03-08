import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
      <footer className="py-8 text-center text-muted-foreground text-sm border-t border-border/50">
        <p>© 2026 — Conçu avec passion</p>
      </footer>
    </div>
  );
};

export default Index;
