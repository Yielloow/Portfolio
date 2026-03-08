export interface Profile {
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

const STORAGE_KEY = "portfolio_profile";

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

export function getProfile(): Profile {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return { ...defaultProfile, ...JSON.parse(stored) };
  return defaultProfile;
}

export function saveProfile(profile: Profile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
