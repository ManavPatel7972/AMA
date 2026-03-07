"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { VenetianMask, LogOut } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const hiddenRoutes = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
  ];

  if (hiddenRoutes.includes(pathname)) return null;

  const handleLogout = async () => {
    try {
      await signOut({
        redirect: false,
      });

      toast.success("Logged out successfully");

      router.replace("/sign-in");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-indigo-500/10 bg-zinc-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-zinc-950/60 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.5)]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* BRANDING / LOGO */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 group transition-transform active:scale-95"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] ring-1 ring-white/20 group-hover:scale-105 group-hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.6)] transition-all duration-300">
            <VenetianMask size={22} className="text-white drop-shadow-md" />
          </div>
          <h1 className="text-xl font-black tracking-tight bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent group-hover:to-white transition-colors duration-300">
            Secret Message
          </h1>
        </Link>

        {/* NAV LINKS (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 bg-white/5 px-6 py-2.5 rounded-full border border-white/5 shadow-inner">
          <Link
            href="/"
            className="text-zinc-400 hover:text-white transition-colors text-sm font-bold tracking-wide"
          >
            Home
          </Link>

          <Link
            href="/about"
            className="text-zinc-400 hover:text-white transition-colors text-sm font-bold tracking-wide"
          >
            About
          </Link>

          <Link
            href="/privacy"
            className="text-zinc-400 hover:text-white transition-colors text-sm font-bold tracking-wide"
          >
            Privacy
          </Link>
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="
              inline-flex items-center gap-2 justify-center whitespace-nowrap
              px-5 py-2.5 rounded-xl
              text-sm font-bold
              bg-white/5 text-zinc-300 border border-white/10
              shadow-md backdrop-blur-sm
              transition-all duration-300
              hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 hover:shadow-[0_0_20px_-5px_rgba(244,63,94,0.3)] hover:-translate-y-0.5
              active:scale-95 active:translate-y-0
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500
            "
          >
            <LogOut size={16} className="transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

      </div>
    </header>
  );
}
