-- rpcs.sql
-- Approve user RPC
create or replace function public.approve_user(uid uuid)
returns void as $$
begin
  -- Only admins can approve
  if not exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin') then
    raise exception 'not_authorized';
  end if;

  update public.profiles
  set approval_status = 'approved',
      approved_at = now(),
      rejection_reason = null,
      rejected_at = null,
      role = case when role = 'admin' then role else 'student' end,
      updated_at = now()
  where id = uid;
end;
$$ language plpgsql security definer set search_path = public;

-- Reject user RPC
create or replace function public.reject_user(uid uuid, reason text default null)
returns void as $$
begin
  -- Only admins can reject
  if not exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin') then
    raise exception 'not_authorized';
  end if;

  update public.profiles
  set approval_status = 'rejected',
      rejected_at = now(),
      rejection_reason = reason,
      updated_at = now()
  where id = uid;
end;
$$ language plpgsql security definer set search_path = public;

-- Seed initial admin if none exists (call manually once)
create or replace function public.seed_initial_admin(admin_email text)
returns void as $$
begin
  if exists (select 1 from public.profiles where role = 'admin') then
    return;
  end if;
  update public.profiles
  set role = 'admin', approval_status = 'approved', approved_at = now()
  where email = admin_email;
end;
$$ language plpgsql security definer set search_path = public;
