import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Body = {
  email?: string;
  password?: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;
    const email = (body?.email || "").trim().toLowerCase();
    const password = body?.password || "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // Check if email is allowed (requires that allowed_emails table is publicly readable)
    const { data: allowedRow, error: allowedError } = await supabase
      .from("allowed_emails")
      .select("email")
      .ilike("email", email)
      .limit(1)
      .maybeSingle();

    if (allowedError) {
      console.error("Error checking allowed_emails:", allowedError);
      return NextResponse.json({ error: "Server error checking allowed emails" }, { status: 500 });
    }

    if (!allowedRow) {
      return NextResponse.json(
        { error: "This email is not allowed to sign up" },
        { status: 403 }
      );
    }

    // Create user using public signup method
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      console.error("Error during signup:", signUpError);
      return NextResponse.json({ error: signUpError.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Signup successful. Check your email for confirmation.", user: signUpData?.user },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Unexpected signup error:", err);
    return NextResponse.json({ error: err?.message ?? "Unexpected error" }, { status: 500 });
  }
}
