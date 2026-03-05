"use client";

import { useState } from "react";
import { SidebarNav } from "./sidebar-nav";

interface MobileSidebarProps {
  userName: string;
  initial: string;
  plan: string;
  badge: string;
}

export function MobileSidebarToggle({
  userName,
  initial,
  plan,
  badge,
  signOutAction,
}: MobileSidebarProps & { signOutAction: () => Promise<void> }) {
  const [open, setOpen] = useState(false);

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
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />
          {/* Sidebar panel */}
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white flex flex-col shadow-xl">
            {/* Header */}
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

            {/* Nav links */}
            <nav className="flex-1 px-3" onClick={() => setOpen(false)}>
              <SidebarNav />
            </nav>

            {/* User section */}
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
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="mt-3 w-full text-left text-sm text-gray-400 hover:text-gray-600 transition-colors duration-150 py-1"
                >
                  Sign out
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
