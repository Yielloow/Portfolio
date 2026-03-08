export interface Testimonial {
  id: string;
  name: string;
  message: string;
  approved: boolean;
  createdAt: string;
}

const STORAGE_KEY = "portfolio_testimonials";

function load(): Testimonial[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}

function save(items: Testimonial[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getTestimonials(): Testimonial[] {
  return load();
}

export function getApprovedTestimonials(): Testimonial[] {
  return load().filter((t) => t.approved);
}

export function addTestimonial(name: string, message: string): Testimonial[] {
  const items = load();
  items.push({ id: crypto.randomUUID(), name: name.trim(), message: message.trim(), approved: false, createdAt: new Date().toISOString() });
  save(items);
  return items;
}

export function approveTestimonial(id: string): Testimonial[] {
  const items = load().map((t) => t.id === id ? { ...t, approved: true } : t);
  save(items);
  return items;
}

export function removeTestimonial(id: string): Testimonial[] {
  const items = load().filter((t) => t.id !== id);
  save(items);
  return items;
}
