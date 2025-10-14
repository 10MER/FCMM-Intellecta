import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        // Allow Supabase to manage auth cookies securely in the browser
        // Domain/path are auto from SSR helpers if used server-side
      },
    }
  );
}
