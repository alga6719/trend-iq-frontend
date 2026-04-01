"use client";

import { useState } from "react";
import { Ticker } from "@/components/ticker";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen">
      <Ticker />
      <Header showBackButton />
      <div className="mx-auto max-w-lg px-10 py-20">
        <h1 className="mb-2 text-4xl font-extrabold tracking-tight">Contact Us</h1>
        <p className="mb-8 text-muted-foreground">
          Have questions? We&apos;d love to hear from you.
        </p>

        {submitted ? (
          <div className="rounded-xl border border-success/30 bg-success/10 p-6 text-center">
            <h2 className="mb-2 text-lg font-bold text-success">Message Sent!</h2>
            <p className="text-sm text-muted-foreground">
              Thank you for reaching out. We&apos;ll get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Name
              </label>
              <input
                type="text"
                required
                className="w-full rounded-lg border border-border bg-accent px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/30 focus:outline-none"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full rounded-lg border border-border bg-accent px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/30 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Subject
              </label>
              <select className="w-full rounded-lg border border-border bg-accent px-3.5 py-2.5 text-sm text-foreground focus:border-primary/30 focus:outline-none">
                <option>General Inquiry</option>
                <option>Technical Support</option>
                <option>Enterprise Sales</option>
                <option>Partnership</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Message
              </label>
              <textarea
                required
                rows={5}
                className="w-full rounded-lg border border-border bg-accent px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/30 focus:outline-none"
                placeholder="How can we help?"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
      <Footer />
    </main>
  );
}
