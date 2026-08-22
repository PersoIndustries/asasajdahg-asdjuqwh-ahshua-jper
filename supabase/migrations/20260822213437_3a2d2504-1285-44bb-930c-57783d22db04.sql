-- Defensa en profundidad: quitar privilegios que ninguna política necesita
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM anon, authenticated;
REVOKE SELECT ON public.user_roles FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.profiles FROM anon;
REVOKE SELECT ON public.profiles FROM anon;
REVOKE DELETE ON public.profiles FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.plantas, public.planta_calendario, public.planta_enfermedades, public.planta_plagas, public.plagas, public.plaga_imagenes, public.noticias, public.materiales FROM anon;