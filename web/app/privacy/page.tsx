export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Privacy Policy</h1>
      <p className="text-muted-foreground mt-2">Last updated {new Date().getFullYear()}</p>
      <div className="prose dark:prose-invert mt-6">
        <p>We store your account and conversation data securely via Supabase.</p>
        <p>Only approved users and administrators may access relevant data per RLS policies.</p>
      </div>
    </div>
  );
}
