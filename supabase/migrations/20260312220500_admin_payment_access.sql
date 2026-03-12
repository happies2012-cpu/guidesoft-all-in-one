CREATE POLICY "Admins can view all payments"
ON public.payment_registrations
FOR SELECT
USING (public.has_role(auth.uid(), 'platform_super_admin'));

CREATE POLICY "Admins can update all payments"
ON public.payment_registrations
FOR UPDATE
USING (public.has_role(auth.uid(), 'platform_super_admin'));
