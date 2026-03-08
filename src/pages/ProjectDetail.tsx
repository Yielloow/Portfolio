import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Clock } from "lucide-react";
import { getProjectById } from "@/lib/projects";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = id ? getProjectById(id) : undefined;
  const { lang, t } = useI18n();

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold mb-4">{t("detail.not_found")}</h1>
          <Link to="/" className="text-primary hover:underline">{t("detail.back_portfolio")}</Link>
        </div>
      </div>
    );
  }

  const pTitle = lang === "en" && project.title_en ? project.title_en : project.title;
  const pDesc = lang === "en" && project.description_en ? project.description_en : project.description;
  const pDomain = lang === "en" && project.domain_en ? project.domain_en : project.domain;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /><span className="text-sm font-medium">{t("detail.back")}</span>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="text-xs font-heading tracking-wider uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">{pDomain}</span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mt-4 mb-4">{pTitle}</h1>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            {project.hours && <div className="flex items-center gap-2 text-muted-foreground text-sm"><Clock className="w-4 h-4 text-primary" /><span>{project.hours}{t("projects.hours")}</span></div>}
            {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-primary text-sm hover:underline"><ExternalLink className="w-4 h-4" />{t("projects.view")}</a>}
          </div>

          <div className="glass-card rounded-xl p-8 mb-8">
            <h2 className="font-heading font-semibold text-lg mb-3">{t("detail.description")}</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{pDesc}</p>
          </div>

          <div className="glass-card rounded-xl p-8 mb-8">
            <h2 className="font-heading font-semibold text-lg mb-4">{t("detail.skills")}</h2>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((s) => <span key={s} className="text-sm px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-medium">{s}</span>)}
            </div>
          </div>

          {project.images && project.images.length > 0 && (
            <div className="glass-card rounded-xl p-8">
              <h2 className="font-heading font-semibold text-lg mb-4">{t("detail.gallery")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.images.map((img, i) => (
                  <div key={i} className="rounded-lg overflow-hidden border border-border/50 aspect-video"><img src={img} alt={`${pTitle} - ${i + 1}`} className="w-full h-full object-cover" /></div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
