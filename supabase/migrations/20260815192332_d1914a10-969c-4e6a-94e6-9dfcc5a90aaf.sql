ALTER TABLE public.plagas ADD COLUMN IF NOT EXISTS otros_datos text NOT NULL DEFAULT '';

DELETE FROM public.planta_calendario pc
USING public.planta_calendario keep
WHERE lower(trim(pc.planta_nombre)) = lower(trim(keep.planta_nombre))
  AND coalesce(lower(trim(pc.ciclo)), '') = coalesce(lower(trim(keep.ciclo)), '')
  AND pc.ctid > keep.ctid;