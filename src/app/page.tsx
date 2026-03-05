import dynamic from "next/dynamic";
import { Navbar } from "@/components/landing/Navbar";
import { BackgroundGrid } from "@/components/landing/BackgroundGrid";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { Footer } from "@/components/landing/Footer";

const Demo = dynamic(() =>
  import("@/components/landing/Demo").then((module) => ({
    default: module.Demo,
  })),
);
const WhyInfiniteResume = dynamic(() =>
  import("@/components/landing/WhyInfiniteResume").then((module) => ({
    default: module.WhyInfiniteResume,
  })),
);
const HowItWorks = dynamic(() =>
  import("@/components/landing/HowItWorks").then((module) => ({
    default: module.HowItWorks,
  })),
);
const CTA = dynamic(() =>
  import("@/components/landing/CTA").then((module) => ({
    default: module.CTA,
  })),
);

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent text-black dark:text-foreground selection:bg-accent selection:text-black">
      <BackgroundGrid />
      <Navbar />
      <Hero />
      <Demo />
      <Features />
      <WhyInfiniteResume />
      <HowItWorks />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
