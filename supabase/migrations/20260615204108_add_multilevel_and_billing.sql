-- Multi-level support + billing, layered additively on top of the existing
-- Gen-2 schema. Consistent with existing conventions (text + check, jsonb).

-- shared updated_at helper (safe to (re)create)
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- 1) Per-level study configuration (a user may prep for >1 level) ----------
create table if not exists public.user_levels (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid not null references auth.users(id) on delete cascade,
  level                     text not null check (level in ('1','2','3')),
  exam_date                 date,
  start_date                date,
  target_study_hours_week   numeric,
  preferred_session_minutes int,
  pacing                    text not null default 'balanced',
  rest_days                 jsonb not null default '[]'::jsonb,
  is_active                 boolean not null default true,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  unique (user_id, level)
);
alter table public.user_levels enable row level security;
drop policy if exists "owner all" on public.user_levels;
create policy "owner all" on public.user_levels
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop trigger if exists trg_user_levels_updated on public.user_levels;
create trigger trg_user_levels_updated before update on public.user_levels
  for each row execute function public.set_updated_at();

-- 2) Subscriptions / billing (Stripe) --------------------------------------
create table if not exists public.subscriptions (
  user_id                uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id     text,
  stripe_subscription_id text,
  plan                   text,
  status                 text not null default 'inactive',
  levels_access          jsonb not null default '[]'::jsonb,
  trial_ends_at          timestamptz,
  current_period_end     timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);
alter table public.subscriptions enable row level security;
-- Users may READ their own subscription; writes happen server-side via the
-- service role (Stripe webhook), which bypasses RLS.
drop policy if exists "owner read" on public.subscriptions;
create policy "owner read" on public.subscriptions
  for select using (auth.uid() = user_id);
drop trigger if exists trg_subscriptions_updated on public.subscriptions;
create trigger trg_subscriptions_updated before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- 3) Add a `level` discriminator to study + content tables -----------------
-- Existing rows (none yet) default to Level 1; new content is tagged per level.
alter table public.study_progress           add column if not exists level text not null default '1' check (level in ('1','2','3'));
alter table public.study_assessments         add column if not exists level text not null default '1' check (level in ('1','2','3'));
alter table public.study_notes               add column if not exists level text not null default '1' check (level in ('1','2','3'));
alter table public.study_mocks               add column if not exists level text not null default '1' check (level in ('1','2','3'));
alter table public.study_question_attempts   add column if not exists level text not null default '1' check (level in ('1','2','3'));
alter table public.custom_flashcards         add column if not exists level text not null default '1' check (level in ('1','2','3'));
alter table public.flashcard_progress        add column if not exists level text not null default '1' check (level in ('1','2','3'));
alter table public.calculator_drill_progress add column if not exists level text not null default '1' check (level in ('1','2','3'));
alter table public.revision_note_progress    add column if not exists level text not null default '1' check (level in ('1','2','3'));
alter table public.assessment_sets           add column if not exists level text not null default '1' check (level in ('1','2','3'));
alter table public.revision_library_notes    add column if not exists level text not null default '1' check (level in ('1','2','3'));

-- helpful indexes for per-level queries
create index if not exists idx_study_progress_user_level on public.study_progress(user_id, level);
create index if not exists idx_assessment_sets_level     on public.assessment_sets(level, published);
create index if not exists idx_revlib_level              on public.revision_library_notes(level, sort_order);

-- 4) Provision profile + trial subscription on signup ----------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, username)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(coalesce(new.email,''), '@', 1))
  )
  on conflict (id) do nothing;

  insert into public.subscriptions (user_id, status, levels_access, trial_ends_at)
  values (new.id, 'trialing', '[]'::jsonb, now() + interval '7 days')
  on conflict (user_id) do nothing;

  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
