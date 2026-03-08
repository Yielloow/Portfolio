export interface Partner {
  id: string;
  name: string;
  logo: string; // base64 data URL or URL
  url?: string;
}

const STORAGE_KEY = "portfolio_partners";

export function getPartners(): Partner[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  return [];
}

export function savePartners(partners: Partner[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(partners));
}

export function addPartner(partner: Omit<Partner, "id">): Partner[] {
  const partners = getPartners();
  const updated = [...partners, { ...partner, id: crypto.randomUUID() }];
  savePartners(updated);
  return updated;
}

export function removePartner(id: string): Partner[] {
  const partners = getPartners().filter((p) => p.id !== id);
  savePartners(partners);
  return partners;
}

export function updatePartner(id: string, data: Omit<Partner, "id">): Partner[] {
  const partners = getPartners().map((p) => (p.id === id ? { ...p, ...data } : p));
  savePartners(partners);
  return partners;
}
