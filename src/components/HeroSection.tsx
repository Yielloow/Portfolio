import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail, User } from "lucide-react";
import { getProfile } from "@/lib/profile";
import { useI18n } from "@/lib/i18n";

export default function HeroSection() {
  const profile = getProfile();
  const { t } = useI18n();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(hsl(38 90% 55%) 1px, transparent 1px), linear-gradient(90deg, hsl(38 90% 55%) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, hsl(38 90% 55%), transparent 70%)" }} />

      <div className="relative z-10 text-center px-6 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          {profile.photo ? (
            <div className="w-28 h-28 rounded-full mx-auto mb-6 border-2 border-primary/30 overflow-hidden">
              <img src={profile.photo} alt={`${profile.firstName} ${profile.lastName}`} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-28 h-28 rounded-full mx-auto mb-6 border-2 border-primary/30 bg-secondary flex items-center justify-center">
              <User className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-4">{profile.tagline}</p>
          <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight mb-6">
            {profile.firstName} <span className="text-gradient">{profile.lastName}</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-10 font-body leading-relaxed">{profile.description}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }} className="flex items-center justify-center gap-5">
          <a href="#projects" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3 rounded-lg font-heading font-medium hover:opacity-90 transition-opacity">
            {t("hero.cta")}
          </a>
          <div className="flex gap-3">
            <a href="#contact" className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"><Mail className="w-5 h-5" /></a>
            {profile.github && <a href={profile.github} target="_blank" rel="noopener" className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"><Github className="w-5 h-5" /></a>}
            {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener" className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"><Linkedin className="w-5 h-5" /></a>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-12">
          <ArrowDown className="w-5 h-5 text-muted-foreground animate-bounce mx-auto" />
        </motion.div>
      </div>
    </section>
  );
}
