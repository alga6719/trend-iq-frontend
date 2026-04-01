"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Ticker } from "@/components/ticker";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo, just navigate to dashboard
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen">
      <Ticker />
      <div className="grid min-h-[calc(100vh-36px)] lg:grid-cols-2">
        {/* Left Panel */}
        <div className="flex flex-col justify-between border-r border-border bg-card p-12 lg:p-14">
          <div>
            <div className="mb-10 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-xs text-success">
              <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-success" />
              Free 1-day demo
            </div>
            <h2 className="mb-3.5 text-3xl font-extrabold leading-tight tracking-tight">
              Start trading smarter today
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Get instant access. No credit card required.
            </p>
          </div>
          <p className="border-t border-border pt-7 text-sm italic text-muted-foreground/60">
            &quot;Discipline and data beat emotion every time.&quot;
          </p>
        </div>

        {/* Right Panel */}
        <div className="flex items-center justify-center p-12 lg:p-14">
          <div className="w-full max-w-sm">
            <h1 className="mb-1.5 text-2xl font-extrabold tracking-tight">
              Create your account
            </h1>
            <p className="mb-8 text-sm text-muted-foreground/60">
              Start in under 60 seconds
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3.5">
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-accent px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/30 focus:outline-none"
                />
              </div>
              <div className="mb-3.5">
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-accent px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/30 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="mt-1 w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Create account
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-muted-foreground/60">
              Have an account?{" "}
              <Link href="/login" className="cursor-pointer text-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
