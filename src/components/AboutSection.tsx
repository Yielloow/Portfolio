import { motion } from "framer-motion";
import { Code, Database, Smartphone, Brain } from "lucide-react";

const skills = [
  { icon: Code, label: "Développement Web", desc: "React, TypeScript, Node.js" },
  { icon: Database, label: "Bases de Données", desc: "PostgreSQL, MongoDB, Firebase" },
  { icon: Smartphone, label: "Mobile", desc: "React Native, Flutter" },
  { icon: Brain, label: "Data & IA", desc: "Python, TensorFlow, Pandas" },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-primary font-heading text-sm tracking-[0.2em] uppercase mb-3">À propos</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
            Un parcours guidé par la <span className="text-gradient">curiosité</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed mb-16">
            En dernière année d'études universitaires, je combine rigueur académique et projets concrets pour développer des compétences solides en informatique. Mon objectif : créer des solutions qui font la différence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 hover:glow-accent transition-shadow duration-300"
            >
              <skill.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-heading font-semibold text-foreground mb-1">{skill.label}</h3>
              <p className="text-muted-foreground text-sm">{skill.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
