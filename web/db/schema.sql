-- schema.sql
-- Enable required extensions
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

-- Profiles table mirrors auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text not null default 'student' check (role in ('student','admin')),
  approval_status text not null default 'pending' check (approval_status in ('pending','approved','rejected')),
  approved_at timestamptz,
  rejected_at timestamptz,
  rejection_reason text,
  program text not null default 'Mass Communication',
  year_of_study int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_email on public.profiles(email);

-- conversations table
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text,
  created_at timestamptz not null default now()
);
create index if not exists idx_conversations_user on public.conversations(user_id);

-- messages table
create table if not exists public.messages (
  id bigserial primary key,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_messages_convo_created on public.messages(conversation_id, created_at);

-- Trigger to auto-create profile on auth.users insert
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, year_of_study)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    nullif(new.raw_user_meta_data->>'year_of_study', '')::int
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Attach trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at trigger
create or replace function public.set_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_timestamp
  before update on public.profiles
  for each row execute function public.set_timestamp();

-- Prevent non-admin users from modifying restricted fields when pending/rejected
create or replace function public.enforce_profile_update_restrictions()
returns trigger as $$
declare
  is_admin boolean;
begin
  select exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin') into is_admin;

  if is_admin then
    return new;
  end if;

  if auth.uid() = new.id and (old.approval_status in ('pending','rejected')) then
    -- Allow only full_name and year_of_study changes
    if (new.email is distinct from old.email)
        or (new.role is distinct from old.role)
        or (new.approval_status is distinct from old.approval_status)
        or (new.approved_at is distinct from old.approved_at)
        or (new.rejected_at is distinct from old.rejected_at)
        or (new.rejection_reason is distinct from old.rejection_reason)
        or (new.program is distinct from old.program) then
      raise exception 'You can only edit your name and year while pending.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger enforce_profile_update_restrictions
  before update on public.profiles
  for each row execute function public.enforce_profile_update_restrictions();

-- =========================================================
-- allowed_emails table (used to whitelist emails/years for signup)
-- =========================================================
create table if not exists public.allowed_emails (
  email text primary key,
  note text,
  allowed_year int not null default (date_part('year', now())::int),
  created_at timestamptz not null default now()
);

-- Enable Row Level Security and restrict access to service_role only
alter table public.allowed_emails enable row level security;

-- Revoke public privileges for clarity (clients will be blocked by RLS)
revoke all on public.allowed_emails from public;

-- Policy: allow only the Supabase service_role to perform any operation
create policy "service_role_only" on public.allowed_emails
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Optional index to speed up queries by year
create index if not exists idx_allowed_emails_year on public.allowed_emails(allowed_year);
