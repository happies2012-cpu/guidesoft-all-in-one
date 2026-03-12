-- Communities Table
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  is_private BOOLEAN DEFAULT FALSE,
  members_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Community Members Table
CREATE TABLE IF NOT EXISTS public.community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- admin, moderator, member
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);

-- Enable RLS
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view public communities" ON public.communities 
FOR SELECT USING (NOT is_private OR EXISTS (
  SELECT 1 FROM public.community_members WHERE community_id = id AND user_id = auth.uid()
));

CREATE POLICY "Members can view membership" ON public.community_members
FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.community_members WHERE community_id = community_id AND user_id = auth.uid()
));

CREATE POLICY "Users can join public communities" ON public.community_members
FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.communities WHERE id = community_id AND NOT is_private)
  AND auth.uid() = user_id
);

-- Function to increment members count
CREATE OR REPLACE FUNCTION public.handle_community_member_added()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.communities 
  SET members_count = members_count + 1
  WHERE id = NEW.community_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_community_member_added
  AFTER INSERT ON public.community_members
  FOR EACH ROW EXECUTE FUNCTION public.handle_community_member_added();
