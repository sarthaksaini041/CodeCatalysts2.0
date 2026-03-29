-- Enable uuid-ossp extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Site Content (Key-Value Store)
CREATE TABLE IF NOT EXISTS public.site_content (
  key text PRIMARY KEY,
  content text NOT NULL,
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. Chapter 1 (Genesis) Items
CREATE TABLE IF NOT EXISTS public.chapter1_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Chapter 2 (Shift) - Principle Cards
CREATE TABLE IF NOT EXISTS public.chapter2_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- 4. Chapter 2 (Shift) - Stats Cards
CREATE TABLE IF NOT EXISTS public.chapter2_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- 5. Chapter 3 (Journey) - Steps
CREATE TABLE IF NOT EXISTS public.chapter3_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  layout_type text NOT NULL DEFAULT 'image-left', -- image-left, image-right, full-width
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- 6. Chapter 4 (Projects)
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  tech_stack text[] DEFAULT '{}',
  image_url text,
  live_link text,
  github_link text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- 7. Chapter 5 (Architects) - Showcase items
CREATE TABLE IF NOT EXISTS public.chapter5_showcase (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- 8. Team Members
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL, -- Lead, Rep, Member
  university text,
  tagline text,
  bio text,
  image_url text,
  linkedin text,
  github text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- 9. Footer Settings Row (Optional single row table)
CREATE TABLE IF NOT EXISTS public.footer_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  footer_text text,
  tagline text,
  linkedin_url text,
  github_url text,
  instagram_url text,
  updated_at timestamp with time zone DEFAULT now()
);

-- 10. Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  college text,
  year text,
  linkedin text,
  github text,
  portfolio text,
  domain text,
  tech_stack text,
  reason text,
  status text DEFAULT 'pending', -- pending, reviewed, accepted, rejected
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for all tables
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter1_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter2_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter2_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter3_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter5_showcase ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Applications
-- Allow anyone (anon & authenticated) to insert into applications
CREATE POLICY "Enable insert for all users" ON public.applications FOR INSERT WITH CHECK (true);

-- Allow authenticated users to see all applications (for admin panel)
CREATE POLICY "Enable select for authenticated only" ON public.applications FOR SELECT TO authenticated USING (true);

-- Select policies for public tables
CREATE POLICY "Enable read access for all" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Enable read access for all" ON public.chapter1_items FOR SELECT USING (true);
CREATE POLICY "Enable read access for all" ON public.chapter2_cards FOR SELECT USING (true);
CREATE POLICY "Enable read access for all" ON public.chapter2_stats FOR SELECT USING (true);
CREATE POLICY "Enable read access for all" ON public.chapter3_steps FOR SELECT USING (true);
CREATE POLICY "Enable read access for all" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Enable read access for all" ON public.chapter5_showcase FOR SELECT USING (true);
CREATE POLICY "Enable read access for all" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Enable read access for all" ON public.footer_settings FOR SELECT USING (true);
