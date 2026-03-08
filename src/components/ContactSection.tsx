import { motion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import { getProfile } from "@/lib/profile";
import { useI18n } from "@/lib/i18n";

export default function ContactSection() {
  const profile = getProfile();
  const { lang, t } = useI18n();
  const location = lang === "en" && profile.location_en ? profile.location_en : profile.location;

  return (
    <section id="contact" className="py-24 3xl:py-32 4k:py-40 px-6">
      <div className="max-w-3xl 3xl:max-w-4xl 4k:max-w-5xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <p className="text-primary font-heading text-sm 3xl:text-base tracking-[0.2em] uppercase mb-3">{t("contact.label")}</p>
          <h2 className="font-heading text-3xl md:text-4xl 3xl:text-5xl 4k:text-6xl font-bold mb-4">{t("contact.title_start")}<span className="text-gradient">{t("contact.title_highlight")}</span></h2>
          <p className="text-muted-foreground text-lg 3xl:text-xl 4k:text-2xl mb-10 max-w-lg 3xl:max-w-xl mx-auto">{t("contact.desc")}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a href={`mailto:${profile.email}`} className="glass-card rounded-xl px-8 py-5 flex items-center gap-3 hover:glow-accent transition-shadow duration-300">
            <Mail className="w-5 h-5 text-primary" /><span className="text-foreground font-medium">{profile.email}</span>
          </a>
          <div className="glass-card rounded-xl px-8 py-5 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary" /><span className="text-foreground font-medium">{location}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
