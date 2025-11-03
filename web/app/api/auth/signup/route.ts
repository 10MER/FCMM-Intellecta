import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

type Body = {
  email?: string;
  password?: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables for server-side signup route"
  );
}

const supabaseAdmin = createSupabaseClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;
    const email = (body?.email || "").trim().toLowerCase();
    const password = body?.password || "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // Check allowed_emails table
    // Perform a case-insensitive lookup so stored emails with mixed-case match user input
    const { data: allowedRow, error: allowedError } = await supabaseAdmin
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
        { error: "This email address is not allowed to sign up. If you believe this is an error, contact support." },
        { status: 403 }
      );
    }

    // Create user with service role (admin)
    // Use admin.createUser when available; cast to any to avoid type mismatches across supabase-js versions
    const { data: createData, error: createError } = await (supabaseAdmin.auth as any).admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: {},
    });

    if (createError) {
      console.error("Error creating Supabase user:", createError);
      // common case: user already exists
      const status = createError.status === 400 ? 409 : createError.status || 500;
      return NextResponse.json({ error: createError.message || "Failed to create user" }, { status });
    }

    const createdUser = (createData as any)?.user ?? null;
    if (!createdUser || !createdUser.id) {
      console.error("createUser returned unexpected response:", createData);
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

    // Upsert a profiles row for the app
    const { error: upsertError } = await supabaseAdmin.from("profiles").upsert({
      id: createdUser.id,
      email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (upsertError) {
      console.error("Error upserting profile:", upsertError);
      // Not fatal; still return created but include warning
      return NextResponse.json(
        { message: "User created", userId: createdUser.id, warning: "Failed to upsert profile row" },
        { status: 201 }
      );
    }

    return NextResponse.json({ message: "User created", userId: createdUser.id }, { status: 201 });
  } catch (err: any) {
    console.error("Unexpected signup error:", err);
    return NextResponse.json({ error: err?.message ?? "Unexpected server error" }, { status: 500 });
  }
}
