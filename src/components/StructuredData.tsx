import React from "react";

export default function StructuredData() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://infiniteresume.com";

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "InfiniteResume",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      "https://twitter.com/infiniteresume",
      "https://github.com/infiniteresume",
    ],
  };

  const softwareApplicationData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "InfiniteResume",
    operatingSystem: "Any",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Create a stunning, professional resume in minutes with InfiniteResume. Choose from modern, minimal, and professional templates to land your dream job.",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1240",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([organizationData, softwareApplicationData]),
      }}
    />
  );
}
