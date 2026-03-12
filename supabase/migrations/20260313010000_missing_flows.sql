-- Live Streams Table
CREATE TABLE IF NOT EXISTS public.live_streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  host TEXT,
  description TEXT,
  status TEXT DEFAULT 'scheduled', -- scheduled, live, completed
  viewers_count INTEGER DEFAULT 0,
  thumbnail_url TEXT,
  stream_url TEXT,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Channels Table
CREATE TABLE IF NOT EXISTS public.channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  subscribers_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(subscriber_id, channel_id)
);

-- News Articles Table
CREATE TABLE IF NOT EXISTS public.news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  category TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workspaces Table
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workspace Members Table
CREATE TABLE IF NOT EXISTS public.workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- owner, admin, member
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- Enable RLS
ALTER TABLE public.live_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- Basic Policies
CREATE POLICY "Anyone can view live streams" ON public.live_streams FOR SELECT USING (true);
CREATE POLICY "Anyone can view channels" ON public.channels FOR SELECT USING (true);
CREATE POLICY "Anyone can view articles" ON public.news_articles FOR SELECT USING (is_published = true);

CREATE POLICY "Paid users can subscribe" ON public.subscriptions FOR INSERT WITH CHECK (
  auth.uid() = subscriber_id AND public.has_completed_payment(auth.uid())
);

CREATE POLICY "Workspace members can view" ON public.workspaces FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.workspace_members WHERE workspace_id = id AND user_id = auth.uid())
);
