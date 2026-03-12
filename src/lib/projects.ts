import { supabase } from "@/integrations/supabase/client";

export interface Project {
  id: string;
  title: string;
  description: string;
  domain: string;
  skills: string[];
  link?: string;
  hours?: number;
  images?: string[];
  title_en?: string;
  description_en?: string;
  domain_en?: string;
}

let cachedProjects: Project[] = [];

function rowToProject(row: any): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description || "",
    domain: row.domain || "",
    skills: row.skills || [],
    link: row.link || undefined,
    hours: row.hours || undefined,
    images: row.images?.length ? row.images : undefined,
    title_en: row.title_en || undefined,
    description_en: row.description_en || undefined,
    domain_en: row.domain_en || undefined,
  };
}

export function getProjects(): Project[] {
  return cachedProjects;
}

export function getProjectById(id: string): Project | undefined {
  return cachedProjects.find((p) => p.id === id);
}

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    cachedProjects = [];
    return [];
  }
  cachedProjects = data.map(rowToProject);
  return cachedProjects;
}

export async function addProject(project: Omit<Project, "id">): Promise<Project[]> {
  const maxOrder = cachedProjects.length;
  await supabase.from("projects").insert({
    title: project.title,
    description: project.description,
    domain: project.domain,
    skills: project.skills,
    link: project.link || "",
    hours: project.hours || 0,
    images: project.images || [],
    title_en: project.title_en || "",
    description_en: project.description_en || "",
    domain_en: project.domain_en || "",
    sort_order: maxOrder,
  });
  return fetchProjects();
}

export async function removeProject(id: string): Promise<Project[]> {
  await supabase.from("projects").delete().eq("id", id);
  return fetchProjects();
}

export async function updateProject(id: string, data: Omit<Project, "id">): Promise<Project[]> {
  await supabase.from("projects").update({
    title: data.title,
    description: data.description,
    domain: data.domain,
    skills: data.skills,
    link: data.link || "",
    hours: data.hours || 0,
    images: data.images || [],
    title_en: data.title_en || "",
    description_en: data.description_en || "",
    domain_en: data.domain_en || "",
  }).eq("id", id);
  return fetchProjects();
}

export async function saveProjects(projects: Project[]): Promise<void> {
  // Update sort orders
  for (let i = 0; i < projects.length; i++) {
    await supabase.from("projects").update({ sort_order: i }).eq("id", projects[i].id);
  }
  cachedProjects = projects;
}
