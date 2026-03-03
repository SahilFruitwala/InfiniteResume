import React from "react";
import { Navbar } from "@/app/components/landing/Navbar";
import { BackgroundGrid } from "@/app/components/landing/BackgroundGrid";
import { Hero } from "@/app/components/landing/Hero";
import { Demo } from "@/app/components/landing/Demo";
import { Features } from "@/app/components/landing/Features";
import { WhyInfiniteResume } from "@/app/components/landing/WhyInfiniteResume";
import { HowItWorks } from "@/app/components/landing/HowItWorks";
import { Pricing } from "@/app/components/landing/Pricing";
import { CTA } from "@/app/components/landing/CTA";
import { Footer } from "@/app/components/landing/Footer";

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
