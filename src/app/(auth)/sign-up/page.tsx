"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, VenetianMask, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signUpSchema } from "@/schemas/signUpSchema";

const SignUpPage = () => {
  const router = useRouter();

  //! form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  //! handle form input changes
  const handleChange = (e: any) => {
    e.preventDefault();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // username unique check
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (!formData.username) return;

      setIsCheckingUsername(true);
      setUsernameMessage("");

      try {
        const res = await fetch(
          `/api/check-username-unique?username=${formData.username}`,
          { method: "POST" }
        );

        const data = await res.json();
        setUsernameMessage(data.message);
      } catch (error) {
        setUsernameMessage("Error checking username");
      } finally {
        setIsCheckingUsername(false);
      }
    };

    const timer = setTimeout(checkUsernameUnique, 600);
    return () => clearTimeout(timer);
  }, [formData.username]);

  // ================= VALIDATION =================

  const validateForm = () => {
    const result = signUpSchema.safeParse(formData);

    if (!result.success) {
      const firstError = result.error.issues[0].message;

      toast.error(firstError, {
        description: "Please check your input",
      });

      return false;
    }

    return true;
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message, {
        description: "Verification code sent to your email",
      });

      setFormData({
        username: "",
        email: "",
        password: "",
      });

      setUsernameMessage("");

      router.replace(
        `/verify-code?username=${encodeURIComponent(formData.username)}`
      );
    } catch (error) {
      toast.error("Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  //! ------------------------------------------------------------------

  return (
    <main className="min-h-screen w-full grid lg:grid-cols-2 bg-background text-foreground selection:bg-indigo-500/30">

      {/* LEFT SIDE ENHANCED */}
      <section className="hidden lg:flex flex-col justify-between p-16 bg-zinc-950 text-white relative overflow-hidden">

        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-zinc-950 to-purple-950 opacity-80" />
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

        <div className="relative z-10 flex flex-col h-full justify-between">

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-2xl">
              <VenetianMask size={24} className="text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
              Secret Message
            </h2>
          </div>

          <div className="max-w-lg my-auto">
            <h1 className="text-5xl font-black mb-6 leading-[1.1] tracking-tight text-white">
              Speak freely. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Stay anonymous.
              </span>
            </h1>

            <p className="text-zinc-400 text-lg leading-relaxed mb-10">
              Receive honest messages from friends, followers, and strangers —
              without revealing their identity. A safe space to hear reality.
            </p>

            <div className="space-y-4">
              {[
                "Send and receive anonymous messages",
                "Your identity is always protected",
                "Share your unique profile link",
                "Connect with anyone anywhere"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <ArrowRight size={12} className="text-indigo-400" />
                  </div>
                  <span className="text-sm font-medium text-zinc-300">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-zinc-500 font-medium">
            © {new Date().getFullYear()} Secret Message Network
          </p>
        </div>

      </section>

      {/* RIGHT SIDE FORM ENHANCED */}
      <section className="flex items-center justify-center p-6 md:p-12 relative overflow-hidden bg-background">

        {/* Mobile ambient glow */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 lg:hidden" />

        <div className="w-full max-w-[420px] relative z-10">

          {/* HEADER */}
          <div className="mb-10 text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center rounded-2xl shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] mb-6 ring-1 ring-white/20">
              <VenetianMask size={32} className="drop-shadow-md" />
            </div>

            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Create Account
            </h1>

            <p className="text-sm text-muted-foreground mt-3 font-medium">
              Join anonymously and start receiving messages.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* USERNAME */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Username
              </label>

              <div className="relative">
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  type="text"
                  placeholder="Choose a secret alias"
                  className="w-full h-12 px-4 rounded-xl border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all placeholder:text-muted-foreground/50 shadow-sm"
                />

                {isCheckingUsername && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Loader2 size={16} className="animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>

              {!isCheckingUsername && usernameMessage && (
                <p
                  className={`text-xs font-medium ml-1 ${usernameMessage === "Username is available"
                      ? "text-emerald-500"
                      : "text-rose-500"
                    }`}
                >
                  {usernameMessage}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Email
              </label>

              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="address@provider.com"
                className="w-full h-12 px-4 rounded-xl border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all placeholder:text-muted-foreground/50 shadow-sm"
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Password
              </label>

              <div className="relative">
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  className="w-full h-12 px-4 pr-12 rounded-xl border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all placeholder:text-muted-foreground/50 shadow-sm"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 mt-6 rounded-xl bg-foreground text-background font-bold flex items-center justify-center transition-all hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-lg"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Create Secret Account"
              )}
            </button>
          </form>

          {/* LOGIN LINK */}
          <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-indigo-500 hover:text-indigo-600 transition-colors">
              Sign in instead
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
};

export default SignUpPage;

