drop policy "Public read published guias" on public.guias;
create policy "Public read published guias" on public.guias for select to anon, authenticated using (publicado);
create policy "Admins read all guias" on public.guias for select to authenticated using (public.has_role(auth.uid(), 'admin'));