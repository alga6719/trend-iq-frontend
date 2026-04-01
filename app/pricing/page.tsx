import { Ticker } from "@/components/ticker";
import { Header } from "@/components/header";
import { Pricing } from "@/components/pricing";
import { Footer } from "@/components/footer";

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <Ticker />
      <Header showBackButton />
      <div className="py-14">
        <h1 className="mb-2 text-center text-4xl font-extrabold tracking-tight">
          Start free. Scale as you grow.
        </h1>
        <p className="mb-12 text-center text-muted-foreground">
          No hidden fees. No lock-in.
        </p>
        <Pricing />
      </div>
      <Footer />
    </main>
  );
}
