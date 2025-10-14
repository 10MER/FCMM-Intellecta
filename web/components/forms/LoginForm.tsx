"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Invalid password"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => {
    setSubmitting(true);
    startTransition(async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      setSubmitting(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Welcome back!");
      // Fetch profile to route appropriately
      const { data: profile } = await supabase
        .from('profiles')
        .select('approval_status, role')
        .eq('id', data.user?.id)
        .single();
      if (profile?.role === 'admin') {
        window.location.href = '/admin';
      } else if (profile?.approval_status === 'approved') {
        window.location.href = '/app';
      } else {
        window.location.href = '/(auth)/pending';
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input type="email" className="mt-1 w-full rounded-md border px-3 py-2" {...register("email")} />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Password</label>
        <input type="password" className="mt-1 w-full rounded-md border px-3 py-2" {...register("password")} />
        {errors.password && (
          <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={submitting || isPending}
        className="inline-flex items-center rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm"
      >
        {submitting || isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
