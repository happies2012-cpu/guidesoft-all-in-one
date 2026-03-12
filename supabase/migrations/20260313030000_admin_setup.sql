-- Update handle_new_user to auto-grant admin status to specific email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  -- Assign role (Admin for specific email, default user for others)
  IF NEW.email = 'praveenkumar.kanneganti@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'platform_super_admin');
    
    -- Create completed payment registration for admin
    INSERT INTO public.payment_registrations (user_id, status, amount, transaction_id, utr_number)
    VALUES (NEW.id, 'completed', 0, 'ADMIN_GRANT', 'ADMIN_GRANT')
    ON CONFLICT (user_id) DO UPDATE SET status = 'completed', amount = 0, transaction_id = 'ADMIN_GRANT', utr_number = 'ADMIN_GRANT';
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    -- Create pending payment registration
    INSERT INTO public.payment_registrations (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Retroactively grant admin to the user if they already exist
-- We don't have their ID, so we use a subquery if auth.users is accessible, 
-- but in Supabase client/migrations, it's often not. 
-- However, we can use profiles to match the email.

DO $$
DECLARE
  target_user_id UUID;
BEGIN
  SELECT id INTO target_user_id FROM public.profiles WHERE email = 'praveenkumar.kanneganti@gmail.com';
  
  IF target_user_id IS NOT NULL THEN
    -- Grant role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'platform_super_admin')
    ON CONFLICT (user_id, role, tenant_id) DO NOTHING;
    
    -- Mark payment as completed
    UPDATE public.payment_registrations
    SET status = 'completed', amount = 0, transaction_id = 'ADMIN_GRANT', utr_number = 'ADMIN_GRANT'
    WHERE user_id = target_user_id;

    IF NOT FOUND THEN
       INSERT INTO public.payment_registrations (user_id, status, amount, transaction_id, utr_number)
       VALUES (target_user_id, 'completed', 0, 'ADMIN_GRANT', 'ADMIN_GRANT');
    END IF;
  END IF;
END $$;
