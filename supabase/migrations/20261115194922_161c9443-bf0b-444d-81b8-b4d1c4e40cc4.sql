create table public.horario_tienda (
  id text primary key default 'actual',
  titulo text not null default 'Horario de invierno · Actual',
  bloques jsonb not null default '[]'::jsonb,
  nota text not null default 'Domingos y festivos cerrado',
  updated_at timestamptz not null default now()
);
grant select on public.horario_tienda to anon;
grant select, insert, update, delete on public.horario_tienda to authenticated;
grant all on public.horario_tienda to service_role;
alter table public.horario_tienda enable row level security;
create policy "Public read horario" on public.horario_tienda for select to anon, authenticated using (true);
create policy "Admins manage horario" on public.horario_tienda for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger update_horario_updated_at before update on public.horario_tienda for each row execute function public.update_updated_at_column();
insert into public.horario_tienda (id, titulo, bloques, nota) values ('actual', 'Horario de invierno · Actual',
 '[{"dias":"Lunes a viernes","horas":["8:00 – 13:00","15:00 – 18:00"]},{"dias":"Sábados","horas":["9:00 – 13:00"]}]'::jsonb,
 'Domingos y festivos cerrado');