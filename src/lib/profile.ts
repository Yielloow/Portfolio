export interface Profile {
  firstName: string;
  lastName: string;
  photo: string; // base64 data URL or empty
  description: string;
  tagline: string;
  email: string;
  location: string;
  github: string;
  linkedin: string;
}

const STORAGE_KEY = "portfolio_profile";

const defaultProfile: Profile = {
  firstName: "Prénom",
  lastName: "Nom",
  photo: "",
  description: "En dernière année d'études universitaires, je combine rigueur académique et projets concrets pour développer des compétences solides en informatique. Mon objectif : créer des solutions qui font la différence.",
  tagline: "Étudiant en dernière année",
  email: "etudiant@universite.fr",
  location: "France",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
};

export function getProfile(): Profile {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return { ...defaultProfile, ...JSON.parse(stored) };
  return defaultProfile;
}

export function saveProfile(profile: Profile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
