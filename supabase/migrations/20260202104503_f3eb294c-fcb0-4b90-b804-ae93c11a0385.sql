-- Create app_role enum for RBAC
CREATE TYPE public.app_role AS ENUM (
  'platform_super_admin', 'platform_ops_admin', 'tenant_owner', 'executive_sponsor',
  'compliance_officer', 'security_officer', 'finance_ops', 'hr_ops',
  'product_director', 'engineering_director', 'marketing_director', 'sales_director',
  'support_director', 'program_manager', 'project_manager', 'product_manager',
  'team_lead', 'ux_lead', 'ui_designer', 'motion_designer',
  'backend_engineer', 'frontend_engineer', 'mobile_engineer', 'qa_lead', 'qa_engineer',
  'devops_sre', 'data_engineering_lead', 'data_analyst', 'community_manager', 'moderator',
  'partner_vendor_manager', 'ads_monetization_manager', 'brand_manager', 'seo_specialist',
  'growth_marketer', 'sales_rep', 'customer_success_manager', 'support_agent',
  'ai_program_director', 'mlops_ai_engineer', 'guest', 'user'
);

-- Create payment_status enum
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Create tenant_status enum
CREATE TYPE public.tenant_status AS ENUM ('pending_payment', 'active', 'suspended', 'deleted');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  tenant_id UUID,
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role, tenant_id)
);

-- Payment registrations table for ₹99 branding fee
CREATE TABLE public.payment_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL DEFAULT 99,
  currency TEXT NOT NULL DEFAULT 'INR',
  upi_id TEXT NOT NULL DEFAULT '8884162999@ybl',
  transaction_id TEXT,
  utr_number TEXT,
  status payment_status NOT NULL DEFAULT 'pending',
  payment_method TEXT DEFAULT 'upi',
  payment_proof_url TEXT,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Tenants table
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  industry_preset TEXT,
  logo_url TEXT,
  description TEXT,
  status tenant_status NOT NULL DEFAULT 'pending_payment',
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tenant members
CREATE TABLE public.tenant_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

-- Audit logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  tenant_id UUID REFERENCES public.tenants(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Posts table for social feed
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_urls TEXT[] DEFAULT '{}',
  post_type TEXT DEFAULT 'post',
  visibility TEXT DEFAULT 'public',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Likes table
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, comment_id),
  CHECK (post_id IS NOT NULL OR comment_id IS NOT NULL)
);

-- Follows table
CREATE TABLE public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT,
  media_url TEXT,
  message_type TEXT DEFAULT 'text',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT DEFAULT 'direct',
  name TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Conversation participants
CREATE TABLE public.conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Stories table
CREATE TABLE public.stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT DEFAULT 'image',
  caption TEXT,
  views_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cloud files table
CREATE TABLE public.cloud_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id),
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  size_bytes BIGINT DEFAULT 0,
  mime_type TEXT,
  storage_url TEXT NOT NULL,
  is_folder BOOLEAN DEFAULT FALSE,
  parent_id UUID REFERENCES public.cloud_files(id),
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cloud_files ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Check if user has completed payment
CREATE OR REPLACE FUNCTION public.has_completed_payment(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.payment_registrations
    WHERE user_id = _user_id AND status = 'completed'
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'platform_super_admin'));

-- Payment registrations policies
CREATE POLICY "Users can view own payments" ON public.payment_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own payment" ON public.payment_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pending payment" ON public.payment_registrations FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Tenants policies
CREATE POLICY "Users can view tenants they belong to" ON public.tenants FOR SELECT USING (
  owner_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.tenant_members WHERE tenant_id = id AND user_id = auth.uid())
);
CREATE POLICY "Paid users can create tenants" ON public.tenants FOR INSERT WITH CHECK (
  auth.uid() = owner_id AND public.has_completed_payment(auth.uid())
);
CREATE POLICY "Owners can update tenants" ON public.tenants FOR UPDATE USING (owner_id = auth.uid());

-- Tenant members policies
CREATE POLICY "Members can view tenant members" ON public.tenant_members FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.tenant_members tm WHERE tm.tenant_id = tenant_id AND tm.user_id = auth.uid())
);
CREATE POLICY "Owners can manage members" ON public.tenant_members FOR ALL USING (
  EXISTS (SELECT 1 FROM public.tenants WHERE id = tenant_id AND owner_id = auth.uid())
);

-- Audit logs policies
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT USING (
  public.has_role(auth.uid(), 'platform_super_admin') OR
  public.has_role(auth.uid(), 'compliance_officer')
);

-- Posts policies
CREATE POLICY "Anyone can view public posts" ON public.posts FOR SELECT USING (visibility = 'public' OR user_id = auth.uid());
CREATE POLICY "Paid users can create posts" ON public.posts FOR INSERT WITH CHECK (
  auth.uid() = user_id AND public.has_completed_payment(auth.uid())
);
CREATE POLICY "Users can update own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Anyone can view comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Paid users can create comments" ON public.comments FOR INSERT WITH CHECK (
  auth.uid() = user_id AND public.has_completed_payment(auth.uid())
);
CREATE POLICY "Users can update own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Anyone can view likes" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Paid users can like" ON public.likes FOR INSERT WITH CHECK (
  auth.uid() = user_id AND public.has_completed_payment(auth.uid())
);
CREATE POLICY "Users can unlike" ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Anyone can view follows" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Paid users can follow" ON public.follows FOR INSERT WITH CHECK (
  auth.uid() = follower_id AND public.has_completed_payment(auth.uid())
);
CREATE POLICY "Users can unfollow" ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- Messages policies
CREATE POLICY "Participants can view messages" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Paid participants can send messages" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND public.has_completed_payment(auth.uid()) AND
  EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);

-- Conversations policies
CREATE POLICY "Participants can view conversations" ON public.conversations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = id AND user_id = auth.uid())
);
CREATE POLICY "Paid users can create conversations" ON public.conversations FOR INSERT WITH CHECK (
  auth.uid() = created_by AND public.has_completed_payment(auth.uid())
);

-- Conversation participants policies
CREATE POLICY "Participants can view" ON public.conversation_participants FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid())
);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Stories policies
CREATE POLICY "Anyone can view active stories" ON public.stories FOR SELECT USING (expires_at > NOW());
CREATE POLICY "Paid users can create stories" ON public.stories FOR INSERT WITH CHECK (
  auth.uid() = user_id AND public.has_completed_payment(auth.uid())
);
CREATE POLICY "Users can delete own stories" ON public.stories FOR DELETE USING (auth.uid() = user_id);

-- Cloud files policies
CREATE POLICY "Users can view own files" ON public.cloud_files FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Paid users can upload files" ON public.cloud_files FOR INSERT WITH CHECK (
  auth.uid() = user_id AND public.has_completed_payment(auth.uid())
);
CREATE POLICY "Users can update own files" ON public.cloud_files FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own files" ON public.cloud_files FOR DELETE USING (auth.uid() = user_id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Create pending payment registration
  INSERT INTO public.payment_registrations (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_cloud_files_updated_at BEFORE UPDATE ON public.cloud_files FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_payment_registrations_updated_at BEFORE UPDATE ON public.payment_registrations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Indexes for performance
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON public.comments(post_id);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id, is_read);
CREATE INDEX idx_stories_user_id ON public.stories(user_id);
CREATE INDEX idx_stories_expires_at ON public.stories(expires_at);
CREATE INDEX idx_cloud_files_user_id ON public.cloud_files(user_id);
CREATE INDEX idx_follows_follower ON public.follows(follower_id);
CREATE INDEX idx_follows_following ON public.follows(following_id);
CREATE INDEX idx_payment_registrations_user_id ON public.payment_registrations(user_id);
CREATE INDEX idx_payment_registrations_status ON public.payment_registrations(status);