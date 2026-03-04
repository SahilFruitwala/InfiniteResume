import dynamic from "next/dynamic";
import { Navbar } from "@/app/components/landing/Navbar";
import { BackgroundGrid } from "@/app/components/landing/BackgroundGrid";
import { Hero } from "@/app/components/landing/Hero";
import { Features } from "@/app/components/landing/Features";
import { Pricing } from "@/app/components/landing/Pricing";
import { Footer } from "@/app/components/landing/Footer";

const Demo = dynamic(() =>
  import("@/app/components/landing/Demo").then((module) => ({
    default: module.Demo,
  })),
);
const WhyInfiniteResume = dynamic(() =>
  import("@/app/components/landing/WhyInfiniteResume").then((module) => ({
    default: module.WhyInfiniteResume,
  })),
);
const HowItWorks = dynamic(() =>
  import("@/app/components/landing/HowItWorks").then((module) => ({
    default: module.HowItWorks,
  })),
);
const CTA = dynamic(() =>
  import("@/app/components/landing/CTA").then((module) => ({
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
