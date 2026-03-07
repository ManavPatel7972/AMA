// "use client";

// import React, { useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { Loader2 } from "lucide-react";
// import { toast } from "sonner";

// const VerifyCodePage = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const username = searchParams.get("username") || "";

//   const [code, setCode] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // ================= VERIFY CODE =================
//   const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!code) {
//       toast.error("Enter verification code");
//       return;
//     }

//     const loadingToast = toast.loading("Verifying identity...");

//     setIsSubmitting(true);

//     try {
//       const res = await fetch("/api/verify-code", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           username,
//           code,
//         }),
//       });

//       const data = await res.json();

//       toast.dismiss(loadingToast);

//       if (!res.ok) {
//         toast.error(data.message);
//         return;
//       }

//       toast.success("Verification Successful ✅", {
//         description: "Your account is now active",
//       });

//       router.replace("/sign-in");
//     } catch (error) {
//       toast.dismiss(loadingToast);
//       toast.error("Verification failed");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // =====================================================
//   return (
//     <main className="flex min-h-screen bg-white text-black">
//       {/* LEFT SIDE */}
//       <section className="hidden lg:flex w-1/2 bg-black text-white p-16 flex-col justify-center">
//         <h1 className="text-6xl font-bold uppercase">
//           Verify
//           <br />
//           Identity
//         </h1>

//         <p className="mt-6 text-white/60 max-w-sm">
//           Enter the secure verification code sent to your email.
//         </p>
//       </section>

//       {/* RIGHT SIDE */}
//       <section className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-24">
//         <div className="w-full max-w-md">
//           <h2 className="text-3xl font-bold uppercase mb-10">
//             Verification Code
//           </h2>

//           <form onSubmit={handleVerify} className="space-y-8">
//             {/* CODE INPUT */}
//             <div>
//               <label className="text-[10px] font-bold uppercase tracking-widest">
//                 Enter Code
//               </label>

//               <input
//                 type="text"
//                 value={code}
//                 onChange={(e) => setCode(e.target.value)}
//                 placeholder="6 digit code"
//                 className="w-full h-12 border-b border-black bg-transparent text-center text-xl tracking-[0.5em] focus:outline-none"
//               />

//               <p className="text-[9px] text-black/40 mt-2 uppercase">
//                 Sent to @{username}
//               </p>
//             </div>

//             {/* SUBMIT */}
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full h-14 bg-black text-white uppercase font-bold tracking-widest flex items-center justify-center hover:bg-neutral-800 transition"
//             >
//               {isSubmitting ? (
//                 <Loader2 className="animate-spin" />
//               ) : (
//                 "Verify Account"
//               )}
//             </button>
//           </form>
//         </div>
//       </section>
//     </main>
//   );
// };

// export default VerifyCodePage;

"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const VerifyCodePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const username = searchParams.get("username") || "";

  // ================= STATE =================
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ================= OTP INPUT =================
  const handleCodeChange = (e: any) => {
    let value = e.target.value;

    // allow numbers only
    value = value.replace(/\D/g, "");

    // limit to 6 digits
    if (value.length <= 6) {
      setCode(value);
    }
  };

  // ================= VERIFY FUNCTION =================
  const verifyCode = async () => {
    if (code.length !== 6) return;

    const loadingToast = toast.loading("Verifying identity...");

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          code,
        }),
      });

      const data = await res.json();

      toast.dismiss(loadingToast);

      if (!res.ok) {
        toast.error(data.message);
        setCode(""); // reset otp
        return;
      }

      toast.success("Verification Successful", {
        description: "Your account is now active",
      });

      router.replace("/sign-in");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= AUTO VERIFY =================
  useEffect(() => {
    if (code.length === 6 && !isSubmitting) {
      verifyCode();
    }
  }, [code]);

  // ================= FORM SUBMIT =================
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    verifyCode();
  };

  // ======================================================
  return (
    <main className="min-h-screen w-full grid lg:grid-cols-2 bg-background text-foreground selection:bg-indigo-500/30">

      {/* LEFT SIDE CONTENT */}
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
              <ShieldCheck size={24} className="text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
              Secret Message
            </h2>
          </div>

          <div className="max-w-md my-auto">
            <h1 className="text-5xl font-black mb-6 leading-[1.1] tracking-tight text-white">
              Verify your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Identity.
              </span>
            </h1>

            <p className="text-zinc-400 text-lg leading-relaxed mb-10">
              Enter the secure verification code sent to your email to activate your account.
            </p>
          </div>

          <p className="text-xs text-zinc-500 font-medium">
            © {new Date().getFullYear()} Secret Message Network
          </p>
        </div>

      </section>

      {/* RIGHT SIDE FORM */}
      <section className="flex items-center justify-center p-6 md:p-12 relative overflow-hidden bg-background">

        {/* Mobile ambient glow */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 lg:hidden" />

        <div className="w-full max-w-[420px] relative z-10">

          {/* HEADER */}
          <div className="mb-10 text-center lg:text-left">
            <div className="w-16 h-16 mx-auto lg:mx-0 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center rounded-2xl shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] mb-6 ring-1 ring-white/20">
              <ShieldCheck size={32} className="drop-shadow-md" />
            </div>

            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Verification Code
            </h1>

            <p className="text-sm text-muted-foreground mt-3 font-medium">
              We need to verify it's you
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* OTP INPUT */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex justify-between">
                <span>Enter Code</span>
                {username && <span className="lowercase normal-case font-medium text-indigo-400">@{username}</span>}
              </label>

              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={handleCodeChange}
                maxLength={6}
                placeholder="000000"
                className="w-full h-16 rounded-xl border border-input bg-background text-center text-4xl tracking-[0.5em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all font-mono placeholder:text-muted-foreground/30 shadow-sm"
              />
            </div>

            {/* VERIFY BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting || code.length !== 6}
              className="w-full h-12 mt-4 rounded-xl bg-foreground text-background font-bold flex items-center justify-center transition-all hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-lg"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Verify Account"
              )}
            </button>
          </form>

        </div>
      </section>
    </main>
  );
};

export default VerifyCodePage;
