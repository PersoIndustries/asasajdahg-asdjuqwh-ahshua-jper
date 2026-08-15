CREATE TABLE public.plagas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  nombre text NOT NULL,
  descripcion text NOT NULL DEFAULT '',
  prevencion text NOT NULL DEFAULT '',
  combate text NOT NULL DEFAULT '',
  imagen_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.plagas TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.plagas TO authenticated;
GRANT ALL ON public.plagas TO service_role;
ALTER TABLE public.plagas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read plagas" ON public.plagas FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage plagas" ON public.plagas FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER update_plagas_updated_at BEFORE UPDATE ON public.plagas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.plaga_imagenes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plaga_id uuid NOT NULL REFERENCES public.plagas(id) ON DELETE CASCADE,
  imagen_url text NOT NULL,
  tag text NOT NULL DEFAULT '',
  orden integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX plaga_imagenes_plaga_id_idx ON public.plaga_imagenes(plaga_id);
GRANT SELECT ON public.plaga_imagenes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.plaga_imagenes TO authenticated;
GRANT ALL ON public.plaga_imagenes TO service_role;
ALTER TABLE public.plaga_imagenes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read plaga_imagenes" ON public.plaga_imagenes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage plaga_imagenes" ON public.plaga_imagenes FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.planta_plagas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  planta_id uuid NOT NULL REFERENCES public.plantas(id) ON DELETE CASCADE,
  plaga_id uuid NOT NULL REFERENCES public.plagas(id) ON DELETE CASCADE,
  orden integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (planta_id, plaga_id)
);
CREATE INDEX planta_plagas_planta_id_idx ON public.planta_plagas(planta_id);
GRANT SELECT ON public.planta_plagas TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.planta_plagas TO authenticated;
GRANT ALL ON public.planta_plagas TO service_role;
ALTER TABLE public.planta_plagas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read planta_plagas" ON public.planta_plagas FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage planta_plagas" ON public.planta_plagas FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));