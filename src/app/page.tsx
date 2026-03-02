import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <span className="text-xl font-bold text-foreground">SubTrack</span>
        <div className="flex items-center gap-4">
          <Link
            href="/pricing"
            className="text-sm font-medium text-foreground/60 hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="/auth/signin"
            className="text-sm font-medium text-foreground hover:opacity-80"
          >
            Sign in
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-16 text-center">
        <h1 className="text-5xl font-bold text-foreground mb-6 tracking-tight">
          Track your SaaS subscriptions
          <br />
          in one place
        </h1>
        <p className="text-xl text-foreground/60 mb-10 max-w-2xl mx-auto">
          SubTrack helps you manage projects, monitor usage, and control your
          subscription — all from a single dashboard.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/pricing"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View Pricing
          </Link>
          <Link
            href="/auth/signin"
            className="border border-foreground/20 text-foreground px-6 py-3 rounded-lg font-medium hover:bg-foreground/5 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </main>

      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-foreground/10 rounded-xl p-6">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Project Management
            </h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Track and organize your projects with plan-based limits.
              Free users get 3, paid plans unlock unlimited.
            </p>
          </div>
          <div className="border border-foreground/10 rounded-xl p-6">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Subscription Billing
            </h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Stripe-powered billing with monthly and yearly plans.
              Manage your subscription through a self-serve portal.
            </p>
          </div>
          <div className="border border-foreground/10 rounded-xl p-6">
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Usage Dashboard
            </h3>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Real-time overview of your plan, project usage, and billing
              status — all in one place.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-foreground/10 py-16 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Ready to get started?
        </h2>
        <p className="text-foreground/60 mb-8">
          Choose a plan and start managing your projects today.
        </p>
        <Link
          href="/pricing"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          View Pricing
        </Link>
      </section>
    </div>
  );
}
