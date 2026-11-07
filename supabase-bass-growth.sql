-- New table only. Does not alter existing practice or teacher tables.
create table if not exists public.bass_growth_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.bass_growth_profiles enable row level security;
revoke all on public.bass_growth_profiles from anon;
grant select, insert, update on public.bass_growth_profiles to authenticated;
drop policy if exists "bass_growth_owner_select" on public.bass_growth_profiles;
create policy "bass_growth_owner_select" on public.bass_growth_profiles for select to authenticated using (auth.uid() = user_id);
drop policy if exists "bass_growth_owner_insert" on public.bass_growth_profiles;
create policy "bass_growth_owner_insert" on public.bass_growth_profiles for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "bass_growth_owner_update" on public.bass_growth_profiles;
create policy "bass_growth_owner_update" on public.bass_growth_profiles for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
