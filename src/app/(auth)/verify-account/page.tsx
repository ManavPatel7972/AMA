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
    <main className="flex w-full min-h-screen overflow-hidden font-sans bg-background text-foreground">
      {/* Left Section */}
      <section className="hidden lg:flex w-1/2 bg-primary text-primary-foreground p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-20">
            <div className="size-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm">
              <ShieldCheck size={18} />
            </div>
            <h2 className="text-xl font-bold uppercase">Account Security</h2>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold uppercase leading-tight tracking-tight">
            Verify
            <br />
            Your Identity
          </h1>

          <p className="text-primary-foreground/70 mt-6 text-lg">
            Enter the verification code sent to your email to unlock your
            account.
          </p>
        </div>
      </section>

      {/* Right Section */}
      <section className="flex w-full lg:w-1/2 justify-center items-center px-6 md:px-20 selection:bg-primary/20 selection:text-primary">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold uppercase tracking-tight mb-10 text-center lg:text-left">
            Verify Account
          </h1>

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Email or Username
                </label>

                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter email or username"
                  className="w-full h-11 px-3 py-2 rounded-md border border-input bg-background/50 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:bg-background/80"
                />
              </div>

              <button
                onClick={sendCode}
                disabled={loading}
                className="w-full h-12 rounded-md bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest flex items-center justify-center transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
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
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Verification Code
                </label>

                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter code from email"
                  className="w-full h-11 px-3 py-2 rounded-md border border-input bg-background/50 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:bg-background/80"
                />
              </div>

              <button
                onClick={verifyCode}
                disabled={loading}
                className="w-full h-12 rounded-md bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest flex items-center justify-center transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
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
