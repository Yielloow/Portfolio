import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Edit2, Save, X, ExternalLink } from "lucide-react";
import { getProjects, addProject, removeProject, updateProject, type Project } from "@/lib/projects";
import { toast } from "sonner";
import AdminLogin from "@/components/AdminLogin";

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("admin_auth") === "1");
  const [projects, setProjects] = useState<Project[]>(getProjects());

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [skillsStr, setSkillsStr] = useState("");
  const [link, setLink] = useState("");

  const resetForm = () => {
    setTitle(""); setDescription(""); setDomain(""); setSkillsStr(""); setLink("");
    setShowForm(false); setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !domain.trim() || !skillsStr.trim()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    const skills = skillsStr.split(",").map((s) => s.trim()).filter(Boolean);
    const data = { title: title.trim(), description: description.trim(), domain: domain.trim(), skills, link: link.trim() || undefined };

    if (editingId) {
      setProjects(updateProject(editingId, data));
      toast.success("Projet mis à jour !");
    } else {
      setProjects(addProject(data));
      toast.success("Projet ajouté !");
    }
    resetForm();
  };

  const startEdit = (p: Project) => {
    setTitle(p.title); setDescription(p.description); setDomain(p.domain);
    setSkillsStr(p.skills.join(", ")); setLink(p.link || "");
    setEditingId(p.id); setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setProjects(removeProject(id));
    toast.success("Projet supprimé");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Retour au portfolio</span>
          </Link>
          <h1 className="font-heading font-bold text-lg">
            Admin<span className="text-primary">.</span>
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Add button */}
        {!showForm && (
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="mb-8 flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-heading font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Ajouter un projet
          </button>
        )}

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 mb-8 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-heading font-semibold text-lg">
                {editingId ? "Modifier le projet" : "Nouveau projet"}
              </h2>
              <button type="button" onClick={resetForm} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Titre *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-secondary text-foreground rounded-lg px-4 py-2.5 text-sm border border-border focus:border-primary focus:outline-none transition-colors" placeholder="Mon projet" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Domaine *</label>
                <input value={domain} onChange={(e) => setDomain(e.target.value)} className="w-full bg-secondary text-foreground rounded-lg px-4 py-2.5 text-sm border border-border focus:border-primary focus:outline-none transition-colors" placeholder="Web, Mobile, Data..." />
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Description *</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full bg-secondary text-foreground rounded-lg px-4 py-2.5 text-sm border border-border focus:border-primary focus:outline-none transition-colors resize-none" placeholder="Décrivez votre projet..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Compétences * (séparées par des virgules)</label>
                <input value={skillsStr} onChange={(e) => setSkillsStr(e.target.value)} className="w-full bg-secondary text-foreground rounded-lg px-4 py-2.5 text-sm border border-border focus:border-primary focus:outline-none transition-colors" placeholder="React, TypeScript, Python..." />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Lien (optionnel)</label>
                <input value={link} onChange={(e) => setLink(e.target.value)} className="w-full bg-secondary text-foreground rounded-lg px-4 py-2.5 text-sm border border-border focus:border-primary focus:outline-none transition-colors" placeholder="https://..." />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-heading font-medium hover:opacity-90 transition-opacity">
                <Save className="w-4 h-4" /> {editingId ? "Mettre à jour" : "Ajouter"}
              </button>
              <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors text-sm">
                Annuler
              </button>
            </div>
          </form>
        )}

        {/* Project list */}
        <div className="space-y-4">
          {projects.length === 0 && (
            <p className="text-muted-foreground text-center py-12">Aucun projet. Ajoutez-en un !</p>
          )}
          {projects.map((p) => (
            <div key={p.id} className="glass-card rounded-xl p-5 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-heading tracking-wider uppercase text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                    {p.domain}
                  </span>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener" className="text-muted-foreground hover:text-primary">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <h3 className="font-heading font-semibold text-foreground">{p.title}</h3>
                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {p.skills.map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">{s}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(p)} className="p-2 rounded-lg border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg border border-border hover:border-destructive/50 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
