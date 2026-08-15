-- ============ ROLES ============
create type public.app_role as enum ('admin', 'user');

create table public.profiles (
  id uuid primary key,
  email text,
  nombre text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  )
$$;

create policy "Users view own profile" on public.profiles
  for select to authenticated using (auth.uid() = id or public.has_role(auth.uid(), 'admin'));
create policy "Users insert own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
create policy "Users update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users view own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

-- ============ UPDATED_AT ============
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_profiles_updated_at before update on public.profiles
  for each row execute function public.update_updated_at_column();

-- ============ SIGNUP TRIGGER ============
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, nombre, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(coalesce(new.email,''), '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ PLANTAS ============
create table public.plantas (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nombre text not null,
  nombre_cientifico text,
  categoria text not null default 'hortícola',
  imagen_url text,
  descripcion text not null default '',
  curiosidades text,
  como_se_come text,
  temporada text,
  guia_id text,
  calendario_key text,
  es_temporada boolean not null default false,
  orden integer not null default 0,
  publicado boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.plantas to anon;
grant select, insert, update, delete on public.plantas to authenticated;
grant all on public.plantas to service_role;
alter table public.plantas enable row level security;

create policy "Public read published plantas" on public.plantas
  for select to anon, authenticated using (publicado = true or public.has_role(auth.uid(), 'admin'));
create policy "Admins manage plantas" on public.plantas
  for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create trigger update_plantas_updated_at before update on public.plantas
  for each row execute function public.update_updated_at_column();

-- ============ ENFERMEDADES ============
create table public.planta_enfermedades (
  id uuid primary key default gen_random_uuid(),
  planta_id uuid not null references public.plantas(id) on delete cascade,
  nombre text not null,
  combate text not null default '',
  imagen_url text,
  orden integer not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.planta_enfermedades to anon;
grant select, insert, update, delete on public.planta_enfermedades to authenticated;
grant all on public.planta_enfermedades to service_role;
alter table public.planta_enfermedades enable row level security;

create policy "Public read enfermedades" on public.planta_enfermedades
  for select to anon, authenticated using (true);
create policy "Admins manage enfermedades" on public.planta_enfermedades
  for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- ============ CALENDARIO ============
create table public.planta_calendario (
  id uuid primary key default gen_random_uuid(),
  planta_id uuid references public.plantas(id) on delete cascade,
  planta_nombre text not null,
  ciclo text,
  meses text[] not null default '{}',
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.planta_calendario to anon;
grant select, insert, update, delete on public.planta_calendario to authenticated;
grant all on public.planta_calendario to service_role;
alter table public.planta_calendario enable row level security;

create policy "Public read calendario" on public.planta_calendario
  for select to anon, authenticated using (true);
create policy "Admins manage calendario" on public.planta_calendario
  for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create trigger update_calendario_updated_at before update on public.planta_calendario
  for each row execute function public.update_updated_at_column();

-- ============ BLOG ============
create table public.noticias (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titulo text not null,
  resumen text not null default '',
  categoria text not null default 'Novedades',
  imagen_url text,
  autor text not null default 'Equipo Jardiper',
  fecha date not null default current_date,
  minutos integer not null default 3,
  destacada boolean not null default false,
  entradilla text not null default '',
  secciones jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}',
  publicado boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.noticias to anon;
grant select, insert, update, delete on public.noticias to authenticated;
grant all on public.noticias to service_role;
alter table public.noticias enable row level security;

create policy "Public read published noticias" on public.noticias
  for select to anon, authenticated using (publicado = true or public.has_role(auth.uid(), 'admin'));
create policy "Admins manage noticias" on public.noticias
  for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create trigger update_noticias_updated_at before update on public.noticias
  for each row execute function public.update_updated_at_column();