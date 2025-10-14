"use client";
import { useState } from "react";

export function ApproveRejectDialog({ onApprove, onReject }: { onApprove: () => Promise<void>, onReject: (reason?: string) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"approve" | "reject">("approve");
  const [reason, setReason] = useState("");

  return (
    <div>
      <div className="flex gap-2">
        <button className="inline-flex items-center rounded-md border px-3 py-2 text-sm" onClick={() => { setMode('approve'); setOpen(true); }}>Approve</button>
        <button className="inline-flex items-center rounded-md border px-3 py-2 text-sm" onClick={() => { setMode('reject'); setOpen(true); }}>Reject</button>
      </div>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-full max-w-md rounded-lg bg-background border p-6">
            <h3 className="text-lg font-semibold mb-2">{mode === 'approve' ? 'Approve user?' : 'Reject user?'}</h3>
            {mode === 'reject' && (
              <div>
                <label className="block text-sm font-medium">Reason (optional)</label>
                <textarea className="mt-1 w-full rounded-md border px-3 py-2" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
              </div>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button className="inline-flex items-center rounded-md border px-3 py-2 text-sm" onClick={() => setOpen(false)}>Cancel</button>
              {mode === 'approve' ? (
                <button className="inline-flex items-center rounded-md bg-black text-white dark:bg-white dark:text-black px-3 py-2 text-sm" onClick={async () => { await onApprove(); setOpen(false); }}>Confirm</button>
              ) : (
                <button className="inline-flex items-center rounded-md bg-black text-white dark:bg-white dark:text-black px-3 py-2 text-sm" onClick={async () => { await onReject(reason); setOpen(false); }}>Confirm</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
