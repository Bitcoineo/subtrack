# SubTrack

SaaS subscription dashboard where users sign up, choose a plan (Free / Pro / Enterprise), manage billing through Stripe, and track projects with plan-based feature gating.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: Drizzle ORM + Turso (LibSQL)
- **Auth**: Auth.js v5 (Google OAuth + credentials)
- **Payments**: Stripe Subscriptions + Customer Portal
- **Styling**: Tailwind CSS

## Features

- **Authentication**: Google OAuth and email/password sign-up/sign-in
- **Subscription plans**: Free (3 projects), Pro ($19/mo), Enterprise ($49/mo) with monthly/yearly billing
- **Stripe integration**: Checkout sessions, webhook handling, customer portal for self-serve billing management
- **Project management**: CRUD with plan-based limits (free users capped at 3 projects)
- **Dashboard**: Plan overview, project stats, billing details, and subscription status
- **Feature gating**: `canAccess()` helper enforces plan limits server-side

## Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# Fill in all values (see Environment Variables below)

# Generate and run database migrations
npx drizzle-kit generate
npx tsx src/db/migrate.ts

# Seed test data (admin@subtrack.dev / password123)
npx tsx src/db/seed.ts

# Start development server
pnpm dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `AUTH_SECRET` | NextAuth.js secret (generate with `openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_BASE_URL` | App URL (e.g. `http://localhost:3000`) |
| `DATABASE_URL` | Turso database URL |
| `DATABASE_AUTH_TOKEN` | Turso auth token |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_PRO_MONTHLY_PRICE_ID` | Stripe price ID for Pro monthly |
| `STRIPE_PRO_YEARLY_PRICE_ID` | Stripe price ID for Pro yearly |
| `STRIPE_ENTERPRISE_MONTHLY_PRICE_ID` | Stripe price ID for Enterprise monthly |
| `STRIPE_ENTERPRISE_YEARLY_PRICE_ID` | Stripe price ID for Enterprise yearly |

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build (includes type checking) |
| `pnpm start` | Start production server |
| `npx drizzle-kit generate` | Generate SQL migrations |
| `npx drizzle-kit studio` | Open Drizzle Studio |
| `npx tsx src/db/migrate.ts` | Run migrations |
| `npx tsx src/db/seed.ts` | Seed test data |
