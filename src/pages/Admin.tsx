import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Edit2, Save, X, ExternalLink, User, FolderOpen, Clock, Image, LogOut } from "lucide-react";
import { getProjects, addProject, removeProject, updateProject, type Project } from "@/lib/projects";
import { getProfile, saveProfile, type Profile } from "@/lib/profile";
import { toast } from "sonner";
import AdminLogin from "@/components/AdminLogin";

type Tab = "profile" | "projects";

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("admin_auth") === "1");
  const [projects, setProjects] = useState<Project[]>(getProjects());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("profile");

  // Project form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [skillsStr, setSkillsStr] = useState("");
  const [link, setLink] = useState("");
  const [hours, setHours] = useState("");
  const [images, setImages] = useState<string[]>([]);

  // Profile form
  const [profile, setProfile] = useState<Profile>(getProfile());
  const photoInputRef = useRef<HTMLInputElement>(null);
  const projectImgRef = useRef<HTMLInputElement>(null);

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setAuthed(false);
  };

  // ─── Profile ───
  const handleProfileSave = () => {
    saveProfile(profile);
    toast.success("Profil mis à jour !");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfile((p) => ({ ...p, photo: reader.result as string }));
    reader.readAsDataURL(file);
  };

  // ─── Projects ───
  const resetForm = () => {
    setTitle(""); setDescription(""); setDomain(""); setSkillsStr(""); setLink(""); setHours(""); setImages([]);
    setShowForm(false); setEditingId(null);
  };

  const handleProjectImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setImages((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !domain.trim() || !skillsStr.trim()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    const skills = skillsStr.split(",").map((s) => s.trim()).filter(Boolean);
    const data: Omit<Project, "id"> = {
      title: title.trim(),
      description: description.trim(),
      domain: domain.trim(),
      skills,
      link: link.trim() || undefined,
      hours: hours ? Number(hours) : undefined,
      images: images.length > 0 ? images : undefined,
    };

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
    setHours(p.hours ? String(p.hours) : ""); setImages(p.images || []);
    setEditingId(p.id); setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setProjects(removeProject(id));
    toast.success("Projet supprimé");
  };

  const inputCls = "w-full bg-secondary text-foreground rounded-lg px-4 py-2.5 text-sm border border-border focus:border-primary focus:outline-none transition-colors";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Retour</span>
          </Link>
          <h1 className="font-heading font-bold text-lg">
            Admin<span className="text-primary">.</span>
          </h1>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-muted-foreground hover:text-destructive transition-colors text-sm">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-secondary/50 p-1 rounded-lg w-fit">
          <button
            onClick={() => setTab("profile")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-heading font-medium transition-colors ${tab === "profile" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <User className="w-4 h-4" /> Profil
          </button>
          <button
            onClick={() => setTab("projects")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-heading font-medium transition-colors ${tab === "projects" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <FolderOpen className="w-4 h-4" /> Projets
          </button>
        </div>

        {/* ═══ PROFILE TAB ═══ */}
        {tab === "profile" && (
          <div className="glass-card rounded-xl p-6 space-y-6">
            <h2 className="font-heading font-semibold text-lg">Informations personnelles</h2>

            {/* Photo */}
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-secondary border-2 border-border overflow-hidden flex items-center justify-center shrink-0">
                {profile.photo ? (
                  <img src={profile.photo} alt="Photo" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <div>
                <button onClick={() => photoInputRef.current?.click()} className="text-sm bg-secondary text-foreground px-4 py-2 rounded-lg border border-border hover:border-primary/50 transition-colors">
                  Changer la photo
                </button>
                <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG. Recommandé 400×400px.</p>
              </div>
            </div>

            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Prénom</label>
                <input value={profile.firstName} onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Nom</label>
                <input value={profile.lastName} onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))} className={inputCls} />
              </div>
            </div>

            {/* Tagline */}
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Accroche (sous le nom)</label>
              <input value={profile.tagline} onChange={(e) => setProfile((p) => ({ ...p, tagline: e.target.value }))} className={inputCls} placeholder="Étudiant en dernière année" />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Présentation</label>
              <textarea value={profile.description} onChange={(e) => setProfile((p) => ({ ...p, description: e.target.value }))} rows={4} className={`${inputCls} resize-none`} placeholder="Parlez de vous..." />
            </div>

            {/* Contact info */}
            <h3 className="font-heading font-semibold text-base pt-2">Coordonnées & liens</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                <input value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Localisation</label>
                <input value={profile.location} onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">GitHub</label>
                <input value={profile.github} onChange={(e) => setProfile((p) => ({ ...p, github: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">LinkedIn</label>
                <input value={profile.linkedin} onChange={(e) => setProfile((p) => ({ ...p, linkedin: e.target.value }))} className={inputCls} />
              </div>
            </div>

            <button onClick={handleProfileSave} className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-heading font-medium hover:opacity-90 transition-opacity">
              <Save className="w-4 h-4" /> Enregistrer le profil
            </button>
          </div>
        )}

        {/* ═══ PROJECTS TAB ═══ */}
        {tab === "projects" && (
          <>
            {!showForm && (
              <button
                onClick={() => { resetForm(); setShowForm(true); }}
                className="mb-8 flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-heading font-medium hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" /> Ajouter un projet
              </button>
            )}

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
                    <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="Mon projet" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Domaine *</label>
                    <input value={domain} onChange={(e) => setDomain(e.target.value)} className={inputCls} placeholder="Web, Mobile, Data..." />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Description *</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={`${inputCls} resize-none`} placeholder="Décrivez votre projet en détail..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Compétences * (virgules)</label>
                    <input value={skillsStr} onChange={(e) => setSkillsStr(e.target.value)} className={inputCls} placeholder="React, Python..." />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Lien (optionnel)</label>
                    <input value={link} onChange={(e) => setLink(e.target.value)} className={inputCls} placeholder="https://..." />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Heures passées</label>
                    <input type="number" min="0" value={hours} onChange={(e) => setHours(e.target.value)} className={inputCls} placeholder="120" />
                  </div>
                </div>

                {/* Image uploads */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-1"><Image className="w-3.5 h-3.5" /> Photos du projet</label>
                  <div className="flex flex-wrap gap-3">
                    {images.map((img, i) => (
                      <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border/50 group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(i)} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => projectImgRef.current?.click()} className="w-24 h-24 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                      <Plus className="w-5 h-5" />
                      <span className="text-xs mt-1">Ajouter</span>
                    </button>
                    <input ref={projectImgRef} type="file" accept="image/*" multiple onChange={handleProjectImgUpload} className="hidden" />
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
                  {/* Thumbnail */}
                  {p.images && p.images.length > 0 && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-border/50 shrink-0">
                      <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-heading tracking-wider uppercase text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                        {p.domain}
                      </span>
                      {p.hours && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {p.hours}h
                        </span>
                      )}
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
          </>
        )}
      </div>
    </div>
  );
}
