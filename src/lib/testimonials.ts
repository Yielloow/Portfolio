import { supabase } from "@/integrations/supabase/client";

export interface Testimonial {
  id: string;
  name: string;
  message: string;
  approved: boolean;
  createdAt: string;
}

let cachedTestimonials: Testimonial[] = [];

function rowToTestimonial(row: any): Testimonial {
  return {
    id: row.id,
    name: row.name,
    message: row.message,
    approved: row.approved ?? false,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export function getTestimonials(): Testimonial[] {
  return cachedTestimonials;
}

export function getApprovedTestimonials(): Testimonial[] {
  return cachedTestimonials.filter((t) => t.approved);
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    cachedTestimonials = [];
    return [];
  }
  cachedTestimonials = data.map(rowToTestimonial);
  return cachedTestimonials;
}

export async function fetchApprovedTestimonials(): Promise<Testimonial[]> {
  await fetchTestimonials();
  return getApprovedTestimonials();
}

export async function addTestimonial(name: string, message: string): Promise<Testimonial[]> {
  await supabase.from("testimonials").insert({
    name: name.trim(),
    message: message.trim(),
    approved: false,
  });
  return fetchTestimonials();
}

export async function approveTestimonial(id: string): Promise<Testimonial[]> {
  await supabase.from("testimonials").update({ approved: true }).eq("id", id);
  return fetchTestimonials();
}

export async function removeTestimonial(id: string): Promise<Testimonial[]> {
  await supabase.from("testimonials").delete().eq("id", id);
  return fetchTestimonials();
}
