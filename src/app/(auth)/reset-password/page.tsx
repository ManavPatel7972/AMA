// // "use client";

// // import { useSearchParams } from "next/navigation";
// // import { useState } from "react";

// // export default function ResetPasswordPage() {

// //   const searchParams = useSearchParams();
// //   const token = searchParams.get("token");

// //   const [password, setPassword] = useState("");

// //   const handleSubmit = async (e: any) => {
// //     e.preventDefault();

// //     const res = await fetch("/api/reset-password", {
// //       method: "POST",
// //       body: JSON.stringify({
// //         token,
// //         password,
// //       }),
// //     });

// //     const data = await res.json();
// //     alert(data.message);
// //   };

// //   return (
// //     <form onSubmit={handleSubmit}>
// //       <h2>Reset Password</h2>

// //       <input
// //         type="password"
// //         placeholder="New Password"
// //         value={password}
// //         onChange={(e) => setPassword(e.target.value)}
// //       />

// //       <button type="submit">Reset Password</button>
// //     </form>
// //   );
// // }

// "use client";

// import { useState } from "react";
// import { EyeOff, Loader2 } from "lucide-react";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import { toast } from "sonner";

// export default function ResetPasswordPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const token = searchParams.get("token");

//   const [password, setPassword] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // ! Handle form submission
//   const handleSubmit = async (e: any) => {
//     e.preventDefault();

//     if (!token) {
//       toast.error("Invalid reset token");
//       return;
//     }

//     if (!password) {
//       toast.error("Password is required");
//       return;
//     }

//     setIsSubmitting(true);

//     const loadingToast = toast.loading("Resetting password...");

//     try {
//       const res = await fetch("/api/reset-password", {
//         method: "POST",
//         body: JSON.stringify({
//           token,
//           password,
//         }),
//       });

//       const data = await res.json();

//       toast.dismiss(loadingToast);

//       if (!data.success) {
//         toast.error(data.message);
//         return;
//       }

//       toast.success("Password changed successfully", {
//         description: "Redirecting to login...",
//       });

//       setPassword("");

//       setTimeout(() => {
//         router.replace("/sign-in");
//       }, 1500);
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
//               New Password
//             </h2>

//             <p className="text-sm leading-relaxed">
//               Enter your new password to regain access to your account.
//             </p>
//           </div>

//           {/* form */}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* token */}
//             <div className="space-y-3">
//               <label className="text-xs font-bold uppercase tracking-widest">
//                 Reset Token
//               </label>

//               <input
//                 value={token || ""}
//                 disabled
//                 className="
//                   w-full py-4 px-4
//                   border border-black
//                   bg-gray-100
//                   text-gray-600
//                 "
//               />
//             </div>

//             {/* password */}
//             <div className="space-y-3">
//               <label className="text-xs font-bold uppercase tracking-widest">
//                 New Password
//               </label>

//               <input
//                 type="password"
//                 placeholder="••••••••"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="
//                   w-full py-4 px-4
//                   border border-black
//                   outline-none
//                   focus:ring-1 focus:ring-black
//                   placeholder:text-gray-400
//                 "
//               />
//             </div>

//             {/* bitton */}
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
//                 "Change Password"
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
//           © 2026 INCOGNITO MESSAGING PLATFORM. SECURE & ANONYMOUS.
//         </p>
//       </footer>
//     </main>
//   );
// }


"use client";

import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    if (!password) {
      toast.error("Password is required");
      return;
    }

    setIsSubmitting(true);

    const loadingToast = toast.loading("Resetting password...");

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await res.json();

      toast.dismiss(loadingToast);

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success("Password changed successfully", {
        description: "Redirecting to login...",
      });

      setPassword("");

      setTimeout(() => {
        router.replace("/sign-in");
      }, 1500);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex w-full min-h-screen overflow-hidden font-sans bg-background text-foreground">

      {/* Left Section */}
      <section className="hidden lg:flex w-1/2 bg-primary text-primary-foreground p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-20">
            <div className="size-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm">
              <ShieldCheck size={18} />
            </div>
            <h2 className="text-xl font-bold uppercase">
              Account Recovery
            </h2>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold uppercase leading-tight tracking-tight">
            Set
            <br />
            New Password
          </h1>

          <p className="text-primary-foreground/70 mt-6 text-lg">
            Create a new secure password to regain access to your account.
          </p>
        </div>
      </section>

      {/* Right Section */}
      <section className="flex w-full lg:w-1/2 justify-center items-center px-6 md:px-20 selection:bg-primary/20 selection:text-primary">

        <div className="w-full max-w-sm">

          <h1 className="text-3xl font-bold uppercase tracking-tight mb-10 text-center lg:text-left">
            Reset Password
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Token */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Reset Token
              </label>

              <input
                value={token || ""}
                disabled
                className="w-full h-11 px-3 py-2 rounded-md border border-input bg-muted text-muted-foreground text-sm focus-visible:outline-none"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                New Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3 py-2 rounded-md border border-input bg-background/50 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:bg-background/80"
              />
            </div>

            {/* Button */}
            <button
              disabled={isSubmitting}
              className="w-full h-12 rounded-md bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest flex items-center justify-center transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Change Password"
              )}
            </button>

          </form>

          {/* Back to login */}
          <div className="mt-10 pt-8 border-t border-border text-center">
            <Link
              href="/sign-in"
              className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Login
            </Link>
          </div>

        </div>

      </section>

    </main>
  );
}
