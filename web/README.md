# Mass Communication Student Portal

A production-ready Next.js (App Router) web app for Mass Communication students, featuring Supabase Auth with admin approval, a chatbot UI, and an admin console.

## Tech
- Next.js 15 (App Router, Server Components/Actions)
- TypeScript, ESLint + Prettier
- TailwindCSS v4, shadcn-style UI (Radix primitives), lucide-react
- Framer Motion for subtle animations
- Supabase (Auth + Postgres + RLS + Realtime)

## Getting Started

### 1) Configure environment
Create `.env.local` from the template:

```bash
cp .env.example .env.local
```

Set values:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- (optional) `SUPABASE_SERVICE_ROLE_KEY` for local RPC testing only
- (optional) `CHAT_SERVICE_URL`, `CHAT_SERVICE_KEY` if connecting an external chatbot

### 2) Set up database schema
Apply SQL in Supabase (SQL Editor or CLI) in order:

- `db/schema.sql`
- `db/policies.sql`
- `db/rpcs.sql`

Seed an initial admin (after the auth user exists) by running:

```sql
select public.seed_initial_admin('admin@example.com');
```

### 3) Run the app

```bash
pnpm install
pnpm dev
```
Open http://localhost:3000.

## Auth & Approval Model
- Signups create a `profiles` row with `role='student'` and `approval_status='pending'`.
- Admins approve or reject via the Admin Console. RPCs: `approve_user(uid)`, `reject_user(uid, reason)`.
- Only approved users can access `/app` and insert/select conversations/messages due to RLS.

## Admin Console
- Pending signups table with Approve/Reject dialogs
- All users table with filters
- Usage KPIs

## Chatbot Integration
- Frontend UI under `/app`.
- Proxy endpoint: `/api/chat` forwards to `CHAT_SERVICE_URL` with `CHAT_SERVICE_KEY` if set; otherwise returns mocked data.
- Replace the proxy target when the external chatbot API is ready.

## Testing
- Playwright installed. Example smoke test: `tests/e2e/app.spec.ts`.

Run tests:
```bash
pnpm test:e2e
```

## Deploying
- Vercel-ready. Set the same environment variables in Vercel.
- Apply SQL to your Supabase project. Ensure RLS is enabled and policies/rpcs are created.

## Where to plug the external chatbot API
- Update `.env.local` with `CHAT_SERVICE_URL` and `CHAT_SERVICE_KEY`.
- The proxy route is at `app/api/chat/route.ts`.
- The chat UI posts to `/api/chat`. Replace the external endpoint without changing the UI.
