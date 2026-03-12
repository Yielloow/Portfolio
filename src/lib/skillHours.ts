import { supabase } from "@/integrations/supabase/client";

let cachedSkillHours: Record<string, number> = {};

export function getSkillHours(): Record<string, number> {
  return cachedSkillHours;
}

export async function fetchSkillHours(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from("skill_hours")
    .select("*");

  if (error || !data) {
    cachedSkillHours = {};
    return {};
  }
  cachedSkillHours = {};
  data.forEach((row: any) => {
    cachedSkillHours[row.skill] = row.hours || 0;
  });
  return cachedSkillHours;
}

export async function saveSkillHours(hours: Record<string, number>): Promise<void> {
  // Upsert all skill hours
  const rows = Object.entries(hours).map(([skill, h]) => ({
    skill,
    hours: h,
  }));

  // Delete all existing and re-insert
  await supabase.from("skill_hours").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  if (rows.length > 0) {
    await supabase.from("skill_hours").insert(rows);
  }
  cachedSkillHours = hours;
}

export function computeSkillHoursFromProjects(
  projects: { skills: string[]; hours?: number }[]
): Record<string, number> {
  const computed: Record<string, number> = {};
  projects.forEach((p) => {
    p.skills.forEach((skill) => {
      computed[skill] = (computed[skill] || 0) + (p.hours || 0);
    });
  });
  const stored = getSkillHours();
  const merged: Record<string, number> = {};
  for (const skill of Object.keys(computed)) {
    merged[skill] = stored[skill] !== undefined ? stored[skill] : computed[skill];
  }
  for (const skill of Object.keys(stored)) {
    if (!(skill in merged)) {
      merged[skill] = stored[skill];
    }
  }
  return merged;
}
