import { requireAdmin } from "@/lib/auth";
import { AdminTable } from "@/components/admin/AdminTable";

export default async function AdminPage() {
  await requireAdmin();
  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold">Admin Console</h1>
      <p className="text-muted-foreground mt-2">Approve or reject signups and view usage.</p>
      <div className="mt-8">
        <AdminTable />
      </div>
    </div>
  );
}
