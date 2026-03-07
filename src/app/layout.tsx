"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "../context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "True Feedback",
//   description: "Real feedback from real people.",
// };

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Ambient Background Gradient Mesh */}
            <div className="fixed inset-0 -z-10 bg-background overflow-hidden pointer-events-none">
              <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-purple-500/10 dark:bg-purple-600/15 blur-[120px] mix-blend-normal opacity-70 animate-pulse duration-10000" />
              <div className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-pink-500/10 dark:bg-pink-600/15 blur-[120px] mix-blend-normal opacity-70 animate-pulse duration-10000 delay-1000" />
            </div>

            <div className="relative z-0">
              {children}
            </div>
            <Toaster
              position="bottom-right"

              toastOptions={{
                classNames: {
                  toast: "!bg-black !text-white border border-white/10 dark:!bg-card dark:!text-foreground dark:border-border",
                  title: "!text-white dark:!text-foreground font-semibold",
                  description: "!text-gray-300 dark:!text-muted-foreground",
                  actionButton: "bg-white text-black dark:bg-primary dark:text-primary-foreground",
                  cancelButton: "bg-neutral-800 text-white dark:bg-muted dark:text-muted-foreground",
                },
              }}
            />
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
