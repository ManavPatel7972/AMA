// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";

// export default function VerifyAccountPage() {
//   const router = useRouter();

//   const [identifier, setIdentifier] = useState("");
//   const [code, setCode] = useState("");
//   const [step, setStep] = useState(1);

//   const sendCode = async () => {
//     const res = await fetch("/api/send-verification-code", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ identifier }),
//     });

//     const data = await res.json();

//     if (!data.success) {
//       toast.error(data.message);
//       return;
//     }

//     toast.success("Verification code sent to your email");

//     setStep(2);
//   };

//   const verifyCode = async () => {
//     const res = await fetch("/api/verify-account", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ identifier, code }),
//     });

//     const data = await res.json();

//     if (!data.success) {
//       toast.error(data.message);
//       return;
//     }

//     toast.success("Account verified successfully");

//     router.replace("/sign-in");
//   };

//   return (
//     <div className="flex flex-col gap-4 max-w-md mx-auto mt-20">
//       {step === 1 && (
//         <>
//           <h2>Verify Account</h2>

//           <input
//             placeholder="Enter Email or Username"
//             value={identifier}
//             onChange={(e) => setIdentifier(e.target.value)}
//           />

//           <button onClick={sendCode}>Send Verification Code</button>
//         </>
//       )}

//       {step === 2 && (
//         <>
//           <h2>Enter Verification Code</h2>

//           <input
//             placeholder="Enter Code"
//             value={code}
//             onChange={(e) => setCode(e.target.value)}
//           />

//           <button onClick={verifyCode}>Verify Account</button>
//         </>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { Loader2, Mail, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function VerifyAccountPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  const sendCode = async () => {

    if (!identifier) {
      toast.error("Please enter email or username");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/verify-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "sendCode",
          identifier,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        if (data.message === "User is already verified Please login.") {
          toast.error(data.message, {
            description: "Redirecting to sign in page...",
          });
          setTimeout(() => {
            router.replace("/sign-in");
          }, 2000);
          return;
        }

        toast.error(data.message);
        return;
      }

      toast.success("Verification code sent to your email");
      setStep(2);
    } catch (error) {
      toast.error("Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!code) {
      toast.error("Enter verification code");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/verify-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "verifyCode",
          identifier,
          code,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success("Account verified successfully");
      router.replace("/sign-in");
    } catch (error) {
      toast.error("Verification failed");
    } finally {
      setLoading(false);
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
              Verify your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Identity.
              </span>
            </h1>

            <p className="text-zinc-400 text-lg leading-relaxed mb-10">
              Enter the verification code sent to your email to unlock your account and start receiving anonymous feedback.
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
              Verify Account
            </h1>

            <p className="text-sm text-muted-foreground mt-3 font-medium">
              Check your email for the code
            </p>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Email or Username
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter email or username"
                  className="w-full h-12 px-4 rounded-xl border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all placeholder:text-muted-foreground/50 shadow-sm"
                />
              </div>

              <button
                onClick={sendCode}
                disabled={loading}
                className="w-full h-12 mt-4 rounded-xl bg-foreground text-background font-bold flex items-center justify-center transition-all hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-lg"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Mail size={18} className="mr-2" />
                    Send Verification Code
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter code from email"
                  className="w-full h-12 px-4 rounded-xl border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all placeholder:text-muted-foreground/50 shadow-sm"
                />
              </div>

              <button
                onClick={verifyCode}
                disabled={loading}
                className="w-full h-12 mt-4 rounded-xl bg-foreground text-background font-bold flex items-center justify-center transition-all hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-lg"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <ShieldCheck size={18} className="mr-2" />
                    Verify Account
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
