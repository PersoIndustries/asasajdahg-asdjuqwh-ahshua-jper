create table public.guias (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titulo text not null,
  resumen text not null default '',
  minutos integer not null default 5,
  categoria text not null default 'Huerto',
  imagen_url text,
  pdf_url text,
  contenido text not null default '',
  secciones jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}',
  fecha_publicacion date not null default current_date,
  orden integer not null default 0,
  publicado boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.guias to anon;
grant select, insert, update, delete on public.guias to authenticated;
grant all on public.guias to service_role;
alter table public.guias enable row level security;
create policy "Public read published guias" on public.guias for select to anon, authenticated using (publicado or public.has_role(auth.uid(), 'admin'));
create policy "Admins manage guias" on public.guias for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger update_guias_updated_at before update on public.guias for each row execute function public.update_updated_at_column();