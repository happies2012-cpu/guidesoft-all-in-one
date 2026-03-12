-- Seed Premium Data for GUIDESOFT
-- Target: Populate Live, Channels, News, Workspaces, Communities with realistic entries

DO $$
DECLARE
  admin_id UUID;
BEGIN
  -- 1. Try to find the admin user
  SELECT id INTO admin_id FROM public.profiles WHERE email = 'praveenkumar.kanneganti@gmail.com' LIMIT 1;
  
  -- If no admin found, use a fallback UUID (this might fail FKs but let's assume admin exists or we use a temporary one)
  IF admin_id IS NULL THEN
     -- For now, we won't insert if no user found to avoid FK errors
     RAISE NOTICE 'No admin user found, skipping seed data.';
     RETURN;
  END IF;

  -- 2. Seed Communities
  INSERT INTO public.communities (owner_id, name, description, members_count, is_private)
  VALUES 
    (admin_id, 'AI & Automation Builders', 'A hub for developers building the future with LLMs and Agentic AI.', 1250, false),
    (admin_id, 'GUIDESOFT Power Users', 'Official community for GUIDESOFT platform experts and enthusiasts.', 850, false),
    (admin_id, 'Digital Nomads Hub', 'Networking and resources for those working remotely across the globe.', 2100, false)
  ON CONFLICT DO NOTHING;

  -- 3. Seed Channels
  INSERT INTO public.channels (owner_id, name, slug, description, subscribers_count, is_verified)
  VALUES 
    (admin_id, 'GUIDESOFT Official', 'guidesoft-official', 'The main channel for GUIDESOFT updates, tutorials, and deep-dives.', 15000, true),
    (admin_id, 'Tech with Praveen', 'praveen-tech', 'Daily insights on software architecture and high-scale applications.', 5400, true)
  ON CONFLICT (slug) DO NOTHING;

  -- 4. Seed Live Streams
  INSERT INTO public.live_streams (user_id, title, host, status, viewers_count, started_at)
  VALUES 
    (admin_id, 'Next-Gen Agentic UI Design', 'Praveen Kumar', 'live', 450, NOW()),
    (admin_id, 'Scaling Supabase for Production', 'Engineering Team', 'scheduled', 0, NOW() + INTERVAL '2 hours')
  ON CONFLICT DO NOTHING;

  -- 5. Seed News Articles
  INSERT INTO public.news_articles (author_id, title, slug, content, category, is_published, published_at)
  VALUES 
    (admin_id, 'GUIDESOFT reaches 1M active users', 'guidesoft-reaches-1m', 'We are proud to announce that GUIDESOFT has reached 1 million monthly active users...', 'Business', true, NOW()),
    (admin_id, 'The Future of AI Agents in 2026', 'future-ai-2026', 'AI Agents are no longer just chatbots; they are becoming autonomous collaborators...', 'Technology', true, NOW()),
    (admin_id, 'New Security Patch Released', 'security-patch-v2', 'GUIDESOFT has released a critical security patch for all enterprise clients...', 'Technology', true, NOW())
  ON CONFLICT (slug) DO NOTHING;

  -- 6. Seed Workspaces
  INSERT INTO public.workspaces (owner_id, name, description)
  VALUES 
    (admin_id, 'GUIDESOFT Core Team', 'Main workspace for internal GUIDESOFT development and planning.'),
    (admin_id, 'Community Outreach', 'Workspace for managing community events and collaborations.')
  ON CONFLICT DO NOTHING;

  -- 7. Join Admin to the seeded items
  -- (Self-join for communities and workspaces)
  INSERT INTO public.community_members (community_id, user_id, role)
  SELECT id, admin_id, 'admin' FROM public.communities WHERE owner_id = admin_id
  ON CONFLICT DO NOTHING;

  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  SELECT id, admin_id, 'owner' FROM public.workspaces WHERE owner_id = admin_id
  ON CONFLICT DO NOTHING;

END $$;
