import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { getProjects } from "@/lib/projects";
import { useI18n } from "@/lib/i18n";

export default function ProjectsSection() {
  const projects = getProjects();
  const { lang, t } = useI18n();
  const [activeDomain, setActiveDomain] = useState<string | null>(null);

  // Collect unique domains
  const domains = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      const d = lang === "en" && p.domain_en ? p.domain_en : p.domain;
      set.add(d);
    });
    return Array.from(set);
  }, [projects, lang]);

  const filtered = activeDomain
    ? projects.filter((p) => {
        const d = lang === "en" && p.domain_en ? p.domain_en : p.domain;
        return d === activeDomain;
      })
    : projects;

  return (
    <section id="projects" className="py-24 3xl:py-32 4k:py-40 px-6">
      <div className="max-w-6xl 3xl:max-w-7xl 4k:max-w-[1800px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-12">
          <p className="text-primary font-heading text-sm 3xl:text-base tracking-[0.2em] uppercase mb-3">{t("projects.label")}</p>
          <h2 className="font-heading text-3xl md:text-4xl 3xl:text-5xl 4k:text-6xl font-bold">{t("projects.title_start")}<span className="text-gradient">{t("projects.title_highlight")}</span></h2>
        </motion.div>

        {/* Domain filters */}
        {domains.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveDomain(null)}
              className={`text-sm font-heading font-medium px-4 py-2 rounded-lg border transition-colors ${
                activeDomain === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              }`}
            >
              {t("projects.all")} <span className="ml-1 opacity-70">({projects.length})</span>
            </button>
            {domains.map((domain) => {
              const count = projects.filter((p) => {
                const d = lang === "en" && p.domain_en ? p.domain_en : p.domain;
                return d === domain;
              }).length;
              return (
                <button
                  key={domain}
                  onClick={() => setActiveDomain(domain)}
                  className={`text-sm font-heading font-medium px-4 py-2 rounded-lg border transition-colors ${
                    activeDomain === domain
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                  }`}
                >
                  {domain} <span className="ml-1 opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        )}

        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-center py-16">{t("projects.empty")}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-6 3xl:gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => {
                const pTitle = lang === "en" && project.title_en ? project.title_en : project.title;
                const pDesc = lang === "en" && project.description_en ? project.description_en : project.description;
                const pDomain = lang === "en" && project.domain_en ? project.domain_en : project.domain;

                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <Link to={`/project/${project.id}`} className="glass-card rounded-xl flex flex-col group hover:glow-accent transition-shadow duration-300 overflow-hidden block">
                      {project.images && project.images.length > 0 && (
                        <div className="aspect-video overflow-hidden">
                          <img src={project.images[0]} alt={pTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <span className="text-xs font-heading tracking-wider uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">{pDomain}</span>
                          <div className="flex items-center gap-2">
                            {project.hours && <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {project.hours}h</span>}
                            {project.link && (
                              <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                        <h3 className="font-heading text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{pTitle}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-4 line-clamp-3">{pDesc}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.skills.map((skill) => <span key={skill} className="text-xs px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground font-medium">{skill}</span>)}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
