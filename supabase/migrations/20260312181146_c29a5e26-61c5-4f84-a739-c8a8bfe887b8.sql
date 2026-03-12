
-- Profile table (single row)
CREATE TABLE public.profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL DEFAULT 'Prénom',
  last_name text NOT NULL DEFAULT 'Nom',
  photo text DEFAULT '',
  description text DEFAULT '',
  tagline text DEFAULT '',
  email text DEFAULT '',
  location text DEFAULT '',
  github text DEFAULT '',
  linkedin text DEFAULT '',
  description_en text DEFAULT '',
  tagline_en text DEFAULT '',
  location_en text DEFAULT '',
  cv_fr text DEFAULT '',
  cv_en text DEFAULT '',
  testimonials_enabled boolean DEFAULT true,
  skills_enabled boolean DEFAULT true,
  partners_enabled boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- Projects table
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  domain text NOT NULL DEFAULT '',
  skills text[] DEFAULT '{}',
  link text DEFAULT '',
  hours integer DEFAULT 0,
  images text[] DEFAULT '{}',
  title_en text DEFAULT '',
  description_en text DEFAULT '',
  domain_en text DEFAULT '',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Timeline table
CREATE TABLE public.timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  organization text NOT NULL DEFAULT '',
  description text DEFAULT '',
  start_date text NOT NULL DEFAULT '',
  end_date text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'other',
  title_en text DEFAULT '',
  organization_en text DEFAULT '',
  description_en text DEFAULT '',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Testimonials table
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  message text NOT NULL,
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Skill hours table
CREATE TABLE public.skill_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill text NOT NULL UNIQUE,
  hours integer DEFAULT 0
);

-- Partners table
CREATE TABLE public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo text DEFAULT '',
  url text DEFAULT '',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Public SELECT on all tables
CREATE POLICY "Public read profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read timeline" ON public.timeline FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public read skill_hours" ON public.skill_hours FOR SELECT USING (true);
CREATE POLICY "Public read partners" ON public.partners FOR SELECT USING (true);

-- Authenticated write on admin-managed tables
CREATE POLICY "Auth insert profile" ON public.profile FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update profile" ON public.profile FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete profile" ON public.profile FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update projects" ON public.projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete projects" ON public.projects FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert timeline" ON public.timeline FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update timeline" ON public.timeline FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete timeline" ON public.timeline FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth manage testimonials" ON public.testimonials FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete testimonials" ON public.testimonials FOR DELETE TO authenticated USING (true);
CREATE POLICY "Public insert testimonials" ON public.testimonials FOR INSERT WITH CHECK (true);

CREATE POLICY "Auth insert skill_hours" ON public.skill_hours FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update skill_hours" ON public.skill_hours FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete skill_hours" ON public.skill_hours FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert partners" ON public.partners FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update partners" ON public.partners FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete partners" ON public.partners FOR DELETE TO authenticated USING (true);

-- Insert default profile row
INSERT INTO public.profile (first_name, last_name, description, tagline, email, location, github, linkedin)
VALUES ('Prénom', 'Nom', 'En dernière année d''études universitaires, je combine rigueur académique et projets concrets pour développer des compétences solides en informatique. Mon objectif : créer des solutions qui font la différence.', 'Étudiant en dernière année', 'etudiant@universite.fr', 'Belgique', 'https://github.com', 'https://linkedin.com');
