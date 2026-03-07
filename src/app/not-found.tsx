"use client";

import Link from "next/link";
import { VenetianMask } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen w-full bg-background text-foreground items-center justify-center px-6 selection:bg-indigo-500/30">

      {/* Background Glows */}
      <div className="absolute inset-0 bg-zinc-950 overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="max-w-lg text-center relative z-10 w-full bg-zinc-900/50 p-10 md:p-14 rounded-[2.5rem] border border-white/5 backdrop-blur-xl shadow-2xl shadow-black/50">

        {/* LOGO */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(244,63,94,0.5)] ring-1 ring-white/20">
            <VenetianMask size={32} className="text-white drop-shadow-md" />
          </div>
        </div>

        {/* ERROR CODE */}
        <h1 className="text-8xl font-black tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
          404
        </h1>

        {/* TITLE */}
        <h2 className="text-2xl font-bold mb-4 text-zinc-200">
          Signal Lost
        </h2>

        {/* DESCRIPTION */}
        <p className="text-zinc-400 mb-10 text-lg leading-relaxed">
          The page you're looking for has vanished into the anonymous void. It
          may have been deleted, moved, or never existed.
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="
              px-8 py-3.5 rounded-xl
              bg-white text-black
              font-bold text-sm
              hover:bg-zinc-200 hover:scale-105 active:scale-95
              shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]
              transition-all duration-300
            "
          >
            Return Home
          </Link>

          <Link
            href="/sign-in"
            className="
              px-8 py-3.5 rounded-xl
              border border-zinc-700 bg-zinc-800/50 text-white
              font-bold text-sm
              hover:bg-zinc-800 hover:border-zinc-600 hover:scale-105 active:scale-95
              transition-all duration-300
            "
          >
            Access Network
          </Link>
        </div>

        {/* FOOTER */}
        <p className="mt-12 text-xs font-semibold tracking-wider uppercase text-zinc-600">
          Secret Message Platform
        </p>
      </div>
    </main>
  );
}
