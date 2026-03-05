"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SidebarNav } from "./sidebar-nav";
import { SidebarUser } from "./sidebar-user";

interface MobileSidebarProps {
  userName: string;
  initial: string;
  plan: string;
  badge: string;
  signOutAction: () => Promise<void>;
}

export function MobileSidebarToggle({
  userName,
  initial,
  plan,
  badge,
  signOutAction,
}: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <span className="text-lg font-semibold text-[#191C1F] tracking-tight">
          SubTrack
        </span>
        <button
          onClick={() => setOpen(true)}
          className="p-2 -mr-2 text-[#191C1F]"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          </svg>
        </button>
      </div>

      {/* Backdrop + sliding sidebar */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-5 py-5">
              <span className="text-xl font-semibold text-[#191C1F] tracking-tight">
                SubTrack
              </span>
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-gray-400 hover:text-[#191C1F]"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 px-3">
              <SidebarNav />
            </nav>

            <SidebarUser
              initial={initial}
              userName={userName}
              plan={plan}
              badge={badge}
              signOutAction={signOutAction}
            />
          </aside>
        </div>
      )}
    </>
  );
}
