// // "use client";

// // import { useState } from "react";

// // export default function ForgotPasswordPage() {
// //   const [email, setEmail] = useState("");

// //   const handleSubmit = async (e: any) => {
// //     e.preventDefault();

// //     await fetch("/api/forgot-password", {
// //       method: "POST",
// //       body: JSON.stringify({ email }),
// //     });

// //     alert("If account exists, reset email sent.");
// //   };

// //   return (
// //     <main className="flex items-center justify-center min-h-screen">
// //       <form onSubmit={handleSubmit} className="space-y-6 w-80">
// //         <h1 className="text-2xl font-bold">Forgot Password</h1>

// //         <input
// //           type="email"
// //           placeholder="Enter your email"
// //           required
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //           className="w-full border-b outline-none h-10"
// //         />

// //         <button className="w-full bg-black text-white h-12">
// //           Send Reset Link
// //         </button>
// //       </form>
// //     </main>
// //   );
// // }

// "use client";

// import { useState } from "react";
// import { EyeOff, Loader2 } from "lucide-react";
// import Link from "next/link";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";

// export default function ForgotPasswordPage() {
//   const [email, setEmail] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const router = useRouter();

//   //! handle form submission
//   const handleSubmit = async (e: any) => {
//     e.preventDefault();

//     if (!email) {
//       toast.error("Email is required");
//       return;
//     }

//     setIsSubmitting(true);

//     const loadingToast = toast.loading("Sending reset link...");

//     try {
//       const res = await fetch("/api/forgot-password", {
//         method: "POST",
//         body: JSON.stringify({ email }),
//       });

//       const data = await res.json();

//       toast.dismiss(loadingToast);

//       if (!data.success) {
//         toast.error(data.message);
//         return;
//       }

//       //? Long toast message
//       toast.success("Reset link sent", {
//         description:
//           "Please check your email and click the reset password button to continue.",
//         duration: 1000 * 10, // 10 seconds
//       });

//       setEmail("");

//       //? Auto redirect to login page after 15 seconds
//       setTimeout(() => {
//         toast.message("Redirecting to login...");
//         router.replace("/sign-in");
//       }, 15000);
//     } catch (error) {
//       toast.dismiss(loadingToast);
//       toast.error("Something went wrong");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <main className="relative flex min-h-screen w-full flex-col overflow-hidden bg-white text-black">
//       {/* header */}
//       <header className="flex items-center justify-between px-8 py-6 border-b border-black">
//         <div className="flex items-center gap-3">
//           <div className="flex h-10 w-10 items-center justify-center bg-black text-white">
//             <EyeOff size={20} />
//           </div>

//           <h1 className="text-xl font-bold tracking-tighter uppercase">
//             Secret Message
//           </h1>
//         </div>

//         <Link
//           href="#"
//           className="text-sm font-bold border-b-2 border-black hover:bg-black hover:text-white transition-colors px-1"
//         >
//           SUPPORT
//         </Link>
//       </header>

//       {/* main */}
//       <section className="flex flex-1 items-center justify-center p-6">
//         <div className="w-full max-w-md bg-white p-10 border border-black shadow-md">
//           {/* title */}
//           <div className="mb-10 text-center">
//             <h2 className="text-3xl font-bold mb-4 uppercase tracking-tight">
//               Reset Password
//             </h2>

//             <p className="text-sm leading-relaxed">
//               Enter your email address and we will send you a secure link to
//               reset your password.
//             </p>
//           </div>

//           {/* form */}
//           <form onSubmit={handleSubmit} className="space-y-8">
//             <div className="space-y-3">
//               <label className="text-xs font-bold uppercase tracking-widest">
//                 Email Address
//               </label>

//               <input
//                 type="email"
//                 placeholder="name@domain.com"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="
//                   w-full
//                   py-4 px-4
//                   border border-black
//                   outline-none
//                   focus:ring-1 focus:ring-black
//                   placeholder:text-gray-400
//                 "
//               />
//             </div>

//             {/* button */}
//             <button
//               disabled={isSubmitting}
//               className="
//                 w-full py-5
//                 bg-black text-white
//                 font-bold uppercase tracking-widest
//                 flex items-center justify-center gap-2
//                 hover:bg-zinc-800 transition
//               "
//             >
//               {isSubmitting ? (
//                 <Loader2 className="animate-spin" />
//               ) : (
//                 "Send Reset Link"
//               )}
//             </button>
//           </form>

//           {/* back to login */}
//           <div className="mt-10 pt-8 border-t border-gray-200 text-center">
//             <Link
//               href="/sign-in"
//               className="inline-flex items-center gap-2 text-sm font-bold hover:underline"
//             >
//               ← BACK TO LOGIN
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* footer */}
//       <footer className="p-8 text-center">
//         <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
//           © 2026 Incognito Messaging Platform. Secure & Anonymous.
//         </p>
//       </footer>
//     </main>
//   );
// }


"use client";

import { useState } from "react";
import { Loader2, Mail, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    setIsSubmitting(true);

    const loadingToast = toast.loading("Sending reset link...");

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      toast.dismiss(loadingToast);

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success("Reset link sent", {
        description:
          "Please check your email and click the reset password button to continue.",
        duration: 10000,
      });

      setEmail("");

      setTimeout(() => {
        toast.message("Redirecting to login...");
        router.replace("/sign-in");
      }, 15000);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Recover your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Identity.
              </span>
            </h1>

            <p className="text-zinc-400 text-lg leading-relaxed mb-10">
              Enter your email address and we will send you a secure link to reset your password and regain access to your anonymous inbox.
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
              Forgot Password
            </h1>

            <p className="text-sm text-muted-foreground mt-3 font-medium">
              We'll send you an email to reset your password
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all placeholder:text-muted-foreground/50 shadow-sm"
              />
            </div>

            <button
              disabled={isSubmitting}
              className="w-full h-12 mt-4 rounded-xl bg-foreground text-background font-bold flex items-center justify-center transition-all hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-lg"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Mail size={18} className="mr-2" />
                  Send Reset Link
                </>
              )}
            </button>

          </form>

          {/* BACK LINK */}
          <div className="mt-8 pt-8 border-t border-border text-center">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-muted-foreground hover:text-indigo-500 transition-colors inline-flex items-center gap-2"
            >
              ← Back to Login
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}