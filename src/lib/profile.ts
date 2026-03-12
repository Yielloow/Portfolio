import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id?: string;
  firstName: string;
  lastName: string;
  photo: string;
  description: string;
  tagline: string;
  email: string;
  location: string;
  github: string;
  linkedin: string;
  description_en: string;
  tagline_en: string;
  location_en: string;
  cv_fr: string;
  cv_en: string;
  testimonials_enabled: boolean;
  skills_enabled: boolean;
  partners_enabled: boolean;
}

const defaultProfile: Profile = {
  firstName: "Prénom",
  lastName: "Nom",
  photo: "",
  description: "En dernière année d'études universitaires, je combine rigueur académique et projets concrets pour développer des compétences solides en informatique. Mon objectif : créer des solutions qui font la différence.",
  tagline: "Étudiant en dernière année",
  email: "etudiant@universite.fr",
  location: "Belgique",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  description_en: "",
  tagline_en: "",
  location_en: "",
  cv_fr: "",
  cv_en: "",
  testimonials_enabled: true,
  skills_enabled: true,
  partners_enabled: true,
};

function rowToProfile(row: any): Profile {
  return {
    id: row.id,
    firstName: row.first_name || defaultProfile.firstName,
    lastName: row.last_name || defaultProfile.lastName,
    photo: row.photo || "",
    description: row.description || defaultProfile.description,
    tagline: row.tagline || defaultProfile.tagline,
    email: row.email || defaultProfile.email,
    location: row.location || defaultProfile.location,
    github: row.github || defaultProfile.github,
    linkedin: row.linkedin || defaultProfile.linkedin,
    description_en: row.description_en || "",
    tagline_en: row.tagline_en || "",
    location_en: row.location_en || "",
    cv_fr: row.cv_fr || "",
    cv_en: row.cv_en || "",
    testimonials_enabled: row.testimonials_enabled ?? true,
    skills_enabled: row.skills_enabled ?? true,
    partners_enabled: row.partners_enabled ?? true,
  };
}

// Cache for synchronous reads
let cachedProfile: Profile = defaultProfile;

export function getProfile(): Profile {
  return cachedProfile;
}

export async function fetchProfile(): Promise<Profile> {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .limit(1)
    .single();

  if (error || !data) {
    cachedProfile = defaultProfile;
    return defaultProfile;
  }
  cachedProfile = rowToProfile(data);
  return cachedProfile;
}

export async function saveProfile(profile: Profile): Promise<void> {
  const row = {
    first_name: profile.firstName,
    last_name: profile.lastName,
    photo: profile.photo,
    description: profile.description,
    tagline: profile.tagline,
    email: profile.email,
    location: profile.location,
    github: profile.github,
    linkedin: profile.linkedin,
    description_en: profile.description_en,
    tagline_en: profile.tagline_en,
    location_en: profile.location_en,
    cv_fr: profile.cv_fr,
    cv_en: profile.cv_en,
    testimonials_enabled: profile.testimonials_enabled,
    skills_enabled: profile.skills_enabled,
    partners_enabled: profile.partners_enabled,
    updated_at: new Date().toISOString(),
  };

  // Get existing profile id
  const { data: existing } = await supabase
    .from("profile")
    .select("id")
    .limit(1)
    .single();

  if (existing) {
    await supabase.from("profile").update(row).eq("id", existing.id);
  } else {
    await supabase.from("profile").insert(row);
  }
  cachedProfile = profile;
}
