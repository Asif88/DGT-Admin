-- ─────────────────────────────────────────
-- profiles
-- ─────────────────────────────────────────
create table public.profiles (
  id        uuid primary key references auth.users(id) on delete cascade,
  name      text not null,
  email     text not null,
  language  text not null default 'es'
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ─────────────────────────────────────────
-- chapters
-- ─────────────────────────────────────────
create table public.chapters (
  id            uuid primary key default gen_random_uuid(),
  number        smallint not null unique,
  icon          text not null,
  translations  jsonb not null default '{}'
);

alter table public.chapters enable row level security;

create policy "Chapters are publicly readable"
  on public.chapters for select
  to authenticated
  using (true);


-- ─────────────────────────────────────────
-- questions
-- ─────────────────────────────────────────
create table public.questions (
  id          uuid primary key default gen_random_uuid(),
  chapter_id  uuid not null references public.chapters(id) on delete cascade,
  text        jsonb not null default '{}',
  explanation jsonb,
  media_type  text check (media_type in ('image', 'video')),
  media_url   text,
  "order"     smallint not null
);

alter table public.questions enable row level security;

create policy "Questions are publicly readable"
  on public.questions for select
  to authenticated
  using (true);

create index on public.questions (chapter_id);


-- ─────────────────────────────────────────
-- answers
-- ─────────────────────────────────────────
create table public.answers (
  id           uuid primary key default gen_random_uuid(),
  question_id  uuid not null references public.questions(id) on delete cascade,
  text         jsonb not null default '{}',
  is_correct   boolean not null default false,
  "order"      smallint not null
);

alter table public.answers enable row level security;

create policy "Answers are publicly readable"
  on public.answers for select
  to authenticated
  using (true);

create index on public.answers (question_id);


-- ─────────────────────────────────────────
-- exam_sessions
-- ─────────────────────────────────────────
create table public.exam_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  mode        text not null check (mode in ('quiz', 'exam')),
  chapter_id  uuid not null references public.chapters(id),
  started_at  timestamptz not null default now(),
  time_taken  integer -- seconds, null until completed
);

alter table public.exam_sessions enable row level security;

create policy "Users can view own sessions"
  on public.exam_sessions for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert own sessions"
  on public.exam_sessions for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update own sessions"
  on public.exam_sessions for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create index on public.exam_sessions (user_id);


-- ─────────────────────────────────────────
-- session_answers
-- ─────────────────────────────────────────
create table public.session_answers (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid not null references public.exam_sessions(id) on delete cascade,
  question_id  uuid not null references public.questions(id),
  answer_id    uuid not null references public.answers(id),
  is_correct   boolean not null
);

alter table public.session_answers enable row level security;

create policy "Users can view own session answers"
  on public.session_answers for select
  to authenticated
  using (
    exists (
      select 1 from public.exam_sessions s
      where s.id = session_id
      and s.user_id = (select auth.uid())
    )
  );

create policy "Users can insert own session answers"
  on public.session_answers for insert
  to authenticated
  with check (
    exists (
      select 1 from public.exam_sessions s
      where s.id = session_id
      and s.user_id = (select auth.uid())
    )
  );

create index on public.session_answers (session_id);
