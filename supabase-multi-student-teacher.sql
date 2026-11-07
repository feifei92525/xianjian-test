-- Run in the same Supabase project as the website.
-- Non-destructive: does not delete or alter existing music_pairs, practice_days or learning_sync_fields records.
-- The existing music_pairs table must have teacher_id and student_id uuid columns.
-- Ensure teacher can SELECT their own music_pairs rows (usually already configured in the original project).

-- Allow an authenticated teacher to read practice logs of students paired with that teacher.
-- This policy only grants SELECT, never INSERT/UPDATE/DELETE.
alter table public.practice_days enable row level security;
drop policy if exists "xj_teacher_read_paired_practice" on public.practice_days;
create policy "xj_teacher_read_paired_practice" on public.practice_days
for select to authenticated using (
 exists (select 1 from public.music_pairs mp
         where mp.student_id = practice_days.user_id and mp.teacher_id = (select auth.uid()))
);

-- Allow the teacher to see only the student's Bass skill data, not private study/planner data.
alter table public.learning_sync_fields enable row level security;
drop policy if exists "xj_teacher_read_paired_bass" on public.learning_sync_fields;
create policy "xj_teacher_read_paired_bass" on public.learning_sync_fields
for select to authenticated using (
 namespace = 'bass' and exists (
   select 1 from public.music_pairs mp
   where mp.student_id = learning_sync_fields.user_id and mp.teacher_id = (select auth.uid())
 )
);

-- Note: this script does NOT allow teachers to read other students' data.
-- Existing music_pairs RLS must permit teachers to read all their own pair rows.
notify pgrst, 'reload schema';
