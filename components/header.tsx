"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";

interface HeaderProps {
  showBackButton?: boolean;
}

export function Header({ showBackButton }: HeaderProps) {
  return (
    <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-background/95 px-10 backdrop-blur-md">
      <Link href="/" className="flex cursor-pointer items-center gap-2.5">
        <div className="flex items-center justify-center rounded-lg bg-primary p-1.5">
          <TrendingUp className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold text-foreground">TrendIQ</span>
      </Link>

      {showBackButton ? (
        <Link
          href="/"
          className="rounded-lg border border-border/50 bg-transparent px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          &larr; Back
        </Link>
      ) : (
        <>
          <div className="hidden items-center gap-1 md:flex">
            <Link
              href="#features"
              className="rounded-lg px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="rounded-lg px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="rounded-lg px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Contact
            </Link>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="rounded-lg border border-border/50 bg-transparent px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get Started
            </Link>
          </div>
        </>
      )}
    </nav>
  );
}
