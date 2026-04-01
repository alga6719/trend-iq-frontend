import { Ticker } from "@/components/ticker";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Ticker />
      <Header showBackButton />
      <div className="mx-auto max-w-3xl px-10 py-20">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight">About TrendIQ</h1>
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            TrendIQ is an AI-powered crypto trading platform designed to give traders 
            a competitive edge in the fast-moving digital asset markets. Our platform 
            combines machine learning, on-chain analytics, and real-time market data 
            to deliver actionable trading signals.
          </p>
          <p>
            Founded in 2024, TrendIQ was built by a team of quantitative traders, 
            machine learning engineers, and blockchain enthusiasts who recognized the 
            need for smarter trading tools in the cryptocurrency space.
          </p>
          <h2 className="text-2xl font-bold text-foreground pt-4">Our Mission</h2>
          <p>
            To democratize algorithmic trading by providing retail traders access to 
            the same sophisticated tools and signals used by institutional investors. 
            We believe that data-driven decisions lead to better outcomes.
          </p>
          <h2 className="text-2xl font-bold text-foreground pt-4">The Technology</h2>
          <p>
            Our ML models are trained on years of historical market data, analyzing 
            patterns in price action, volume, social sentiment, and whale activity. 
            The platform processes millions of data points every minute to generate 
            high-confidence trading signals.
          </p>
          <p>
            With sub-100ms execution through direct exchange APIs, TrendIQ ensures 
            you never miss an opportunity. Our risk management engine automatically 
            protects your capital with customizable stop-loss, take-profit, and 
            position sizing parameters.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
