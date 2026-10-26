-- 弦間小日子 2.0：新增師生功能。不刪除、不修改 practice_days。
-- 執行前請備份資料庫。首次配對請於 SQL Editor 使用文末示例。
create table if not exists public.music_pairs (
 id uuid primary key default gen_random_uuid(),
 student_id uuid not null references auth.users(id) on delete cascade,
 teacher_id uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),
 constraint pair_distinct check (student_id <> teacher_id),
 unique(student_id,teacher_id)
);
create table if not exists public.diary_entries (
 id uuid primary key default gen_random_uuid(),
 pair_id uuid not null references public.music_pairs(id) on delete cascade,
 entry_date date not null,
 student_note text not null default '',
 teacher_note text not null default '',
 updated_at timestamptz not null default now(),
 unique(pair_id,entry_date)
);
create table if not exists public.reward_stamps (
 id uuid primary key default gen_random_uuid(),
 pair_id uuid not null references public.music_pairs(id) on delete cascade,
 stamp_date date not null default current_date,
 emoji text not null check(emoji in ('🐻','🌸','⭐','💗','🎸','🍮','🐾','🏆')),
 reason text not null default '',
 awarded_by uuid not null references auth.users(id),
 created_at timestamptz not null default now()
);
create table if not exists public.pair_notes (
 id uuid primary key default gen_random_uuid(),
 pair_id uuid not null references public.music_pairs(id) on delete cascade,
 author_id uuid not null references auth.users(id),
 kind text not null check(kind in ('student','teacher')),
 title text not null default '',
 body text not null default '',
 created_at timestamptz not null default now()
);
create table if not exists public.weekly_challenges (
 id uuid primary key default gen_random_uuid(),
 pair_id uuid not null references public.music_pairs(id) on delete cascade,
 created_by uuid not null references auth.users(id),
 title text not null,
 detail text not null default '',
 due_date date,
 status text not null default 'assigned' check(status in ('assigned','submitted','approved','retry')),
 student_reply text not null default '',
 teacher_feedback text not null default '',
 created_at timestamptz not null default now()
);
create table if not exists public.pair_settings (
 pair_id uuid not null references public.music_pairs(id) on delete cascade,
 setting_key text not null check(setting_key in ('songs','course')),
 data jsonb not null default '[]'::jsonb,
 updated_by uuid not null references auth.users(id),
 primary key(pair_id,setting_key)
);
-- 禁止從 API 自行建立師生配對。
revoke all on public.music_pairs,public.diary_entries,public.reward_stamps,public.pair_notes,public.weekly_challenges,public.pair_settings from anon,authenticated;
grant select on public.music_pairs,public.diary_entries,public.reward_stamps,public.pair_notes,public.weekly_challenges,public.pair_settings to authenticated;
grant insert on public.reward_stamps,public.pair_notes,public.weekly_challenges,public.pair_settings to authenticated;
grant update on public.pair_settings to authenticated;
-- 其餘寫入使用 SECURITY DEFINER RPC。
alter table public.music_pairs enable row level security;
alter table public.diary_entries enable row level security;
alter table public.reward_stamps enable row level security;
alter table public.pair_notes enable row level security;
alter table public.weekly_challenges enable row level security;
alter table public.pair_settings enable row level security;
-- 可重複執行
 drop policy if exists pair_read on public.music_pairs;
create policy pair_read on public.music_pairs for select to authenticated using (student_id=(select auth.uid()) or teacher_id=(select auth.uid()));
drop policy if exists diary_read on public.diary_entries;
create policy diary_read on public.diary_entries for select to authenticated using (exists(select 1 from public.music_pairs p where p.id=pair_id and (p.student_id=(select auth.uid()) or p.teacher_id=(select auth.uid()))));
drop policy if exists stamps_read on public.reward_stamps;
create policy stamps_read on public.reward_stamps for select to authenticated using (exists(select 1 from public.music_pairs p where p.id=pair_id and (p.student_id=(select auth.uid()) or p.teacher_id=(select auth.uid()))));
drop policy if exists stamps_teacher_insert on public.reward_stamps;
create policy stamps_teacher_insert on public.reward_stamps for insert to authenticated with check (awarded_by=(select auth.uid()) and exists(select 1 from public.music_pairs p where p.id=pair_id and p.teacher_id=(select auth.uid())));
drop policy if exists notes_read on public.pair_notes;
create policy notes_read on public.pair_notes for select to authenticated using (exists(select 1 from public.music_pairs p where p.id=pair_id and (p.student_id=(select auth.uid()) or p.teacher_id=(select auth.uid()))));
drop policy if exists notes_author_insert on public.pair_notes;
create policy notes_author_insert on public.pair_notes for insert to authenticated with check (author_id=(select auth.uid()) and exists(select 1 from public.music_pairs p where p.id=pair_id and ((kind='student' and p.student_id=(select auth.uid())) or (kind='teacher' and p.teacher_id=(select auth.uid())))));
drop policy if exists challenges_read on public.weekly_challenges;
create policy challenges_read on public.weekly_challenges for select to authenticated using (exists(select 1 from public.music_pairs p where p.id=pair_id and (p.student_id=(select auth.uid()) or p.teacher_id=(select auth.uid()))));
drop policy if exists challenges_teacher_insert on public.weekly_challenges;
create policy challenges_teacher_insert on public.weekly_challenges for insert to authenticated with check (created_by=(select auth.uid()) and status='assigned' and student_reply='' and teacher_feedback='' and exists(select 1 from public.music_pairs p where p.id=pair_id and p.teacher_id=(select auth.uid())));
drop policy if exists settings_read on public.pair_settings;
create policy settings_read on public.pair_settings for select to authenticated using (exists(select 1 from public.music_pairs p where p.id=pair_id and (p.student_id=(select auth.uid()) or p.teacher_id=(select auth.uid()))));
drop policy if exists settings_student_insert on public.pair_settings;
create policy settings_student_insert on public.pair_settings for insert to authenticated with check (updated_by=(select auth.uid()) and exists(select 1 from public.music_pairs p where p.id=pair_id and p.student_id=(select auth.uid())));
drop policy if exists settings_student_update on public.pair_settings;
create policy settings_student_update on public.pair_settings for update to authenticated using (exists(select 1 from public.music_pairs p where p.id=pair_id and p.student_id=(select auth.uid()))) with check (updated_by=(select auth.uid()) and exists(select 1 from public.music_pairs p where p.id=pair_id and p.student_id=(select auth.uid())));
create or replace function public.save_diary_note(p_pair_id uuid,p_date date,p_note text)
returns void language plpgsql security definer set search_path = '' as $$
declare v_uid uuid := auth.uid(); v_student uuid; v_teacher uuid;
begin
 select student_id,teacher_id into v_student,v_teacher from public.music_pairs where id=p_pair_id;
 if v_uid is null or (v_uid is distinct from v_student and v_uid is distinct from v_teacher) then raise exception 'not a pair member'; end if;
 insert into public.diary_entries(pair_id,entry_date) values(p_pair_id,p_date) on conflict(pair_id,entry_date) do nothing;
 if v_uid=v_student then
 update public.diary_entries set student_note=coalesce(p_note,''),updated_at=now() where pair_id=p_pair_id and entry_date=p_date;
 else
 update public.diary_entries set teacher_note=coalesce(p_note,''),updated_at=now() where pair_id=p_pair_id and entry_date=p_date;
 end if;
end $$;
create or replace function public.submit_challenge(p_id uuid,p_reply text)
returns void language plpgsql security definer set search_path = '' as $$
begin
 update public.weekly_challenges c set student_reply=coalesce(p_reply,''),status='submitted'
 where c.id=p_id and c.status in ('assigned','retry','submitted') and exists(select 1 from public.music_pairs p where p.id=c.pair_id and p.student_id=auth.uid());
 if not found then raise exception 'not authorized or challenge closed'; end if;
end $$;
create or replace function public.review_challenge(p_id uuid,p_approved boolean,p_feedback text)
returns void language plpgsql security definer set search_path = '' as $$
begin
 update public.weekly_challenges c set teacher_feedback=coalesce(p_feedback,''),status=case when p_approved then 'approved' else 'retry' end
 where c.id=p_id and c.status='submitted' and exists(select 1 from public.music_pairs p where p.id=c.pair_id and p.teacher_id=auth.uid());
 if not found then raise exception 'not authorized or not submitted'; end if;
end $$;
revoke all on function public.save_diary_note(uuid,date,text),public.submit_challenge(uuid,text),public.review_challenge(uuid,boolean,text) from public,anon;
grant execute on function public.save_diary_note(uuid,date,text),public.submit_challenge(uuid,text),public.review_challenge(uuid,boolean,text) to authenticated;
-- 首次配對：先讓兩個帳號登入建立 auth.users，再由專案管理員在 SQL Editor 執行：
-- insert into public.music_pairs(student_id,teacher_id) values ('學生的 UUID','老師的 UUID');
