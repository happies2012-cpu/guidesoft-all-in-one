-- Create function to auto-assign admin role for specific email
CREATE OR REPLACE FUNCTION public.auto_assign_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'praveenkumar.kanneganti@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'platform_super_admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger on profiles to auto-assign admin
DROP TRIGGER IF EXISTS assign_admin_trigger ON public.profiles;
CREATE TRIGGER assign_admin_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_admin();

-- Also assign admin if profile already exists
DO $$
DECLARE
  _uid uuid;
BEGIN
  SELECT id INTO _uid FROM public.profiles WHERE email = 'praveenkumar.kanneganti@gmail.com';
  IF _uid IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_uid, 'platform_super_admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;