"use client";

import { useState } from "react";
import Link from "next/link";

interface NavUser {
  name?: string | null;
  email?: string | null;
}

interface NavProps {
  user?: NavUser | null;
  transparent?: boolean;
}

function Logo() {
  return (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12a7 7 0 0 0-14 0" />
      <path d="M19 8v4h-4" />
      <path d="M5 12a7 7 0 0 0 14 0" />
      <path d="M5 16v-4h4" />
    </svg>
  );
}

export function Nav({ user, transparent }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const initial = user
    ? (user.name ?? user.email ?? "U").charAt(0).toUpperCase()
    : null;

  return (
    <nav
      className={`relative z-10 ${
        transparent ? "" : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        {/* Left: Logo + brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-[#191C1F]"
        >
          <Logo />
          <span className="text-xl font-semibold tracking-tight">
            SubTrack
          </span>
        </Link>

        {/* Right: Desktop */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            href="/pricing"
            className="text-sm font-medium text-gray-500 hover:text-[#191C1F] transition-colors duration-150"
          >
            Pricing
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-500 hover:text-[#191C1F] transition-colors duration-150"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard"
                className="w-8 h-8 rounded-full bg-[#191C1F] text-white text-xs font-medium flex items-center justify-center"
              >
                {initial}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="text-sm font-medium text-gray-500 hover:text-[#191C1F] transition-colors duration-150"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-1.5 text-sm font-medium text-white bg-[#191C1F] rounded-full hover:bg-[#2a2d31] transition-colors duration-150"
              >
                Start free
              </Link>
            </>
          )}
        </div>

        {/* Right: Mobile toggle */}
        <button
          className="md:hidden p-1 text-[#191C1F]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden absolute right-4 left-4 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-3 z-20">
          <Link
            href="/pricing"
            onClick={() => setMobileOpen(false)}
            className="block px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-[#191C1F] hover:bg-gray-50 transition-colors duration-150"
          >
            Pricing
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="block px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-[#191C1F] hover:bg-gray-50 transition-colors duration-150"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth/signin"
                onClick={() => setMobileOpen(false)}
                className="block px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-[#191C1F] hover:bg-gray-50 transition-colors duration-150"
              >
                Sign in
              </Link>
              <div className="px-5 pt-2">
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center py-2.5 text-sm font-medium text-white bg-[#191C1F] rounded-full hover:bg-[#2a2d31] transition-colors duration-150"
                >
                  Start free
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
