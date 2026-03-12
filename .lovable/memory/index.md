# Portfolio Project

- **Theme**: Dark with gold accents (Space Grotesk + Inter)
- **Admin auth**: Supabase Auth (email/password login)
- **Data**: All data persisted in Lovable Cloud database (profile, projects, timeline, testimonials, skill_hours, partners tables)
- **Storage**: Files (photos, logos, CVs, project images) stored in "portfolio" storage bucket
- **Lang**: FR/EN bilingual, i18n context, language picker on first visit
- **Translation**: Hybrid — manual EN fields + auto-translate button via Lovable AI edge function
- **Backend**: Lovable Cloud for database, storage, auth, and translate edge function
- **Architecture**: Sync getX() reads from cache, async fetchX() loads from DB. DataProvider pre-loads all data on app start.
- **RLS**: Public SELECT on all tables. Authenticated INSERT/UPDATE/DELETE for admin tables. Public INSERT for testimonials.
- **Models**: Profile has _en fields (description, tagline, location); Project has _en (title, description, domain); Timeline has _en (title, organization, description)
