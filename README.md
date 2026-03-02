# SubTrack

SaaS subscription management dashboard. Users sign up, pick a plan, and manage billing through Stripe. Projects are gated by plan tier with server-side enforcement.

**Stack:** `Next.js 14 · TypeScript · Auth.js v5 · Drizzle ORM · Turso (SQLite) · Stripe Subscriptions · Tailwind CSS`

**Live:** https://subtrack-bitcoineo.vercel.app

---

## Why I built this

I wanted to understand how recurring billing actually works in a multi-user SaaS: Stripe Subscriptions, the Customer Portal for self-serve plan changes, webhook-driven subscription state sync, and feature gating enforced server-side rather than just in the UI. SubTrack is a working implementation of all of it.

## Features

- **Authentication** Google OAuth and email/password via Auth.js v5
- **Subscription plans** Free (3 projects), Pro ($19/mo), Enterprise ($49/mo) with monthly and yearly billing
- **Stripe Subscriptions** Checkout sessions, webhook handling, Customer  for self-serve billing management
- **Feature gating** canAccess() helper enforces plan limits server-side, not just in the UI
- **Project management** CRUD with plan-based project limits
- **Dashboard** Plan overview, project stats, billing details, and subscription status

## Setup

    pnpm install
    cp .env.example .env.local

Fill in your .env.local:

    AUTH_SECRET=                           # openssl rand -base64 32
    GOOGLE_CLIENT_ID=                      # Google OAuth client ID
    GOOGLE_CLIENT_SECRET=                  # Google OAuth client secret
    NEXT_PUBLIC_BASE_URL=                  # http://localhost:3000 for dev
    DATABASE_URL=                          # Turso database URL
    DATABASE_AUTH_TOKEN=                   # Turso auth token
    STRIPE_SECRET_KEY=                     # sk_test_...
    STRIPE_PUBLISHABLE_KEY=                # pk_test_...
    STRIPE_WEBHOOK_SECRET=                 # whsec_...
    STRIPE_PRO_MONTHLY_PRICE_ID=           # Stripe price ID
    STRIPE_PRO_YEARLY_PRICE_ID=            # Stripe price ID
    STRIPE_ENTERPRISE_MONTHLY_PRICE_ID=    # Stripe price ID
    STRIPE_ENTERPRISE_YEARLY_PRICE_ID=     # Stripe price ID

Run migrations and seed:

    npx drizzle-kit generate
    npx tsx src/db/migrate.ts
    npx tsx src/db/seed.ts

Default test user: admin@subtrack.dev / password123

Forward Stripe webhooks locally:

    stripe listen --forward-to localhost:3000/api/webhooks/stripe

Start dev server:

    pnpm dev

Open http://localhost:3000

## Deploy to Vercel

1. Push to GitHub
2. Import the repo on Vercel
3. Add all environment variables
4. Set up a Stripe webhook pointing to your-domain.vercel.app/api/webhooks/stripe
5. Deploy

## GitHub Topics

`nextjs` `typescript` `stripe` `subscriptions` `saas` `drizzle-orm` `turso` `sqlite` `authjs` `tailwind` `billing` `feature-gating`
