-- 在與網站相同的 Supabase 專案執行一次。非破壞性：不修改既有 music_pairs / 練習紀錄。
create table if not exists public.xj_user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  teacher_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.xj_user_roles enable row level security;
grant select, insert, update on public.xj_user_roles to authenticated;
drop policy if exists xj_roles_self_select on public.xj_user_roles;
create policy xj_roles_self_select on public.xj_user_roles for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists xj_roles_self_insert on public.xj_user_roles;
create policy xj_roles_self_insert on public.xj_user_roles for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists xj_roles_self_update on public.xj_user_roles;
create policy xj_roles_self_update on public.xj_user_roles for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
notify pgrst, 'reload schema';
