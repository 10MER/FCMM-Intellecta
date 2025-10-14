import Link from "next/link";
import { SignupForm } from "@/components/forms/SignupForm";

export default function SignupPage() {
  return (
    <div className="container mx-auto max-w-xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Create your account</h1>
      <p className="text-muted-foreground mt-2">
        Request access to the Mass Communication Portal. An administrator will review your signup.
      </p>
      <div className="mt-8 rounded-xl border bg-card p-6">
        <SignupForm />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Already have an account? <Link href="/(auth)/login" className="underline">Sign in</Link>
      </p>
    </div>
  );
}
