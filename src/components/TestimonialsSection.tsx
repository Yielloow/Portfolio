import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getApprovedTestimonials, addTestimonial } from "@/lib/testimonials";
import { toast } from "sonner";

export default function TestimonialsSection() {
  const { t } = useI18n();
  const [testimonials, setTestimonials] = useState(getApprovedTestimonials());
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error(t("testimonials.error"));
      return;
    }
    addTestimonial(name, message);
    setName("");
    setMessage("");
    setSubmitted(true);
    toast.success(t("testimonials.success"));
  };

  return (
    <section id="testimonials" className="py-24 3xl:py-32 4k:py-40 px-6">
      <div className="max-w-5xl 3xl:max-w-6xl 4k:max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs 3xl:text-sm font-heading tracking-[0.3em] uppercase text-primary">
            {t("testimonials.label")}
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl 3xl:text-5xl 4k:text-6xl mt-3 text-foreground">
            {t("testimonials.title_start")}
            <span className="text-gradient">{t("testimonials.title_highlight")}</span>
          </h2>
        </div>

        {/* Approved testimonials */}
        {testimonials.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            <AnimatePresence>
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="glass-card rounded-xl p-6 flex flex-col justify-between h-[160px] border border-border/50"
                >
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-4 h-4 text-primary/50 mt-0.5 shrink-0" />
                    <p className="text-foreground text-sm leading-relaxed line-clamp-3">"{t.message}"</p>
                  </div>
                  <p className="text-primary font-heading font-medium text-xs tracking-wide mt-auto pt-3 border-t border-border/30">— {t.name}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Submission form */}
        {!submitted ? (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-xl p-6 max-w-md mx-auto space-y-4"
          >
            <h3 className="font-heading font-semibold text-foreground text-center">
              {t("testimonials.form_title")}
            </h3>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("testimonials.name_placeholder")}
              maxLength={30}
              className="w-full bg-secondary text-foreground rounded-lg px-4 py-2.5 text-sm border border-border focus:border-primary focus:outline-none transition-colors"
            />
            <div className="relative">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 50))}
                placeholder={t("testimonials.message_placeholder")}
                maxLength={50}
                className="w-full bg-secondary text-foreground rounded-lg px-4 py-2.5 text-sm border border-border focus:border-primary focus:outline-none transition-colors pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{message.length}/50</span>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-heading font-medium hover:opacity-90 transition-opacity text-sm"
            >
              <Send className="w-4 h-4" /> {t("testimonials.submit")}
            </button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-xl p-8 max-w-md mx-auto text-center"
          >
            <p className="text-primary text-2xl mb-2">✨</p>
            <p className="text-foreground font-heading font-medium">{t("testimonials.thanks")}</p>
            <p className="text-muted-foreground text-sm mt-1">{t("testimonials.pending")}</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
