import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { PLAN_BADGE_COLORS, type PlanId } from "@/lib/plans";
import { SidebarNav } from "./sidebar-nav";
import { SidebarUser } from "./sidebar-user";
import { MobileSidebarToggle } from "./mobile-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const plan = (session.user.plan ?? "free") as PlanId;
  const badge = PLAN_BADGE_COLORS[plan];
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
        <div className="px-6 py-6">
          <Link href="/dashboard" className="text-xl font-semibold text-[#191C1F] tracking-tight">
            SubTrack
          </Link>
        </div>

        <nav className="flex-1 px-3">
          <SidebarNav />
        </nav>

        <SidebarUser
          initial={initial}
          userName={userName}
          plan={plan}
          badge={badge}
          signOutAction={handleSignOut}
        />
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
