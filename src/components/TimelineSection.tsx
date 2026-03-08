import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Rocket, Star } from "lucide-react";
import { getTimeline, formatDate, type TimelineItem } from "@/lib/timeline";

const typeIcons = {
  education: GraduationCap,
  work: Briefcase,
  project: Rocket,
  other: Star,
};

const typeLabels = {
  education: "Formation",
  work: "Expérience",
  project: "Projet",
  other: "Autre",
};

export default function TimelineSection() {
  const items = getTimeline();

  if (items.length === 0) return null;

  return (
    <section id="timeline" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-primary font-heading text-sm tracking-[0.2em] uppercase mb-3">Parcours</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            Mon <span className="text-gradient">parcours</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border" />

          {items.map((item, i) => {
            const Icon = typeIcons[item.type];
            const isLeft = i % 2 === 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex items-start mb-12 last:mb-0 ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Dot on line */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>

                {/* Content card */}
                <div className={`ml-20 md:ml-0 md:w-[calc(50%-2.5rem)] ${isLeft ? "md:pr-0 md:mr-auto" : "md:pl-0 md:ml-auto"}`}>
                  <div className="glass-card rounded-xl p-5 hover:glow-accent transition-shadow duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-heading tracking-wider uppercase text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                        {typeLabels[item.type]}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.startDate)} — {formatDate(item.endDate)}
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-foreground text-lg">{item.title}</h3>
                    <p className="text-primary/80 text-sm font-medium mb-2">{item.organization}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
