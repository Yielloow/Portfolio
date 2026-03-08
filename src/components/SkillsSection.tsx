import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { getProjects } from "@/lib/projects";
import { getSkillHours } from "@/lib/skillHours";
import { useI18n } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const INITIAL_COUNT = 2;

export default function SkillsSection() {
  const { lang, t } = useI18n();
  const projects = getProjects();
  const [expanded, setExpanded] = useState(false);

  const skillStats = useMemo(() => {
    // Get persisted hours (with manual overrides)
    const hoursMap = getSkillHours();
    // Also compute from projects to discover new skills
    const computed = computeSkillHoursFromProjects(projects);
    // Merge: persisted takes priority, but add any new skills from computed
    const merged: Record<string, number> = { ...computed, ...hoursMap };

    // Count projects per skill
    const countMap = new Map<string, number>();
    projects.forEach((p) => {
      p.skills.forEach((skill) => {
        countMap.set(skill, (countMap.get(skill) || 0) + 1);
      });
    });

    return Object.entries(merged)
      .map(([name, hours]) => ({ name, hours, count: countMap.get(name) || 0 }))
      .filter((s) => s.count > 0) // Only show skills that appear in projects
      .sort((a, b) => b.hours - a.hours || b.count - a.count);
  }, [projects, lang]);

  const maxHours = skillStats[0]?.hours || 1;
  const visible = expanded ? skillStats : skillStats.slice(0, INITIAL_COUNT);
  const hasMore = skillStats.length > INITIAL_COUNT;

  if (skillStats.length === 0) return null;

  return (
    <section id="skills" className="py-24 3xl:py-32 4k:py-40 px-6">
      <div className="max-w-5xl 3xl:max-w-6xl 4k:max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-primary font-heading text-sm 3xl:text-base tracking-[0.2em] uppercase mb-3">
            {t("skills.label")}
          </p>
          <h2 className="font-heading text-3xl md:text-4xl 3xl:text-5xl 4k:text-6xl font-bold">
            {t("skills.title_start")}
            <span className="text-gradient">{t("skills.title_highlight")}</span>
          </h2>
          <p className="text-muted-foreground text-lg 3xl:text-xl 4k:text-2xl max-w-2xl 3xl:max-w-3xl leading-relaxed mt-4">
            {t("skills.desc")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 3xl:gap-6">
          <AnimatePresence initial={false}>
            {visible.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i >= INITIAL_COUNT ? (i - INITIAL_COUNT) * 0.05 : 0 }}
                className="glass-card rounded-xl p-5 3xl:p-6 hover:glow-accent transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-heading font-semibold text-foreground 3xl:text-lg">
                    {skill.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {skill.count} {skill.count > 1 ? t("skills.projects_plural") : t("skills.projects_singular")}
                    </Badge>
                    {skill.hours > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {skill.hours}{t("skills.hours_suffix")}
                      </Badge>
                    )}
                  </div>
                </div>
                <Progress
                  value={maxHours > 0 ? (skill.hours / maxHours) * 100 : 0}
                  className="h-2"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {hasMore && (
          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-muted-foreground font-heading font-medium hover:text-foreground hover:border-primary/50 transition-colors"
            >
              {expanded ? t("skills.show_less") : t("skills.show_more")}
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.span>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
