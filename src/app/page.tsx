import Link from "next/link";
import { MessageSquare, VenetianMask, Zap, ArrowRight, Github } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-indigo-500/10 bg-zinc-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-zinc-950/60 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.5)]">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-6xl">

          {/* BRANDING / LOGO */}
          <Link href="/" className="flex items-center gap-3 group transition-transform active:scale-95">
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
              href="#features"
              className="text-zinc-400 hover:text-white transition-colors text-sm font-bold tracking-wide"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-zinc-400 hover:text-white transition-colors text-sm font-bold tracking-wide"
            >
              How it Works
            </Link>
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-zinc-300 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="
                inline-flex items-center justify-center whitespace-nowrap
                px-5 py-2.5 rounded-xl
                text-sm font-bold
                bg-white/5 text-zinc-300 border border-white/10
                shadow-md backdrop-blur-sm
                transition-all duration-300
                hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-500/30 hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)] hover:-translate-y-0.5
                active:scale-95 active:translate-y-0
              "
            >
              Get Started
            </Link>
          </div>

        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10"></div>

          <div className="container mx-auto px-6 max-w-6xl text-center">
            <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-bold text-purple-600 dark:text-purple-400 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm backdrop-blur-md">
              <span className="flex h-2.5 w-2.5 rounded-full bg-pink-500 mr-2 animate-pulse"></span>
              Say it how you feel it 💅
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100 leading-tight">
              Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Real</span> <br className="hidden md:block" />
              Feedback.
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl font-medium text-muted-foreground mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 px-4">
              Create your link. Share it on your story. See what your friends truly think about you without them holding back. 100% anonymous & secure.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300 w-full sm:w-auto px-6">
              <Link
                href="/sign-up"
                className="w-full sm:w-auto px-10 py-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-lg tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-pink-500/40 hover:-translate-y-1 active:scale-95 transition-all duration-300"
              >
                Get Started Now
                <ArrowRight size={20} className="animate-bounce-right" />
              </Link>
              <Link
                href="/sign-in"
                className="w-full sm:w-auto px-10 py-5 rounded-full border-2 border-border bg-background/50 backdrop-blur-sm font-bold text-lg flex items-center justify-center gap-2 hover:bg-muted hover:border-purple-500/50 transition-all duration-300"
              >
                Log In
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/30 border-t border-border/50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to grow</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Built from the ground up to ensure complete anonymity while providing powerful tools to manage and organize your feedback.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group bg-card/60 backdrop-blur-md text-card-foreground border-2 border-border/50 p-8 rounded-3xl shadow-lg hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/30 transition-all hover:-translate-y-1">
                <div className="size-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-md">
                  <VenetianMask size={28} />
                </div>
                <h3 className="text-2xl font-black mb-3">100% Anonymous</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  We don't track who sends what. Period. Your friends can share their honest truths totally risk-free.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group bg-card/60 backdrop-blur-md text-card-foreground border-2 border-border/50 p-8 rounded-3xl shadow-lg hover:shadow-xl hover:shadow-pink-500/10 hover:border-pink-500/30 transition-all hover:-translate-y-1">
                <div className="size-14 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white mb-6 transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-md">
                  <MessageSquare size={28} />
                </div>
                <h3 className="text-2xl font-black mb-3">Reply Back</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  Got a juicy message? Reply to the sender anonymously and keep the conversation flowing!
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group bg-card/60 backdrop-blur-md text-card-foreground border-2 border-border/50 p-8 rounded-3xl shadow-lg hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all hover:-translate-y-1">
                <div className="size-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-md">
                  <Zap size={28} />
                </div>
                <h3 className="text-2xl font-black mb-3">AI Suggestions</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  Not sure what to say? Let our AI generate some fun, clever responses so you never run out of ideas.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 opacity-80">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center">
              <VenetianMask size={18} className="text-white" />
            </div>
            <span className="font-black tracking-tight text-lg text-foreground">Secret Message</span>
          </div>

          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
          </div>

          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Secret Message.
          </div>
        </div>
      </footer>
    </div>
  );
}
