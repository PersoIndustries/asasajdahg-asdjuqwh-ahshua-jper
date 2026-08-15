delete from public.profiles p where not exists (select 1 from auth.users u where u.id = p.id);
delete from public.user_roles r where not exists (select 1 from auth.users u where u.id = r.user_id);
alter table public.profiles add constraint profiles_id_fkey foreign key (id) references auth.users(id) on delete cascade;
alter table public.user_roles add constraint user_roles_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;