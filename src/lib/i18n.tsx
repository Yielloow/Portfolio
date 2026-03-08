import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Lang = "fr" | "en";

const translations = {
  // Navbar
  "nav.about": { fr: "À propos", en: "About" },
  "nav.timeline": { fr: "Parcours", en: "Journey" },
  "nav.projects": { fr: "Projets", en: "Projects" },
  "nav.contact": { fr: "Contact", en: "Contact" },
  "nav.admin": { fr: "Admin", en: "Admin" },

  // Hero
  "hero.cta": { fr: "Voir mes projets", en: "View my projects" },

  // About
  "about.label": { fr: "À propos", en: "About" },
  "about.title_start": { fr: "Un parcours guidé par la ", en: "A journey driven by " },
  "about.title_highlight": { fr: "curiosité", en: "curiosity" },
  "about.skill.web": { fr: "Développement Web", en: "Web Development" },
  "about.skill.db": { fr: "Bases de Données", en: "Databases" },
  "about.skill.mobile": { fr: "Mobile", en: "Mobile" },
  "about.skill.data": { fr: "Data & IA", en: "Data & AI" },

  // Timeline
  "timeline.label": { fr: "Parcours", en: "Journey" },
  "timeline.title_start": { fr: "Mon ", en: "My " },
  "timeline.title_highlight": { fr: "parcours", en: "journey" },
  "timeline.type.education": { fr: "Formation", en: "Education" },
  "timeline.type.work": { fr: "Expérience", en: "Experience" },
  "timeline.type.project": { fr: "Projet", en: "Project" },
  "timeline.type.other": { fr: "Autre", en: "Other" },
  "timeline.present": { fr: "Présent", en: "Present" },

  // Projects
  "projects.label": { fr: "Portfolio", en: "Portfolio" },
  "projects.title_start": { fr: "Mes ", en: "My " },
  "projects.title_highlight": { fr: "projets", en: "projects" },
  "projects.empty": { fr: "Aucun projet pour le moment.", en: "No projects yet." },
  "projects.all": { fr: "Tous", en: "All" },
  "projects.hours": { fr: "h investies", en: "h invested" },
  "projects.view": { fr: "Voir le projet", en: "View project" },

  // Project detail
  "detail.back": { fr: "Retour", en: "Back" },
  "detail.not_found": { fr: "Projet introuvable", en: "Project not found" },
  "detail.back_portfolio": { fr: "Retour au portfolio", en: "Back to portfolio" },
  "detail.description": { fr: "Description", en: "Description" },
  "detail.skills": { fr: "Compétences utilisées", en: "Skills used" },
  "detail.gallery": { fr: "Galerie", en: "Gallery" },

  // Contact
  "contact.label": { fr: "Contact", en: "Contact" },
  "contact.title_start": { fr: "Travaillons ", en: "Let's work " },
  "contact.title_highlight": { fr: "ensemble", en: "together" },
  "contact.desc": { fr: "Vous avez un projet en tête ou souhaitez en savoir plus ? N'hésitez pas à me contacter.", en: "Have a project in mind or want to learn more? Don't hesitate to reach out." },

  // Footer
  "footer.text": { fr: "© 2026 — Conçu avec passion", en: "© 2026 — Built with passion" },

  // Language picker
  "lang.title": { fr: "Choisissez votre langue", en: "Choose your language" },
  "lang.fr": { fr: "Français", en: "French" },
  "lang.en": { fr: "Anglais", en: "English" },
} as const;

type TranslationKey = keyof typeof translations;

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem("portfolio_lang");
    return (stored === "en" || stored === "fr") ? stored : "fr";
  });

  const [showPicker, setShowPicker] = useState(() => !localStorage.getItem("portfolio_lang"));

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("portfolio_lang", l);
  };

  const t = (key: TranslationKey): string => {
    return translations[key]?.[lang] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {showPicker && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-8 max-w-sm w-full text-center space-y-6 border border-border/50">
            <div className="text-3xl">🌍</div>
            <h2 className="font-heading font-bold text-xl text-foreground">
              {lang === "fr" ? "Choisissez votre langue" : "Choose your language"}
            </h2>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setLang("fr"); setShowPicker(false); }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-medium hover:opacity-90 transition-opacity"
              >
                🇫🇷 Français
              </button>
              <button
                onClick={() => { setLang("en"); setShowPicker(false); }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-heading font-medium hover:border-primary/50 transition-colors"
              >
                🇬🇧 English
              </button>
            </div>
          </div>
        </div>
      )}
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
