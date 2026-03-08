import { useMemo } from "react";
import { motion } from "framer-motion";
import { getProjects } from "@/lib/projects";
import { useI18n } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function SkillsSection() {
  const { lang, t } = useI18n();
  const projects = getProjects();

  const skillStats = useMemo(() => {
    const map = new Map<string, { count: number; hours: number }>();
    projects.forEach((p) => {
      p.skills.forEach((skill) => {
        const existing = map.get(skill) || { count: 0, hours: 0 };
        existing.count += 1;
        existing.hours += p.hours || 0;
        map.set(skill, existing);
      });
    });
    return Array.from(map.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.count - a.count || b.hours - a.hours);
  }, [projects, lang]);

  const maxCount = skillStats[0]?.count || 1;

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
          {skillStats.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
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
                value={(skill.count / maxCount) * 100}
                className="h-2"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
