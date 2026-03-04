"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV !== "development") return;

    // Lightweight dev-only visibility into route-level vitals.
    console.log("[web-vitals]", metric.name, metric.value, metric.rating);
  });

  return null;
}
