"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isAuthenticated, getUsername, logout } from "@/utils/auth";

export default function Navbar() {
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setAuthed(isAuthenticated());
    setUsername(getUsername());
  }, []);

  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-zinc-900">
          ResumeAI
        </Link>
        <div className="flex items-center gap-4">
          {authed ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
              >
                Dashboard
              </Link>
              <span className="text-sm text-zinc-500">{username}</span>
              <button
                onClick={logout}
                className="rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-200"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
