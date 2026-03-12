import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { Features } from "@/components/sections/Features";
import { Industries } from "@/components/sections/Industries";
import { Roles } from "@/components/sections/Roles";
import { Pricing } from "@/components/sections/Pricing";
import { CTA } from "@/components/sections/CTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <LogoMarquee />
        <Features />
        <Industries />
        <Roles />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
