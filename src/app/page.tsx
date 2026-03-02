import Link from "next/link";
import { HubAndSpoke } from "./hub-spoke";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-semibold text-[#191C1F] tracking-tight">
          SubTrack
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/pricing"
            className="text-sm font-medium text-gray-500 hover:text-[#191C1F] transition-colors duration-150"
          >
            Pricing
          </Link>
          <Link
            href="/auth/signin"
            className="px-5 py-2 text-sm font-medium text-[#191C1F] border border-gray-200 rounded-full hover:bg-gray-50 transition-colors duration-150"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <h1 className="text-4xl font-semibold text-[#191C1F] tracking-tight leading-tight max-w-2xl mx-auto">
          Manage your subscriptions,
          <br />
          all in one place
        </h1>
        <p className="mt-5 text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
          SubTrack helps you track projects, control billing, and monitor
          usage from a single dashboard.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/pricing"
            className="px-7 py-3 text-sm font-medium text-white bg-[#191C1F] rounded-full hover:bg-[#2a2d31] transition-colors duration-150"
          >
            View Pricing
          </Link>
          <Link
            href="/auth/signup"
            className="px-7 py-3 text-sm font-medium text-[#191C1F] border border-gray-200 rounded-full hover:bg-gray-50 transition-colors duration-150"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Hub and Spoke Visual */}
      <section className="max-w-6xl mx-auto px-6 pb-8">
        <HubAndSpoke />
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#F7F7F7] rounded-xl p-7">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm">
              <svg className="w-5 h-5 text-[#191C1F]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-[#191C1F] mb-2">
              Project Management
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Organize your projects with plan-based limits. Free users get 3,
              paid plans unlock unlimited.
            </p>
          </div>
          <div className="bg-[#F7F7F7] rounded-xl p-7">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm">
              <svg className="w-5 h-5 text-[#191C1F]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-[#191C1F] mb-2">
              Subscription Billing
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Stripe-powered billing with monthly and yearly plans. Manage
              everything through a self-serve portal.
            </p>
          </div>
          <div className="bg-[#F7F7F7] rounded-xl p-7">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm">
              <svg className="w-5 h-5 text-[#191C1F]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-[#191C1F] mb-2">
              Usage Dashboard
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Real-time overview of your plan, project usage, and billing
              status — everything at a glance.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-center gap-16">
          <div className="text-center">
            <p className="text-3xl font-semibold text-[#191C1F]">3</p>
            <p className="mt-1 text-sm text-gray-500">Flexible plans</p>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="text-center">
            <p className="text-3xl font-semibold text-[#191C1F]">99.9%</p>
            <p className="mt-1 text-sm text-gray-500">Uptime</p>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="text-center">
            <p className="text-3xl font-semibold text-[#191C1F]">Stripe</p>
            <p className="mt-1 text-sm text-gray-500">Secure payments</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#F7F7F7] py-20 text-center">
        <h2 className="text-2xl font-semibold text-[#191C1F] tracking-tight">
          Ready to get started?
        </h2>
        <p className="mt-3 text-gray-500">
          Pick a plan and start managing your projects today.
        </p>
        <div className="mt-6">
          <Link
            href="/pricing"
            className="px-7 py-3 text-sm font-medium text-white bg-[#191C1F] rounded-full hover:bg-[#2a2d31] transition-colors duration-150"
          >
            View Pricing
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center">
        <div className="flex items-center justify-center gap-4">
          <span className="text-sm text-gray-400">Built by Bitcoineo</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}
