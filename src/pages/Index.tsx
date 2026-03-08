import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import TimelineSection from "@/components/TimelineSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PartnersMarquee from "@/components/PartnersMarquee";
import { useI18n } from "@/lib/i18n";
import { getProfile } from "@/lib/profile";

const Index = () => {
  const { t } = useI18n();
  const profile = getProfile();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      {profile.skills_enabled && <SkillsSection />}
      {profile.partners_enabled && <PartnersMarquee />}
      <TimelineSection />
      <ProjectsSection />
      {profile.testimonials_enabled && <TestimonialsSection />}
      <ContactSection />
      <footer className="py-8 text-center text-muted-foreground text-sm border-t border-border/50">
        <p>{t("footer.text")}</p>
      </footer>
    </div>
  );
};

export default Index;
