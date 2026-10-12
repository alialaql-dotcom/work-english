-- منصة إنجليزي العمل — مخطط قاعدة البيانات وسياسات الأمان
-- شغّل هذا الملف مرة واحدة في Supabase: SQL Editor ← New query ← الصق ← Run

-- تقدم كل مستخدم في صف واحد (JSON). كل مستخدم يرى ويعدّل صفه فقط.
create table if not exists public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  constraint progress_is_object check (jsonb_typeof(data) = 'object'),
  constraint progress_version check ((data ->> 'version') = '1'),
  -- حد أعلى للحجم يمنع إساءة الاستخدام (حوالي 1 ميجابايت)
  constraint progress_size check (pg_column_size(data) < 1000000)
);

alter table public.progress enable row level security;
alter table public.progress force row level security;

-- لا صلاحيات للزوار غير المسجلين إطلاقًا
revoke all on table public.progress from anon;
revoke all on table public.progress from public;
grant select, insert, update, delete on table public.progress to authenticated;

drop policy if exists "progress_select_own" on public.progress;
create policy "progress_select_own" on public.progress
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "progress_insert_own" on public.progress;
create policy "progress_insert_own" on public.progress
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "progress_update_own" on public.progress;
create policy "progress_update_own" on public.progress
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "progress_delete_own" on public.progress;
create policy "progress_delete_own" on public.progress
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- وقت آخر تحديث يُضبط في الخادم، لا يمكن للعميل تزويره
create or replace function public.progress_touch()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists progress_touch on public.progress;
create trigger progress_touch
  before insert or update on public.progress
  for each row execute function public.progress_touch();
