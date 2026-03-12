import { supabase } from "@/integrations/supabase/client";

export interface TimelineItem {
  id: string;
  title: string;
  organization: string;
  description: string;
  startDate: string;
  endDate: string;
  type: "education" | "work" | "project" | "other";
  title_en?: string;
  organization_en?: string;
  description_en?: string;
}

let cachedTimeline: TimelineItem[] = [];

function rowToItem(row: any): TimelineItem {
  return {
    id: row.id,
    title: row.title,
    organization: row.organization || "",
    description: row.description || "",
    startDate: row.start_date || "",
    endDate: row.end_date || "",
    type: row.type || "other",
    title_en: row.title_en || undefined,
    organization_en: row.organization_en || undefined,
    description_en: row.description_en || undefined,
  };
}

export function getTimeline(): TimelineItem[] {
  return cachedTimeline;
}

export async function fetchTimeline(): Promise<TimelineItem[]> {
  const { data, error } = await supabase
    .from("timeline")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    cachedTimeline = [];
    return [];
  }
  cachedTimeline = data.map(rowToItem);
  return cachedTimeline;
}

export async function addTimelineItem(item: Omit<TimelineItem, "id">): Promise<TimelineItem[]> {
  const maxOrder = cachedTimeline.length;
  await supabase.from("timeline").insert({
    title: item.title,
    organization: item.organization,
    description: item.description,
    start_date: item.startDate,
    end_date: item.endDate,
    type: item.type,
    title_en: item.title_en || "",
    organization_en: item.organization_en || "",
    description_en: item.description_en || "",
    sort_order: maxOrder,
  });
  return fetchTimeline();
}

export async function removeTimelineItem(id: string): Promise<TimelineItem[]> {
  await supabase.from("timeline").delete().eq("id", id);
  return fetchTimeline();
}

export async function updateTimelineItem(id: string, data: Omit<TimelineItem, "id">): Promise<TimelineItem[]> {
  await supabase.from("timeline").update({
    title: data.title,
    organization: data.organization,
    description: data.description,
    start_date: data.startDate,
    end_date: data.endDate,
    type: data.type,
    title_en: data.title_en || "",
    organization_en: data.organization_en || "",
    description_en: data.description_en || "",
  }).eq("id", id);
  return fetchTimeline();
}

export async function reorderTimeline(fromIndex: number, toIndex: number): Promise<TimelineItem[]> {
  const items = [...cachedTimeline];
  const [moved] = items.splice(fromIndex, 1);
  items.splice(toIndex, 0, moved);

  for (let i = 0; i < items.length; i++) {
    await supabase.from("timeline").update({ sort_order: i }).eq("id", items[i].id);
  }
  cachedTimeline = items;
  return items;
}

export function formatDate(dateStr: string): string {
  if (dateStr === "present") return "Présent";
  const [year, month] = dateStr.split("-");
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
  return `${months[parseInt(month) - 1]} ${year}`;
}
