import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Subtle grid bg */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(hsl(38 90% 55%) 1px, transparent 1px), linear-gradient(90deg, hsl(38 90% 55%) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* Glow orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, hsl(38 90% 55%), transparent 70%)" }} />

      <div className="relative z-10 text-center px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-primary font-heading text-sm tracking-[0.3em] uppercase mb-4">
            Étudiant en dernière année
          </p>
          <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight mb-6">
            Créateur de{" "}
            <span className="text-gradient">solutions</span>
            <br />
            numériques
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-10 font-body leading-relaxed">
            Passionné par le développement et l'innovation, je transforme des idées en expériences digitales impactantes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex items-center justify-center gap-5"
        >
          <a href="#projects" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3 rounded-lg font-heading font-medium hover:opacity-90 transition-opacity">
            Voir mes projets
          </a>
          <div className="flex gap-3">
            <a href="#contact" className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <Mail className="w-5 h-5" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener" className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener" className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <ArrowDown className="w-5 h-5 text-muted-foreground animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
