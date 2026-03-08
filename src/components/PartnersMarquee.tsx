import { motion } from "framer-motion";
import { getPartners } from "@/lib/partners";
import { useI18n } from "@/lib/i18n";

export default function PartnersMarquee() {
  const { t } = useI18n();
  const partners = getPartners();

  if (partners.length === 0) return null;

  // Repeat enough times to fill the viewport for seamless looping
  const repeatCount = Math.max(4, Math.ceil(20 / partners.length));
  const items = Array.from({ length: repeatCount }, () => partners).flat();

  return (
    <section className="py-12 3xl:py-14 4k:py-16 overflow-hidden">
      <div className="max-w-5xl 3xl:max-w-6xl 4k:max-w-7xl mx-auto px-6 mb-8">
        <p className="text-primary font-heading text-sm 3xl:text-base tracking-[0.2em] uppercase mb-3">
          {t("partners.label")}
        </p>
        <h2 className="font-heading text-3xl md:text-4xl 3xl:text-5xl 4k:text-6xl font-bold">
          {t("partners.title_start")}
          <span className="text-gradient">{t("partners.title_highlight")}</span>
        </h2>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-12 3xl:gap-16 items-center w-max"
          animate={{ x: ["0%", `-${100 / repeatCount * (repeatCount / 2)}%`] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: partners.length * 60,
              ease: "linear",
            },
          }}
        >
          {items.map((partner, i) => {
            const content = (
              <div
                className="flex items-center gap-4 glass-card rounded-xl px-6 py-4 3xl:px-8 3xl:py-5 hover:glow-accent transition-shadow duration-300 shrink-0"
              >
                {partner.logo && (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-10 h-10 3xl:w-12 3xl:h-12 object-contain rounded-md"
                  />
                )}
                <span className="font-heading font-semibold text-foreground whitespace-nowrap 3xl:text-lg">
                  {partner.name}
                </span>
              </div>
            );

            return partner.url ? (
              <a
                key={`${partner.id}-${i}`}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                {content}
              </a>
            ) : (
              <div key={`${partner.id}-${i}`} className="shrink-0">
                {content}
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
