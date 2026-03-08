import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { getProjects } from "@/lib/projects";

export default function ProjectsSection() {
  const projects = getProjects();

  const allDomains = ["Tous", ...Array.from(new Set(projects.map((p) => p.domain)))];

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-primary font-heading text-sm tracking-[0.2em] uppercase mb-3">Portfolio</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            Mes <span className="text-gradient">projets</span>
          </h2>
        </motion.div>

        {projects.length === 0 ? (
          <p className="text-muted-foreground text-center py-16">Aucun projet pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass-card rounded-xl p-6 flex flex-col group hover:glow-accent transition-shadow duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs font-heading tracking-wider uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {project.domain}
                  </span>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <h3 className="font-heading text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
