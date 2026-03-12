# GUIDESOFT

GUIDESOFT is a Vite + React + Supabase application that combines onboarding, payment activation, social surfaces, collaboration views, and platform administration in one codebase.

## Local development

Requirements:

- Node.js 20+
- npm 10+
- Supabase project credentials in `.env`

Commands:

```sh
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
npm run check
npm run test:e2e
```

## Environment variables

Set these values in `.env`:

```sh
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

## Current production flow

1. Users create an account on `/auth`.
2. New accounts are routed to the payment gate until the registration payment is approved.
3. Users submit UPI payment evidence with Transaction ID and UTR.
4. `praveenkumar.kanneganti@gmail.com` is auto-assigned as `platform_super_admin` by the Supabase migrations.
5. Admins approve or reject payment submissions in `/app/admin`.

## Deployment notes

- Apply all SQL files in `supabase/migrations/` before shipping.
- The admin payment flow depends on the `20260312220500_admin_payment_access.sql` migration.
- Replace the external logo URL with a hosted brand asset under your own domain if you need fully self-contained production assets.
- `vercel.json` is included for Vercel SPA deployment.
- Playwright smoke coverage lives in `tests/e2e/` and is wired into `.github/workflows/ci.yml`.
- Full gap tracking (1-28) is documented in `PRODUCTION_READINESS_CHECKLIST.md`.
