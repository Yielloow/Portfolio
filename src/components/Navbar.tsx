import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Globe, Sun, Moon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/hooks/use-theme";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useI18n();
  const { theme, toggleTheme } = useTheme();

  const links = [
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.timeline"), href: "#timeline" },
    { label: t("nav.projects"), href: "#projects" },
    { label: t("nav.contact"), href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-6xl 3xl:max-w-7xl 4k:max-w-[1800px] mx-auto px-6 h-16 3xl:h-20 flex items-center justify-between">
        <Link to="/" className="font-heading font-bold text-xl text-foreground">
          Portfolio<span className="text-primary">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
              {l.label}
            </a>
          ))}
          <button
            onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang === "fr" ? "EN" : "FR"}
          </button>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors font-medium"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
          <Link to="/admin" className="text-sm px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors font-medium">
            {t("nav.admin")}
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-foreground">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-b border-border px-6 pb-4 space-y-3">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground">
              {l.label}
            </a>
          ))}
          <button
            onClick={() => { setLang(lang === "fr" ? "en" : "fr"); setOpen(false); }}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang === "fr" ? "English" : "Français"}
          </button>
          <button
            onClick={() => { toggleTheme(); setOpen(false); }}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <Link to="/admin" onClick={() => setOpen(false)} className="block text-sm text-primary font-medium">
            {t("nav.admin")}
          </Link>
        </div>
      )}
    </nav>
  );
}
