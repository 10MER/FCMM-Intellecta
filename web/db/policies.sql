-- policies.sql
-- Enable RLS
alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- Profiles policies
-- Allow users to select their own profile
create policy if not exists profiles_select_self on public.profiles
  for select using (auth.uid() = id or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

-- Allow users to update limited fields on their own profile when pending or rejected
create policy if not exists profiles_update_self on public.profiles
  for update using (auth.uid() = id)
  with check (
    auth.uid() = id
    and (
      (approval_status = 'pending')
      or (approval_status = 'rejected')
    )
  );

-- Admin full access to profiles
create policy if not exists profiles_admin_all on public.profiles
  for all using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  )) with check (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

-- Conversations policies
-- Only approved users can insert/select/update/delete their own conversations
create policy if not exists conversations_crud_owner on public.conversations
  for all using (
    user_id = auth.uid()
    and exists (
      select 1 from public.profiles pr where pr.id = auth.uid() and pr.approval_status = 'approved'
    )
  ) with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.profiles pr where pr.id = auth.uid() and pr.approval_status = 'approved'
    )
  );

-- Admin read all conversations
create policy if not exists conversations_admin_read on public.conversations
  for select using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

-- Admin update/delete conversations
create policy if not exists conversations_admin_write on public.conversations
  for all using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  )) with check (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

-- Messages policies
-- Only approved owners can CRUD their own messages within their conversations
create policy if not exists messages_crud_owner on public.messages
  for all using (
    user_id = auth.uid()
    and exists (
      select 1 from public.profiles pr where pr.id = auth.uid() and pr.approval_status = 'approved'
    )
    and exists (
      select 1 from public.conversations c where c.id = conversation_id and c.user_id = auth.uid()
    )
  ) with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.profiles pr where pr.id = auth.uid() and pr.approval_status = 'approved'
    )
    and exists (
      select 1 from public.conversations c where c.id = conversation_id and c.user_id = auth.uid()
    )
  );

-- Admin read all messages
create policy if not exists messages_admin_read on public.messages
  for select using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

-- Admin write messages
create policy if not exists messages_admin_write on public.messages
  for all using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  )) with check (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));
