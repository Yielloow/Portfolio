import { supabase } from "@/integrations/supabase/client";

export interface Partner {
  id: string;
  name: string;
  logo: string;
  url?: string;
}

let cachedPartners: Partner[] = [];

function rowToPartner(row: any): Partner {
  return {
    id: row.id,
    name: row.name,
    logo: row.logo || "",
    url: row.url || undefined,
  };
}

export function getPartners(): Partner[] {
  return cachedPartners;
}

export async function fetchPartners(): Promise<Partner[]> {
  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    cachedPartners = [];
    return [];
  }
  cachedPartners = data.map(rowToPartner);
  return cachedPartners;
}

export async function addPartner(partner: Omit<Partner, "id">): Promise<Partner[]> {
  const maxOrder = cachedPartners.length;
  await supabase.from("partners").insert({
    name: partner.name,
    logo: partner.logo,
    url: partner.url || "",
    sort_order: maxOrder,
  });
  return fetchPartners();
}

export async function removePartner(id: string): Promise<Partner[]> {
  await supabase.from("partners").delete().eq("id", id);
  return fetchPartners();
}

export async function updatePartner(id: string, data: Omit<Partner, "id">): Promise<Partner[]> {
  await supabase.from("partners").update({
    name: data.name,
    logo: data.logo,
    url: data.url || "",
  }).eq("id", id);
  return fetchPartners();
}
