# SubTrack — SaaS Subscription Dashboard

## Overview
A SaaS app where users sign up, choose a subscription plan (Free/Pro/Enterprise), manage billing, and see usage. Demonstrates Stripe Subscriptions, customer lifecycle, and plan-based feature gating.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript strict mode
- Drizzle ORM + Turso (LibSQL)
- Auth.js v5 (Google OAuth + credentials)
- Stripe Subscriptions
- Tailwind CSS
- pnpm

## Plans
- **Free**: default on signup, no Stripe involved, limited features (3 projects, basic analytics)
- **Pro** ($19/mo or $190/yr): Stripe subscription, unlimited projects, full analytics, priority support badge
- **Enterprise** ($49/mo or $490/yr): everything in Pro + team members, API access, custom branding

## Database Schema

### Auth tables (standard Auth.js)
- user, account, session, verificationToken

### Extended user fields
- stripeCustomerId (text, nullable)
- plan (text: free/pro/enterprise, default free)
- planPeriod (text: monthly/yearly, nullable)
- subscriptionStatus (text: active/past_due/canceled/incomplete, nullable)
- stripeSubscriptionId (text, nullable)
- currentPeriodEnd (text, ISO, nullable)

### App tables
- **project**: id, userId (FK), name, description, createdAt
  - Used as the gated feature — free users limited to 3

## API Routes
- `POST /api/checkout/subscription` — create Stripe Checkout for subscription
- `POST /api/webhooks/stripe` — handle subscription events
- `POST /api/billing/portal` — create Stripe Customer Portal session
- `GET /api/usage` — return user's current usage stats

## Webhook Events to Handle
- checkout.session.completed (initial subscription)
- customer.subscription.created
- customer.subscription.updated (upgrade/downgrade/renewal)
- customer.subscription.deleted (cancellation)
- invoice.payment_succeeded
- invoice.payment_failed

## Architecture
```
src/db/       → schema.ts, index.ts, migrate.ts
src/lib/      → stripe.ts, subscriptions.ts, projects.ts, usage.ts
src/app/api/  → REST endpoints
src/app/dashboard/ → authenticated pages
src/components/    → React UI
```

## Coding Standards
- Lib layer pattern: all business logic in src/lib/, API routes are thin wrappers
- Return `{data, error}` pattern from lib functions
- Prices always in cents (1900 = $19.00)
- All subscription state changes go through webhooks, never trust client
- Plan checks: helper function `canAccess(user, feature)` for gating
- TypeScript strict mode enforced
- No `any` types unless absolutely necessary

## Workflow
- Complete and verify each feature before moving to the next
- Do not skip testing between features
- Run `pnpm build` to verify no TypeScript errors before marking tasks complete

## Test Credentials
- Admin: admin@subtrack.dev / password123

## Commands
- `pnpm dev` — start dev server
- `pnpm build` — production build (also type-checks)
- `npx drizzle-kit generate` — generate SQL migrations
- `npx drizzle-kit studio` — open Drizzle Studio
- `npx tsx src/db/migrate.ts` — run migrations
- `npx tsx src/db/seed.ts` — seed test data
