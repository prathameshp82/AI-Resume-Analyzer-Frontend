"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isAuthenticated, getUsername, logout } from "@/utils/auth";

export default function Navbar() {
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setAuthed(isAuthenticated());
    setUsername(getUsername());

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-strong shadow-lg shadow-indigo-500/5"
          : "bg-white/50 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg shadow-lg shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-110">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-xl font-bold gradient-text">ResumeAI</span>
        </Link>

        <div className="flex items-center gap-3">
          {authed ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full gradient-bg text-xs font-bold text-white">
                  {username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-indigo-700">{username}</span>
              </div>
              <button
                onClick={logout}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition-all hover:bg-red-50 hover:text-red-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-xl gradient-bg px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:brightness-110 btn-shine"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
