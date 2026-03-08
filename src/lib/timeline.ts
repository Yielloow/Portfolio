export interface TimelineItem {
  id: string;
  title: string;
  organization: string;
  description: string;
  startDate: string;
  endDate: string;
  type: "education" | "work" | "project" | "other";
  // English translations
  title_en?: string;
  organization_en?: string;
  description_en?: string;
}

const STORAGE_KEY = "portfolio_timeline";

const defaultTimeline: TimelineItem[] = [
  {
    id: "1",
    title: "Bachelier en Informatique",
    organization: "Université de Bruxelles",
    description: "Formation complète en informatique couvrant la programmation, les bases de données, les réseaux et l'intelligence artificielle.",
    startDate: "2022-09",
    endDate: "present",
    type: "education",
  },
  {
    id: "2",
    title: "Stage Développeur Web",
    organization: "TechStartup SA",
    description: "Développement d'applications web avec React et Node.js dans un environnement agile.",
    startDate: "2024-06",
    endDate: "2024-08",
    type: "work",
  },
  {
    id: "3",
    title: "Projet Hackathon – 1ère place",
    organization: "BeCode Hackathon",
    description: "Conception et développement d'une application en 48h sur le thème de la mobilité durable.",
    startDate: "2024-03",
    endDate: "2024-03",
    type: "project",
  },
];

export function getTimeline(): TimelineItem[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTimeline));
  return defaultTimeline;
}

export function saveTimeline(items: TimelineItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addTimelineItem(item: Omit<TimelineItem, "id">): TimelineItem[] {
  const items = getTimeline();
  const newItem = { ...item, id: crypto.randomUUID() };
  const updated = [...items, newItem];
  saveTimeline(updated);
  return updated;
}

export function removeTimelineItem(id: string): TimelineItem[] {
  const items = getTimeline().filter((i) => i.id !== id);
  saveTimeline(items);
  return items;
}

export function updateTimelineItem(id: string, data: Omit<TimelineItem, "id">): TimelineItem[] {
  const items = getTimeline().map((i) => (i.id === id ? { ...i, ...data } : i));
  saveTimeline(items);
  return items;
}

export function reorderTimeline(fromIndex: number, toIndex: number): TimelineItem[] {
  const items = [...getTimeline()];
  const [moved] = items.splice(fromIndex, 1);
  items.splice(toIndex, 0, moved);
  saveTimeline(items);
  return items;
}

export function formatDate(dateStr: string): string {
  if (dateStr === "present") return "Présent";
  const [year, month] = dateStr.split("-");
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
  return `${months[parseInt(month) - 1]} ${year}`;
}
