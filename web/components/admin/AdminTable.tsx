"use client";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { ApproveRejectDialog } from "./ApproveRejectDialog";

export function AdminTable() {
  const supabase = createClient();
  const [pending, setPending] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [filter, setFilter] = useState<{ role?: string; status?: string }>({});

  async function refresh() {
    const { data: pend } = await supabase
      .from('profiles')
      .select('*')
      .eq('approval_status', 'pending')
      .order('created_at', { ascending: false });
    setPending(pend ?? []);

    const query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (filter.role) query.eq('role', filter.role);
    if (filter.status) query.eq('approval_status', filter.status);
    const { data: all } = await query;
    setAllUsers(all ?? []);
  }

  useEffect(() => {
    refresh();
    // subscribe to changes
    const ch = supabase.channel('profiles-admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, refresh)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  useEffect(() => {
    refresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function callApprove(id: string) {
    const prev = [...pending];
    setPending((p) => p.filter((x) => x.id !== id));
    const { error } = await supabase.rpc('approve_user', { uid: id });
    if (error) {
      setPending(prev);
      toast.error(error.message);
    } else {
      toast.success('Approved');
    }
  }

  async function callReject(id: string, reason?: string) {
    const prev = [...pending];
    setPending((p) => p.filter((x) => x.id !== id));
    const { error } = await supabase.rpc('reject_user', { uid: id, reason: reason ?? null });
    if (error) {
      setPending(prev);
      toast.error(error.message);
    } else {
      toast.success('Rejected');
    }
  }

  const usage = useMemo(() => ({
    total: allUsers.length,
    pending: pending.length,
    approved: allUsers.filter((u) => u.approval_status === 'approved').length,
    rejected: allUsers.filter((u) => u.approval_status === 'rejected').length,
  }), [allUsers, pending]);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold">Pending Signups</h2>
        <div className="mt-4 overflow-x-auto border rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Year</th>
                <th className="text-left p-2">Created</th>
                <th className="text-left p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {pending.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-3 text-muted-foreground">No pending signups</td>
                </tr>
              ) : pending.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-2">{u.full_name ?? '—'}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.year_of_study ?? '—'}</td>
                  <td className="p-2">{new Date(u.created_at).toLocaleString()}</td>
                  <td className="p-2">
                    <ApproveRejectDialog
                      onApprove={() => callApprove(u.id)}
                      onReject={(reason) => callReject(u.id, reason)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">All Users</h2>
        <div className="flex gap-2 mt-3">
          <select className="rounded-md border px-2 py-1 text-sm" value={filter.role ?? ''} onChange={(e) => setFilter((f) => ({ ...f, role: e.target.value || undefined }))}>
            <option value="">All roles</option>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
          <select className="rounded-md border px-2 py-1 text-sm" value={filter.status ?? ''} onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value || undefined }))}>
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="mt-4 overflow-x-auto border rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Role</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Updated</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-3 text-muted-foreground">No users</td>
                </tr>
              ) : allUsers.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-2">{u.full_name ?? '—'}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.role}</td>
                  <td className="p-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs border ${u.approval_status === 'approved' ? 'border-green-600 text-green-700' : u.approval_status === 'pending' ? 'border-amber-600 text-amber-700' : 'border-red-600 text-red-700'}`}>
                      {u.approval_status}
                    </span>
                  </td>
                  <td className="p-2">{new Date(u.updated_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Usage</h2>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard label="Signups" value={usage.total} />
          <KpiCard label="Pending" value={usage.pending} />
          <KpiCard label="Approved" value={usage.approved} />
          <KpiCard label="Rejected" value={usage.rejected} />
        </div>
      </section>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
