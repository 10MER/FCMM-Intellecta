import { createClient as createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function requireApprovedStudent() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/(auth)/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) redirect('/(auth)/login');

  if (profile.role === 'admin') redirect('/admin');

  if (profile.approval_status !== 'approved') redirect('/(auth)/pending');
}

export async function requireAdmin() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/(auth)/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, approval_status')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') redirect('/');
}

export async function getSessionProfile() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null } as const;
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  return { user, profile } as const;
}
