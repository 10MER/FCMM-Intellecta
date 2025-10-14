"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  full_name: z.string().min(2, "Name is too short"),
  email: z.string().email(),
  password: z.string().min(8, "Use at least 8 characters"),
  year_of_study: z
    .number({ invalid_type_error: "Choose a year" })
    .int()
    .min(1)
    .max(10),
});

type FormValues = z.infer<typeof schema>;

export function SignupForm() {
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
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.full_name,
            year_of_study: values.year_of_study,
          },
        },
      });
      setSubmitting(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Account created. Check your email to confirm if required.");
      window.location.href = "/(auth)/pending";
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Full name</label>
        <input className="mt-1 w-full rounded-md border px-3 py-2" {...register("full_name")} />
        {errors.full_name && (
          <p className="text-sm text-red-600 mt-1">{errors.full_name.message}</p>
        )}
      </div>
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
      <div>
        <label className="block text-sm font-medium">Year of study</label>
        <select className="mt-1 w-full rounded-md border px-3 py-2" {...register("year_of_study", { valueAsNumber: true })}>
          <option value="">Select</option>
          {Array.from({ length: 6 }).map((_, i) => (
            <option value={i + 1} key={i}>
              Year {i + 1}
            </option>
          ))}
        </select>
        {errors.year_of_study && (
          <p className="text-sm text-red-600 mt-1">{errors.year_of_study.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={submitting || isPending}
        className="inline-flex items-center rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm"
      >
        {submitting || isPending ? "Creating..." : "Create account"}
      </button>
    </form>
  );
}
