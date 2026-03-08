const STORAGE_KEY = "portfolio_skill_hours";

export function getSkillHours(): Record<string, number> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  return {};
}

export function saveSkillHours(hours: Record<string, number>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(hours));
}

/** Recalculate skill hours from projects, merging with any manual overrides */
export function computeSkillHoursFromProjects(
  projects: { skills: string[]; hours?: number }[]
): Record<string, number> {
  const computed: Record<string, number> = {};
  projects.forEach((p) => {
    p.skills.forEach((skill) => {
      computed[skill] = (computed[skill] || 0) + (p.hours || 0);
    });
  });
  // Merge: keep manual overrides, add new skills from projects
  const stored = getSkillHours();
  const merged: Record<string, number> = {};
  // All skills from projects get computed value unless manually overridden
  for (const skill of Object.keys(computed)) {
    merged[skill] = stored[skill] !== undefined ? stored[skill] : computed[skill];
  }
  // Keep manually added skills not in projects
  for (const skill of Object.keys(stored)) {
    if (!(skill in merged)) {
      merged[skill] = stored[skill];
    }
  }
  return merged;
}
