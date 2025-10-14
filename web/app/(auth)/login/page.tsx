import Link from "next/link";
import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="container mx-auto max-w-xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Welcome back</h1>
      <p className="text-muted-foreground mt-2">Sign in to continue to the portal.</p>
      <div className="mt-8 rounded-xl border bg-card p-6">
        <LoginForm />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        New here? <Link href="/(auth)/signup" className="underline">Create an account</Link>
      </p>
    </div>
  );
}
