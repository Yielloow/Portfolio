export interface Project {
  id: string;
  title: string;
  description: string;
  domain: string;
  skills: string[];
  link?: string;
}

const STORAGE_KEY = "portfolio_projects";

const defaultProjects: Project[] = [
  {
    id: "1",
    title: "Application de Gestion de Tâches",
    description: "Une application web complète permettant la gestion de tâches avec authentification, tableaux Kanban et notifications en temps réel.",
    domain: "Développement Web",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    link: "https://github.com/example/task-app",
  },
  {
    id: "2",
    title: "Analyse de Données Climatiques",
    description: "Projet de data science utilisant le machine learning pour prédire les tendances climatiques à partir de données historiques.",
    domain: "Data Science",
    skills: ["Python", "TensorFlow", "Pandas", "Matplotlib"],
  },
  {
    id: "3",
    title: "Application Mobile E-Commerce",
    description: "Application mobile cross-platform avec panier d'achat, système de paiement intégré et gestion des commandes.",
    domain: "Mobile",
    skills: ["React Native", "Firebase", "Stripe API"],
    link: "https://github.com/example/ecommerce",
  },
];

export function getProjects(): Project[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProjects));
  return defaultProjects;
}

export function saveProjects(projects: Project[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function addProject(project: Omit<Project, "id">): Project[] {
  const projects = getProjects();
  const newProject = { ...project, id: crypto.randomUUID() };
  const updated = [...projects, newProject];
  saveProjects(updated);
  return updated;
}

export function removeProject(id: string): Project[] {
  const projects = getProjects().filter((p) => p.id !== id);
  saveProjects(projects);
  return projects;
}

export function updateProject(id: string, data: Omit<Project, "id">): Project[] {
  const projects = getProjects().map((p) => (p.id === id ? { ...p, ...data } : p));
  saveProjects(projects);
  return projects;
}
