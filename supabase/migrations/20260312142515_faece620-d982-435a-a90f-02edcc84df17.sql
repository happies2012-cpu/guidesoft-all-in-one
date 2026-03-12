-- Fix recursive RLS on conversation_participants
DROP POLICY IF EXISTS "Participants can view" ON public.conversation_participants;
CREATE POLICY "Participants can view own" ON public.conversation_participants
  FOR SELECT USING (auth.uid() = user_id);

-- Fix recursive RLS on conversations  
DROP POLICY IF EXISTS "Participants can view conversations" ON public.conversations;
CREATE POLICY "Participants can view conversations fixed" ON public.conversations
  FOR SELECT USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.conversation_participants cp
      WHERE cp.conversation_id = conversations.id AND cp.user_id = auth.uid()
    )
  );

-- Fix recursive RLS on tenant_members
DROP POLICY IF EXISTS "Members can view tenant members" ON public.tenant_members;
CREATE POLICY "Members can view own tenant memberships" ON public.tenant_members
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.tenants t
      WHERE t.id = tenant_members.tenant_id AND t.owner_id = auth.uid()
    )
  );

-- Fix recursive RLS on tenants
DROP POLICY IF EXISTS "Users can view tenants they belong to" ON public.tenants;
CREATE POLICY "Users can view own tenants" ON public.tenants
  FOR SELECT USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.tenant_members tm
      WHERE tm.tenant_id = tenants.id AND tm.user_id = auth.uid()
    )
  );

-- Add INSERT policy for conversation_participants
CREATE POLICY "Paid users can add participants" ON public.conversation_participants
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND has_completed_payment(auth.uid())
  );

-- Update UPI ID default to new one
ALTER TABLE public.payment_registrations ALTER COLUMN upi_id SET DEFAULT '8884162999-4@ybl';