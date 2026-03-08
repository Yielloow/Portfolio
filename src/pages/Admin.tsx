import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Edit2, Save, X, ExternalLink, User, FolderOpen, Clock, Image, LogOut, ChevronUp, ChevronDown, Route, Languages, Loader2, FileText, Upload, MessageSquare, Check } from "lucide-react";
import { ArrowLeft, Plus, Trash2, Edit2, Save, X, ExternalLink, User, FolderOpen, Clock, Image, LogOut, ChevronUp, ChevronDown, Route, Languages, Loader2, FileText, Upload } from "lucide-react";
import { getProjects, addProject, removeProject, updateProject, type Project } from "@/lib/projects";
import { getProfile, saveProfile, type Profile } from "@/lib/profile";
import { getTimeline, addTimelineItem, removeTimelineItem, updateTimelineItem, reorderTimeline, type TimelineItem } from "@/lib/timeline";
import { getTestimonials, approveTestimonial, removeTestimonial, type Testimonial } from "@/lib/testimonials";
import { translateTexts } from "@/lib/translate";
import { toast } from "sonner";
import AdminLogin from "@/components/AdminLogin";

type Tab = "profile" | "projects" | "timeline" | "testimonials";

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("admin_auth") === "1");
  const [projects, setProjects] = useState<Project[]>(getProjects());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("profile");
  const [translating, setTranslating] = useState(false);

  // Project form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [skillsStr, setSkillsStr] = useState("");
  const [link, setLink] = useState("");
  const [hours, setHours] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [titleEn, setTitleEn] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [domainEn, setDomainEn] = useState("");

  // Profile form
  const [profile, setProfile] = useState<Profile>(getProfile());
  const photoInputRef = useRef<HTMLInputElement>(null);
  const projectImgRef = useRef<HTMLInputElement>(null);
  const cvFrRef = useRef<HTMLInputElement>(null);
  const cvEnRef = useRef<HTMLInputElement>(null);

  // Timeline
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>(getTimeline());

  // Testimonials
  const [testimonialItems, setTestimonialItems] = useState<Testimonial[]>(getTestimonials());
  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [editingTimelineId, setEditingTimelineId] = useState<string | null>(null);
  const [tlTitle, setTlTitle] = useState("");
  const [tlOrg, setTlOrg] = useState("");
  const [tlDesc, setTlDesc] = useState("");
  const [tlStart, setTlStart] = useState("");
  const [tlEnd, setTlEnd] = useState("");
  const [tlType, setTlType] = useState<TimelineItem["type"]>("education");
  const [tlTitleEn, setTlTitleEn] = useState("");
  const [tlOrgEn, setTlOrgEn] = useState("");
  const [tlDescEn, setTlDescEn] = useState("");

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;

  const handleLogout = () => { sessionStorage.removeItem("admin_auth"); setAuthed(false); };

  const inputCls = "w-full bg-secondary text-foreground rounded-lg px-4 py-2.5 text-sm border border-border focus:border-primary focus:outline-none transition-colors";
  const inputEnCls = "w-full bg-secondary/70 text-foreground rounded-lg px-4 py-2.5 text-sm border border-blue-500/30 focus:border-blue-500 focus:outline-none transition-colors";

  const TranslateBtn = ({ onClick, loading }: { onClick: () => void; loading: boolean }) => (
    <button type="button" onClick={onClick} disabled={loading} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors disabled:opacity-50 font-medium">
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Languages className="w-3 h-3" />}
      Auto-traduire EN
    </button>
  );

  // ─── Profile ───
  const handleProfileSave = () => { saveProfile(profile); toast.success("Profil mis à jour !"); };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfile((p) => ({ ...p, photo: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleCvUpload = (lang: "fr" | "en") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") { toast.error("Veuillez sélectionner un fichier PDF"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const key = lang === "fr" ? "cv_fr" : "cv_en";
      setProfile((p) => ({ ...p, [key]: reader.result as string }));
      toast.success(`CV ${lang.toUpperCase()} uploadé !`);
    };
    reader.readAsDataURL(file);
  };

  const translateProfile = async () => {
    setTranslating(true);
    try {
      const [desc, tag, loc] = await translateTexts([profile.description, profile.tagline, profile.location]);
      setProfile((p) => ({ ...p, description_en: desc, tagline_en: tag, location_en: loc }));
      toast.success("Traduction automatique effectuée !");
    } catch (e: any) { toast.error(e.message || "Erreur de traduction"); }
    setTranslating(false);
  };

  // ─── Projects ───
  const resetForm = () => {
    setTitle(""); setDescription(""); setDomain(""); setSkillsStr(""); setLink(""); setHours(""); setImages([]);
    setTitleEn(""); setDescriptionEn(""); setDomainEn("");
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

  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));

  const translateProject = async () => {
    setTranslating(true);
    try {
      const [t, d, dom] = await translateTexts([title, description, domain]);
      setTitleEn(t); setDescriptionEn(d); setDomainEn(dom);
      toast.success("Traduction automatique effectuée !");
    } catch (e: any) { toast.error(e.message || "Erreur de traduction"); }
    setTranslating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !domain.trim() || !skillsStr.trim()) {
      toast.error("Veuillez remplir tous les champs obligatoires"); return;
    }
    const skills = skillsStr.split(",").map((s) => s.trim()).filter(Boolean);
    const data: Omit<Project, "id"> = {
      title: title.trim(), description: description.trim(), domain: domain.trim(), skills,
      link: link.trim() || undefined, hours: hours ? Number(hours) : undefined,
      images: images.length > 0 ? images : undefined,
      title_en: titleEn.trim() || undefined, description_en: descriptionEn.trim() || undefined, domain_en: domainEn.trim() || undefined,
    };
    if (editingId) { setProjects(updateProject(editingId, data)); toast.success("Projet mis à jour !"); }
    else { setProjects(addProject(data)); toast.success("Projet ajouté !"); }
    resetForm();
  };

  const startEdit = (p: Project) => {
    setTitle(p.title); setDescription(p.description); setDomain(p.domain);
    setSkillsStr(p.skills.join(", ")); setLink(p.link || "");
    setHours(p.hours ? String(p.hours) : ""); setImages(p.images || []);
    setTitleEn(p.title_en || ""); setDescriptionEn(p.description_en || ""); setDomainEn(p.domain_en || "");
    setEditingId(p.id); setShowForm(true);
  };

  const handleDelete = (id: string) => { setProjects(removeProject(id)); toast.success("Projet supprimé"); };

  // ─── Timeline ───
  const resetTimelineForm = () => {
    setTlTitle(""); setTlOrg(""); setTlDesc(""); setTlStart(""); setTlEnd(""); setTlType("education");
    setTlTitleEn(""); setTlOrgEn(""); setTlDescEn("");
    setShowTimelineForm(false); setEditingTimelineId(null);
  };

  const translateTimeline = async () => {
    setTranslating(true);
    try {
      const [t, o, d] = await translateTexts([tlTitle, tlOrg, tlDesc]);
      setTlTitleEn(t); setTlOrgEn(o); setTlDescEn(d);
      toast.success("Traduction automatique effectuée !");
    } catch (e: any) { toast.error(e.message || "Erreur de traduction"); }
    setTranslating(false);
  };

  const handleTimelineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tlTitle.trim() || !tlOrg.trim() || !tlStart.trim() || !tlEnd.trim()) {
      toast.error("Veuillez remplir tous les champs obligatoires"); return;
    }
    const data: Omit<TimelineItem, "id"> = {
      title: tlTitle.trim(), organization: tlOrg.trim(), description: tlDesc.trim(),
      startDate: tlStart.trim(), endDate: tlEnd.trim(), type: tlType,
      title_en: tlTitleEn.trim() || undefined, organization_en: tlOrgEn.trim() || undefined, description_en: tlDescEn.trim() || undefined,
    };
    if (editingTimelineId) { setTimelineItems(updateTimelineItem(editingTimelineId, data)); toast.success("Élément mis à jour !"); }
    else { setTimelineItems(addTimelineItem(data)); toast.success("Élément ajouté !"); }
    resetTimelineForm();
  };

  const startTimelineEdit = (item: TimelineItem) => {
    setTlTitle(item.title); setTlOrg(item.organization); setTlDesc(item.description);
    setTlStart(item.startDate); setTlEnd(item.endDate); setTlType(item.type);
    setTlTitleEn(item.title_en || ""); setTlOrgEn(item.organization_en || ""); setTlDescEn(item.description_en || "");
    setEditingTimelineId(item.id); setShowTimelineForm(true);
  };

  const handleTimelineDelete = (id: string) => { setTimelineItems(removeTimelineItem(id)); toast.success("Élément supprimé"); };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= timelineItems.length) return;
    setTimelineItems(reorderTimeline(index, newIndex));
  };

  const typeLabels: Record<TimelineItem["type"], string> = { education: "🎓 Formation", work: "💼 Expérience", project: "🚀 Projet", other: "⭐ Autre" };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="w-4 h-4" /><span className="text-sm font-medium">Retour</span></Link>
          <h1 className="font-heading font-bold text-lg">Admin<span className="text-primary">.</span></h1>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-muted-foreground hover:text-destructive transition-colors text-sm"><LogOut className="w-4 h-4" /> Déconnexion</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex gap-1 mb-8 bg-secondary/50 p-1 rounded-lg w-fit">
          {([
            { key: "profile" as Tab, icon: <User className="w-4 h-4" />, label: "Profil" },
            { key: "projects" as Tab, icon: <FolderOpen className="w-4 h-4" />, label: "Projets" },
            { key: "timeline" as Tab, icon: <Route className="w-4 h-4" />, label: "Parcours" },
          ]).map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-heading font-medium transition-colors ${tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ═══ PROFILE TAB ═══ */}
        {tab === "profile" && (
          <div className="glass-card rounded-xl p-6 space-y-6">
            <h2 className="font-heading font-semibold text-lg">Informations personnelles</h2>

            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-secondary border-2 border-border overflow-hidden flex items-center justify-center shrink-0">
                {profile.photo ? <img src={profile.photo} alt="Photo" className="w-full h-full object-cover" /> : <User className="w-10 h-10 text-muted-foreground" />}
              </div>
              <div>
                <button onClick={() => photoInputRef.current?.click()} className="text-sm bg-secondary text-foreground px-4 py-2 rounded-lg border border-border hover:border-primary/50 transition-colors">Changer la photo</button>
                <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-sm text-muted-foreground mb-1 block">Prénom</label><input value={profile.firstName} onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))} className={inputCls} /></div>
              <div><label className="text-sm text-muted-foreground mb-1 block">Nom</label><input value={profile.lastName} onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))} className={inputCls} /></div>
            </div>

            {/* Tagline FR / EN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-sm text-muted-foreground mb-1 block">🇫🇷 Accroche</label><input value={profile.tagline} onChange={(e) => setProfile((p) => ({ ...p, tagline: e.target.value }))} className={inputCls} /></div>
              <div><label className="text-sm text-blue-400 mb-1 block">🇬🇧 Tagline (EN)</label><input value={profile.tagline_en} onChange={(e) => setProfile((p) => ({ ...p, tagline_en: e.target.value }))} className={inputEnCls} placeholder="Auto or manual" /></div>
            </div>

            {/* Description FR / EN */}
            <div><label className="text-sm text-muted-foreground mb-1 block">🇫🇷 Présentation</label><textarea value={profile.description} onChange={(e) => setProfile((p) => ({ ...p, description: e.target.value }))} rows={3} className={`${inputCls} resize-none`} /></div>
            <div><label className="text-sm text-blue-400 mb-1 block">🇬🇧 Description (EN)</label><textarea value={profile.description_en} onChange={(e) => setProfile((p) => ({ ...p, description_en: e.target.value }))} rows={3} className={`${inputEnCls} resize-none`} placeholder="Auto or manual" /></div>

            {/* Location FR / EN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-sm text-muted-foreground mb-1 block">🇫🇷 Localisation</label><input value={profile.location} onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))} className={inputCls} /></div>
              <div><label className="text-sm text-blue-400 mb-1 block">🇬🇧 Location (EN)</label><input value={profile.location_en} onChange={(e) => setProfile((p) => ({ ...p, location_en: e.target.value }))} className={inputEnCls} placeholder="Auto or manual" /></div>
            </div>

            <TranslateBtn onClick={translateProfile} loading={translating} />

            <h3 className="font-heading font-semibold text-base pt-2">Coordonnées & liens</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-sm text-muted-foreground mb-1 block">Email</label><input value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} className={inputCls} /></div>
              <div><label className="text-sm text-muted-foreground mb-1 block">GitHub</label><input value={profile.github} onChange={(e) => setProfile((p) => ({ ...p, github: e.target.value }))} className={inputCls} /></div>
              <div><label className="text-sm text-muted-foreground mb-1 block">LinkedIn</label><input value={profile.linkedin} onChange={(e) => setProfile((p) => ({ ...p, linkedin: e.target.value }))} className={inputCls} /></div>
            </div>

            <h3 className="font-heading font-semibold text-base pt-2">CV / Résumé (PDF)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> 🇫🇷 CV Français</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => cvFrRef.current?.click()} className="flex items-center gap-2 text-sm bg-secondary text-foreground px-4 py-2 rounded-lg border border-border hover:border-primary/50 transition-colors">
                    <Upload className="w-4 h-4" /> {profile.cv_fr ? "Remplacer" : "Uploader"}
                  </button>
                  {profile.cv_fr && <span className="text-xs text-primary">✓ Uploadé</span>}
                  {profile.cv_fr && <button type="button" onClick={() => setProfile((p) => ({ ...p, cv_fr: "" }))} className="text-xs text-destructive hover:underline">Supprimer</button>}
                </div>
                <input ref={cvFrRef} type="file" accept="application/pdf" onChange={handleCvUpload("fr")} className="hidden" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> 🇬🇧 CV English</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => cvEnRef.current?.click()} className="flex items-center gap-2 text-sm bg-secondary text-foreground px-4 py-2 rounded-lg border border-border hover:border-primary/50 transition-colors">
                    <Upload className="w-4 h-4" /> {profile.cv_en ? "Remplacer" : "Uploader"}
                  </button>
                  {profile.cv_en && <span className="text-xs text-primary">✓ Uploadé</span>}
                  {profile.cv_en && <button type="button" onClick={() => setProfile((p) => ({ ...p, cv_en: "" }))} className="text-xs text-destructive hover:underline">Supprimer</button>}
                </div>
                <input ref={cvEnRef} type="file" accept="application/pdf" onChange={handleCvUpload("en")} className="hidden" />
              </div>
            </div>

            <button onClick={handleProfileSave} className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-heading font-medium hover:opacity-90 transition-opacity"><Save className="w-4 h-4" /> Enregistrer le profil</button>
          </div>
        )}

        {/* ═══ PROJECTS TAB ═══ */}
        {tab === "projects" && (
          <>
            {!showForm && (
              <button onClick={() => { resetForm(); setShowForm(true); }} className="mb-8 flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-heading font-medium hover:opacity-90 transition-opacity"><Plus className="w-4 h-4" /> Ajouter un projet</button>
            )}

            {showForm && (
              <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 mb-8 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-heading font-semibold text-lg">{editingId ? "Modifier le projet" : "Nouveau projet"}</h2>
                  <button type="button" onClick={resetForm} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                </div>

                {/* Title FR/EN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-sm text-muted-foreground mb-1 block">🇫🇷 Titre *</label><input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="Mon projet" /></div>
                  <div><label className="text-sm text-blue-400 mb-1 block">🇬🇧 Title (EN)</label><input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className={inputEnCls} placeholder="Auto or manual" /></div>
                </div>

                {/* Domain FR/EN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-sm text-muted-foreground mb-1 block">🇫🇷 Domaine *</label><input value={domain} onChange={(e) => setDomain(e.target.value)} className={inputCls} placeholder="Web, Mobile..." /></div>
                  <div><label className="text-sm text-blue-400 mb-1 block">🇬🇧 Domain (EN)</label><input value={domainEn} onChange={(e) => setDomainEn(e.target.value)} className={inputEnCls} placeholder="Auto or manual" /></div>
                </div>

                {/* Description FR/EN */}
                <div><label className="text-sm text-muted-foreground mb-1 block">🇫🇷 Description *</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={`${inputCls} resize-none`} placeholder="Décrivez votre projet..." /></div>
                <div><label className="text-sm text-blue-400 mb-1 block">🇬🇧 Description (EN)</label><textarea value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} rows={3} className={`${inputEnCls} resize-none`} placeholder="Auto or manual" /></div>

                <TranslateBtn onClick={translateProject} loading={translating} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className="text-sm text-muted-foreground mb-1 block">Compétences * (virgules)</label><input value={skillsStr} onChange={(e) => setSkillsStr(e.target.value)} className={inputCls} placeholder="React, Python..." /></div>
                  <div><label className="text-sm text-muted-foreground mb-1 block">Lien (optionnel)</label><input value={link} onChange={(e) => setLink(e.target.value)} className={inputCls} placeholder="https://..." /></div>
                  <div><label className="text-sm text-muted-foreground mb-1 block flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Heures</label><input type="number" min="0" value={hours} onChange={(e) => setHours(e.target.value)} className={inputCls} placeholder="120" /></div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-1"><Image className="w-3.5 h-3.5" /> Photos</label>
                  <div className="flex flex-wrap gap-3">
                    {images.map((img, i) => (
                      <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border/50 group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(i)} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4 text-destructive" /></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => projectImgRef.current?.click()} className="w-24 h-24 rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-colors"><Plus className="w-5 h-5" /><span className="text-xs mt-1">Ajouter</span></button>
                    <input ref={projectImgRef} type="file" accept="image/*" multiple onChange={handleProjectImgUpload} className="hidden" />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-heading font-medium hover:opacity-90 transition-opacity"><Save className="w-4 h-4" /> {editingId ? "Mettre à jour" : "Ajouter"}</button>
                  <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors text-sm">Annuler</button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {projects.length === 0 && <p className="text-muted-foreground text-center py-12">Aucun projet. Ajoutez-en un !</p>}
              {projects.map((p) => (
                <div key={p.id} className="glass-card rounded-xl p-5 flex flex-col sm:flex-row sm:items-start gap-4">
                  {p.images && p.images.length > 0 && <div className="w-20 h-20 rounded-lg overflow-hidden border border-border/50 shrink-0"><img src={p.images[0]} alt="" className="w-full h-full object-cover" /></div>}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-heading tracking-wider uppercase text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">{p.domain}</span>
                      {p.hours && <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {p.hours}h</span>}
                      {p.title_en && <span className="text-xs text-blue-400">🇬🇧</span>}
                    </div>
                    <h3 className="font-heading font-semibold text-foreground">{p.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {p.skills.map((s) => <span key={s} className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">{s}</span>)}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => startEdit(p)} className="p-2 rounded-lg border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg border border-border hover:border-destructive/50 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ═══ TIMELINE TAB ═══ */}
        {tab === "timeline" && (
          <>
            {!showTimelineForm && (
              <button onClick={() => { resetTimelineForm(); setShowTimelineForm(true); }} className="mb-8 flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-heading font-medium hover:opacity-90 transition-opacity"><Plus className="w-4 h-4" /> Ajouter une étape</button>
            )}

            {showTimelineForm && (
              <form onSubmit={handleTimelineSubmit} className="glass-card rounded-xl p-6 mb-8 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-heading font-semibold text-lg">{editingTimelineId ? "Modifier l'étape" : "Nouvelle étape"}</h2>
                  <button type="button" onClick={resetTimelineForm} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                </div>

                {/* Title FR/EN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-sm text-muted-foreground mb-1 block">🇫🇷 Titre *</label><input value={tlTitle} onChange={(e) => setTlTitle(e.target.value)} className={inputCls} placeholder="Bachelier en Informatique" /></div>
                  <div><label className="text-sm text-blue-400 mb-1 block">🇬🇧 Title (EN)</label><input value={tlTitleEn} onChange={(e) => setTlTitleEn(e.target.value)} className={inputEnCls} placeholder="Auto or manual" /></div>
                </div>

                {/* Org FR/EN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-sm text-muted-foreground mb-1 block">🇫🇷 Organisation *</label><input value={tlOrg} onChange={(e) => setTlOrg(e.target.value)} className={inputCls} /></div>
                  <div><label className="text-sm text-blue-400 mb-1 block">🇬🇧 Organization (EN)</label><input value={tlOrgEn} onChange={(e) => setTlOrgEn(e.target.value)} className={inputEnCls} placeholder="Auto or manual" /></div>
                </div>

                {/* Desc FR/EN */}
                <div><label className="text-sm text-muted-foreground mb-1 block">🇫🇷 Description</label><textarea value={tlDesc} onChange={(e) => setTlDesc(e.target.value)} rows={3} className={`${inputCls} resize-none`} /></div>
                <div><label className="text-sm text-blue-400 mb-1 block">🇬🇧 Description (EN)</label><textarea value={tlDescEn} onChange={(e) => setTlDescEn(e.target.value)} rows={3} className={`${inputEnCls} resize-none`} placeholder="Auto or manual" /></div>

                <TranslateBtn onClick={translateTimeline} loading={translating} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className="text-sm text-muted-foreground mb-1 block">Date début * (AAAA-MM)</label><input value={tlStart} onChange={(e) => setTlStart(e.target.value)} className={inputCls} placeholder="2022-09" /></div>
                  <div><label className="text-sm text-muted-foreground mb-1 block">Date fin *</label><input value={tlEnd} onChange={(e) => setTlEnd(e.target.value)} className={inputCls} placeholder="2025-06 ou present" /></div>
                  <div><label className="text-sm text-muted-foreground mb-1 block">Type</label>
                    <select value={tlType} onChange={(e) => setTlType(e.target.value as TimelineItem["type"])} className={inputCls}>
                      <option value="education">🎓 Formation</option><option value="work">💼 Expérience</option><option value="project">🚀 Projet</option><option value="other">⭐ Autre</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-heading font-medium hover:opacity-90 transition-opacity"><Save className="w-4 h-4" /> {editingTimelineId ? "Mettre à jour" : "Ajouter"}</button>
                  <button type="button" onClick={resetTimelineForm} className="px-5 py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors text-sm">Annuler</button>
                </div>
              </form>
            )}

            <p className="text-sm text-muted-foreground mb-4">Utilisez les flèches pour réorganiser l'ordre.</p>
            <div className="space-y-3">
              {timelineItems.length === 0 && <p className="text-muted-foreground text-center py-12">Aucune étape.</p>}
              {timelineItems.map((item, index) => (
                <div key={item.id} className="glass-card rounded-xl p-5 flex items-start gap-4">
                  <div className="flex flex-col gap-1 shrink-0">
                    <button onClick={() => moveItem(index, "up")} disabled={index === 0} className="p-1.5 rounded-md border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-colors disabled:opacity-30"><ChevronUp className="w-4 h-4" /></button>
                    <button onClick={() => moveItem(index, "down")} disabled={index === timelineItems.length - 1} className="p-1.5 rounded-md border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-colors disabled:opacity-30"><ChevronDown className="w-4 h-4" /></button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-heading tracking-wider uppercase text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">{typeLabels[item.type]}</span>
                      <span className="text-xs text-muted-foreground">{item.startDate} → {item.endDate === "present" ? "Présent" : item.endDate}</span>
                      {item.title_en && <span className="text-xs text-blue-400">🇬🇧</span>}
                    </div>
                    <h3 className="font-heading font-semibold text-foreground">{item.title}</h3>
                    <p className="text-primary/80 text-sm font-medium">{item.organization}</p>
                    {item.description && <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{item.description}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => startTimelineEdit(item)} className="p-2 rounded-lg border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleTimelineDelete(item.id)} className="p-2 rounded-lg border border-border hover:border-destructive/50 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
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
