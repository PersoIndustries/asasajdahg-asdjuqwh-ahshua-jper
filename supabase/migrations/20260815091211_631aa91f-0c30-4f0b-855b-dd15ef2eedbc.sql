-- Simplify public read policies so anon does not need has_role
drop policy "Public read published plantas" on public.plantas;
create policy "Public read published plantas" on public.plantas
  for select to anon using (publicado = true);
create policy "Auth read plantas" on public.plantas
  for select to authenticated using (publicado = true or public.has_role(auth.uid(), 'admin'));

drop policy "Public read published noticias" on public.noticias;
create policy "Public read published noticias" on public.noticias
  for select to anon using (publicado = true);
create policy "Auth read noticias" on public.noticias
  for select to authenticated using (publicado = true or public.has_role(auth.uid(), 'admin'));

-- Lock down SECURITY DEFINER functions
revoke all on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;

revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.update_updated_at_column() from public, anon, authenticated;