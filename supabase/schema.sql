-- Run once in the dedicated project's SQL editor. Namespaced to avoid collisions.
create table public.jq_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 60),
  timezone text not null default 'America/Bogota',
  locale text not null default 'es' check (locale in ('es','en'))
);
create table public.jq_completions (
  user_id uuid references auth.users(id) on delete cascade,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  xp integer not null default 25 check (xp=25),
  primary key(user_id,lesson_id)
);
create table public.jq_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  correct boolean not null,
  attempted_at timestamptz not null default now()
);
create index jq_attempts_user_time on public.jq_attempts(user_id,attempted_at);
create table public.jq_activity (
  user_id uuid references auth.users(id) on delete cascade,
  day date not null,
  primary key(user_id,day)
);
create table public.jq_drafts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  files jsonb not null check (jsonb_typeof(files)='array' and pg_column_size(files)<170000),
  updated_at timestamptz not null default now()
);
create table public.jq_project_steps (
  user_id uuid references auth.users(id) on delete cascade,
  project_id text not null,
  step integer not null check (step between 0 and 9),
  primary key(user_id,project_id,step)
);
alter table public.jq_profiles enable row level security;
alter table public.jq_attempts enable row level security;
alter table public.jq_completions enable row level security;
alter table public.jq_activity enable row level security;
alter table public.jq_drafts enable row level security;
alter table public.jq_project_steps enable row level security;
revoke all on public.jq_profiles,public.jq_completions,public.jq_activity,public.jq_drafts,public.jq_project_steps from anon,authenticated;
revoke all on public.jq_attempts from anon,authenticated;
grant select on public.jq_attempts to authenticated;
grant all on public.jq_attempts to service_role;
grant select,insert,update on public.jq_profiles,public.jq_drafts to authenticated;
grant select on public.jq_completions,public.jq_activity to authenticated;
grant select,insert,delete on public.jq_project_steps to authenticated;
grant all on public.jq_profiles,public.jq_completions,public.jq_activity,public.jq_drafts,public.jq_project_steps to service_role;
create policy "own profile read" on public.jq_profiles for select to authenticated using ((select auth.uid())=id);
create policy "own profile create" on public.jq_profiles for insert to authenticated with check ((select auth.uid())=id);
create policy "own profile update" on public.jq_profiles for update to authenticated using ((select auth.uid())=id) with check ((select auth.uid())=id);
create policy "own completions" on public.jq_completions for select to authenticated using ((select auth.uid())=user_id);
create policy "own attempts" on public.jq_attempts for select to authenticated using ((select auth.uid())=user_id);
create policy "own activity" on public.jq_activity for select to authenticated using ((select auth.uid())=user_id);
create policy "own drafts read" on public.jq_drafts for select to authenticated using ((select auth.uid())=user_id);
create policy "own drafts create" on public.jq_drafts for insert to authenticated with check ((select auth.uid())=user_id);
create policy "own drafts update" on public.jq_drafts for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "own project read" on public.jq_project_steps for select to authenticated using ((select auth.uid())=user_id);
create policy "own project create" on public.jq_project_steps for insert to authenticated with check ((select auth.uid())=user_id);
create policy "own project delete" on public.jq_project_steps for delete to authenticated using ((select auth.uid())=user_id);
-- Invoker rights: only service_role can call; completion and daily activity commit atomically.
create function public.jq_record_completion(p_user_id uuid,p_lesson_id text,p_day date,p_correct boolean)
returns void language plpgsql security invoker set search_path='' as $$
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(p_user_id::text));
  if (select count(*) from public.jq_attempts where user_id=p_user_id and attempted_at>now()-interval '1 day')>=200 then
    raise exception 'Daily assessment limit reached' using errcode='P0001';
  end if;
  insert into public.jq_attempts(user_id,lesson_id,correct) values(p_user_id,p_lesson_id,p_correct);
  if p_correct then
    insert into public.jq_completions(user_id,lesson_id) values(p_user_id,p_lesson_id) on conflict do nothing;
    insert into public.jq_activity(user_id,day) values(p_user_id,p_day) on conflict do nothing;
  end if;
end;
$$;
revoke all on function public.jq_record_completion(uuid,text,date,boolean) from public,anon,authenticated;
grant execute on function public.jq_record_completion(uuid,text,date,boolean) to service_role;
