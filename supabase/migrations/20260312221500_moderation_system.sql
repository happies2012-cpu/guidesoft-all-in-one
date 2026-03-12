-- Add moderation status to posts and comments
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'moderation_status') THEN
        CREATE TYPE public.moderation_status AS ENUM ('pending', 'approved', 'flagged', 'hidden', 'deleted');
    END IF;
END $$;

ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS moderation_status moderation_status DEFAULT 'approved';
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS moderation_status moderation_status DEFAULT 'approved';

-- Create Reports table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('post', 'comment', 'profile')),
    resource_id UUID NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on Reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Policies for Reports
CREATE POLICY "Users can create reports" ON public.reports
    FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports" ON public.reports
    FOR SELECT USING (auth.uid() = reporter_id);

CREATE POLICY "Admins can view all reports" ON public.reports
    FOR SELECT USING (public.has_role(auth.uid(), 'platform_super_admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Admins can update reports" ON public.reports
    FOR UPDATE USING (public.has_role(auth.uid(), 'platform_super_admin') OR public.has_role(auth.uid(), 'moderator'));

-- Update posts and comments policies for filtering based on moderation status
-- (Assuming we want hidden/deleted items to be hidden from standard users)
-- Note: Re-creating or updating policies depends on existing ones.
-- For now, we'll just allow admins to see and update all.

CREATE POLICY "Admins can moderate all posts" ON public.posts
    FOR ALL USING (public.has_role(auth.uid(), 'platform_super_admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Admins can moderate all comments" ON public.comments
    FOR ALL USING (public.has_role(auth.uid(), 'platform_super_admin') OR public.has_role(auth.uid(), 'moderator'));
