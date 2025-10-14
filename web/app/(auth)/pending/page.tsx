"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PendingPage() {
  const supabase = createClient();
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [reason, setReason] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchStatus() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/(auth)/login";
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('approval_status, rejection_reason, role')
        .eq('id', user.id)
        .single();

      if (!isMounted || !profile) return;

      if (profile.role === 'admin') {
        window.location.href = '/admin';
        return;
      }

      setStatus(profile.approval_status);
      setReason(profile.rejection_reason);

      if (profile.approval_status === 'approved') {
        window.location.href = '/app';
      }
    }

    fetchStatus();

    const channel = supabase
      .channel('profile-approval')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, async (payload) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        if ((payload as any).new?.id !== user.id) return;
        setStatus((payload as any).new.approval_status);
        setReason((payload as any).new.rejection_reason);
        if ((payload as any).new.approval_status === 'approved') {
          window.location.href = '/app';
        }
      })
      .subscribe();

    const interval = setInterval(fetchStatus, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <div className="container mx-auto max-w-xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Account under review</h1>
      <p className="text-muted-foreground mt-2">
        Thank you for signing up. Your account is currently pending administrator approval.
      </p>
      {status === 'rejected' && (
        <div className="mt-6 rounded-md border border-red-300/50 bg-red-50 dark:bg-red-950/30 p-4">
          <p className="font-medium text-red-700 dark:text-red-300">Your access request was rejected.</p>
          {reason && <p className="text-sm mt-1 text-red-700/90 dark:text-red-200/90">Reason: {reason}</p>}
          <button
            className="mt-3 inline-flex items-center rounded-md border px-3 py-2 text-sm"
            onClick={async () => {
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) return;
              await supabase
                .from('profiles')
                .update({ approval_status: 'pending', rejection_reason: null, rejected_at: null })
                .eq('id', user.id);
            }}
          >
            Resubmit for review
          </button>
        </div>
      )}
      <div className="mt-8 rounded-xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Status: <span className="font-medium">{status}</span>
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          This page will automatically update once your account is approved.
        </p>
      </div>
    </div>
  );
}
