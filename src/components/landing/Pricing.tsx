"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import posthog from "posthog-js";

const plans = [
  {
    name: "Early Access",
    price: "$0",
    period: "forever",
    description: "100% free while we're in early access beta.",
    features: [
      "Bring Your Own OpenAI Key",
      "Unlimited Resume Scans",
      "Client-Side 100% Privacy",
      "Saved Analysis History",
      "Line-by-line Recommendations",
    ],
    cta: "Start Building Now",
    highlight: true,
  },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="py-32 bg-white/40 dark:bg-black/40 backdrop-blur-md text-black dark:text-foreground border-t border-black/10 dark:border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter mb-6">
            Invest in your <br />
            <span className="text-accent">Career.</span>
          </h2>
          <p className="text-xl text-black/60 dark:text-white/60 font-light max-w-2xl mx-auto mb-20">
            Stop sending your resume into the void. Get the tools you need to
            beat the bots and land the interview. Currently 100% free.
          </p>
        </div>

        <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-10 border ${plan.highlight ? "border-accent bg-accent/5" : "border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5"} flex flex-col h-full`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-black px-4 py-1 text-xs font-bold uppercase tracking-widest">
                  Most Popular
                </div>
              )}

              <h3 className="font-display text-3xl font-bold uppercase mb-2">
                {plan.name}
              </h3>
              <p className="text-black/60 dark:text-white/60 font-light mb-8">
                {plan.description}
              </p>

              <div className="mb-8">
                <span className="font-display text-6xl font-black">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-black/40 dark:text-white/40 font-mono text-lg">
                    {plan.period}
                  </span>
                )}
              </div>

              <ul className="space-y-4 mb-10 text-left flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check
                      className={`w-5 h-5 ${plan.highlight ? "text-accent" : "text-black/40 dark:text-white/40"}`}
                    />
                    <span className="font-medium text-black/80 dark:text-white/80">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/builder"
                prefetch={false}
                onClick={() =>
                  posthog.capture("pricing_cta_clicked", {
                    plan: plan.name,
                    price: plan.price,
                    cta_text: plan.cta,
                    is_highlighted: plan.highlight,
                  })
                }
                className={`block w-full py-4 font-bold uppercase tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 ${plan.highlight ? "bg-accent text-black hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black" : "bg-black/10 dark:bg-white/10 text-black dark:text-white hover:bg-black/20 dark:hover:bg-white/20"}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
