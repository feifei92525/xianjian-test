-- Execute once in Supabase SQL Editor. Existing Bass and teacher tables are unchanged.
create table if not exists public.learning_sync_fields (
 user_id uuid not null references auth.users(id) on delete cascade,
 namespace text not null check (namespace in ('study','planner','bass')),
 path_key text not null,
 value jsonb not null,
 updated_at timestamptz not null default now(),
 primary key (user_id,namespace,path_key)
);
alter table public.learning_sync_fields enable row level security;
drop policy if exists "learning_sync_select_own" on public.learning_sync_fields;
create policy "learning_sync_select_own" on public.learning_sync_fields for select to authenticated using (auth.uid()=user_id);
drop policy if exists "learning_sync_insert_own" on public.learning_sync_fields;
create policy "learning_sync_insert_own" on public.learning_sync_fields for insert to authenticated with check (auth.uid()=user_id);
drop policy if exists "learning_sync_update_own" on public.learning_sync_fields;
create policy "learning_sync_update_own" on public.learning_sync_fields for update to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
create or replace function public.learning_sync_set_timestamp() returns trigger language plpgsql as $$begin new.updated_at=now();return new;end$$;
drop trigger if exists learning_sync_updated on public.learning_sync_fields;
create trigger learning_sync_updated before update on public.learning_sync_fields for each row execute function public.learning_sync_set_timestamp();
