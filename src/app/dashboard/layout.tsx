import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { SidebarNav } from "./sidebar-nav";
import { MobileSidebarToggle } from "./mobile-sidebar";

const planBadge: Record<string, string> = {
  free: "bg-gray-100 text-gray-600",
  pro: "bg-blue-50 text-[#0666EB]",
  enterprise: "bg-purple-50 text-purple-600",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const plan = session.user.plan ?? "free";
  const badge = planBadge[plan] ?? planBadge.free;
  const userName = session.user.name ?? session.user.email ?? "User";
  const initial = userName.charAt(0).toUpperCase();

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F7F7F7]">
      {/* Mobile top bar + sliding sidebar */}
      <MobileSidebarToggle
        userName={userName}
        initial={initial}
        plan={plan}
        badge={badge}
        signOutAction={handleSignOut}
      />

      {/* Desktop sidebar — hidden on mobile */}
      <aside className="hidden md:flex w-64 bg-white flex-col shrink-0 sticky top-0 h-screen">
        {/* Logo */}
        <div className="px-6 py-6">
          <Link href="/dashboard" className="text-xl font-semibold text-[#191C1F] tracking-tight">
            SubTrack
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3">
          <SidebarNav />
        </nav>

        {/* User */}
        <div className="px-4 py-5 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#191C1F] text-white text-sm font-medium flex items-center justify-center shrink-0">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#191C1F] truncate">
                {userName}
              </p>
              <span className={`inline-block mt-0.5 px-2 py-0.5 text-xs font-medium rounded-full capitalize ${badge}`}>
                {plan}
              </span>
            </div>
          </div>
          <form action={handleSignOut}>
            <button
              type="submit"
              className="mt-3 w-full text-left text-sm text-gray-400 hover:text-gray-600 transition-colors duration-150"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
}
