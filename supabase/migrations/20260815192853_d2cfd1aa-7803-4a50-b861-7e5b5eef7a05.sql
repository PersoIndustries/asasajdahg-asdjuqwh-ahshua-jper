CREATE TABLE public.materiales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seccion text NOT NULL DEFAULT 'sustratos',
  nombre text NOT NULL,
  uso text NOT NULL DEFAULT '',
  formato text NOT NULL DEFAULT '',
  detalle text NOT NULL DEFAULT '',
  marca text NOT NULL DEFAULT '',
  imagen_url text,
  orden integer NOT NULL DEFAULT 0,
  publicado boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.materiales TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.materiales TO authenticated;
GRANT ALL ON public.materiales TO service_role;

ALTER TABLE public.materiales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published materiales" ON public.materiales
  FOR SELECT TO anon USING (publicado = true);

CREATE POLICY "Auth read materiales" ON public.materiales
  FOR SELECT TO authenticated USING (publicado = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage materiales" ON public.materiales
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_materiales_updated_at
  BEFORE UPDATE ON public.materiales
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();