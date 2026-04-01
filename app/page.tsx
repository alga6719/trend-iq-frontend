import { Ticker } from "@/components/ticker";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { WhySection } from "@/components/why-section";
import { Pricing } from "@/components/pricing";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Ticker />
      <Header />
      <Hero />
      <Features />
      <WhySection />
      <Pricing />
      <CTASection />
      <Footer />
    </main>
  );
}
