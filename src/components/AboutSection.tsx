import { motion } from "framer-motion";
import { Code, Database, Smartphone, Brain } from "lucide-react";
import { getProfile } from "@/lib/profile";
import { useI18n } from "@/lib/i18n";

export default function AboutSection() {
  const profile = getProfile();
  const { lang, t } = useI18n();

  const desc = lang === "en" && profile.description_en ? profile.description_en : profile.description;

  const skills = [
    { icon: Code, label: t("about.skill.web"), desc: "React, TypeScript, Node.js" },
    { icon: Database, label: t("about.skill.db"), desc: "PostgreSQL, MongoDB, Firebase" },
    { icon: Smartphone, label: t("about.skill.mobile"), desc: "React Native, Flutter" },
    { icon: Brain, label: t("about.skill.data"), desc: "Python, TensorFlow, Pandas" },
  ];

  return (
    <section id="about" className="py-16 3xl:py-24 4k:py-28 px-6">
      <div className="max-w-5xl 3xl:max-w-6xl 4k:max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <p className="text-primary font-heading text-sm 3xl:text-base tracking-[0.2em] uppercase mb-3">{t("about.label")}</p>
          <h2 className="font-heading text-3xl md:text-4xl 3xl:text-5xl 4k:text-6xl font-bold mb-6">{t("about.title_start")}<span className="text-gradient">{t("about.title_highlight")}</span></h2>
          <p className="text-muted-foreground text-lg 3xl:text-xl 4k:text-2xl max-w-2xl 3xl:max-w-3xl leading-relaxed mb-16">{desc}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 3xl:gap-6 4k:gap-8">
          {skills.map((skill, i) => (
            <motion.div key={skill.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} className="glass-card rounded-xl p-6 3xl:p-8 4k:p-10 hover:glow-accent transition-shadow duration-300">
              <skill.icon className="w-8 h-8 3xl:w-10 3xl:h-10 4k:w-12 4k:h-12 text-primary mb-4" />
              <h3 className="font-heading font-semibold text-foreground mb-1 3xl:text-lg 4k:text-xl">{skill.label}</h3>
              <p className="text-muted-foreground text-sm 3xl:text-base 4k:text-lg">{skill.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
