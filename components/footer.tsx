import Link from "next/link";

export function Footer() {
  return (
    <footer className="flex items-center justify-between border-t border-border px-10 py-6 text-xs text-muted-foreground/60">
      <span>TrendIQ &copy; 2026</span>
      <div className="flex gap-5">
        <Link href="#features" className="transition-colors hover:text-muted-foreground">
          Features
        </Link>
        <Link href="/pricing" className="transition-colors hover:text-muted-foreground">
          Pricing
        </Link>
        <Link href="/about" className="transition-colors hover:text-muted-foreground">
          About
        </Link>
        <Link href="/contact" className="transition-colors hover:text-muted-foreground">
          Contact
        </Link>
      </div>
    </footer>
  );
}
