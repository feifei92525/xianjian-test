-- Run once in Supabase SQL Editor. Does not modify existing Bass tables.
create table if not exists public.study_planner_documents (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.study_planner_documents enable row level security;
revoke all on public.study_planner_documents from anon;
grant select, insert, update on public.study_planner_documents to authenticated;
drop policy if exists "study planner owner read" on public.study_planner_documents;
drop policy if exists "study planner owner insert" on public.study_planner_documents;
drop policy if exists "study planner owner update" on public.study_planner_documents;
create policy "study planner owner read" on public.study_planner_documents for select to authenticated using (auth.uid()=user_id);
create policy "study planner owner insert" on public.study_planner_documents for insert to authenticated with check (auth.uid()=user_id);
create policy "study planner owner update" on public.study_planner_documents for update to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
