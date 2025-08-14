import { FeaturesSection } from "./_components/landing/features-section";
import { Footer } from "./_components/landing/footer";
import { Header } from "./_components/landing/header";
import { HeroSection } from "./_components/landing/hero-section";
import { unstable_ViewTransition as ViewTransition } from "react";

export default function Home() {
  return (
    <ViewTransition>
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
        <Header />
        <main>
          <HeroSection />
          <FeaturesSection />
        </main>
        <Footer />
      </div>
    </ViewTransition>
  );
}
