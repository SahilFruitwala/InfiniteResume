import type { Metadata } from "next";
import {
  Inter,
  Roboto,
  Merriweather,
  Playfair_Display,
  Lora,
  Open_Sans,
  Montserrat,
  Poppins,
  Raleway,
  Lato,
} from "next/font/google";
import "./globals.css"; // Global styles

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});
const merriweather = Merriweather({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-merriweather",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});
const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" });
const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: {
    default: "InfiniteResume | Build Your Professional Resume",
    template: "%s | InfiniteResume",
  },
  description:
    "Create a stunning, professional resume in minutes with InfiniteResume. Choose from modern, minimal, and professional templates to land your dream job.",
  applicationName: "InfiniteResume",
  keywords: [
    "resume builder",
    "CV maker",
    "professional resume",
    "career",
    "job search",
    "resume templates",
  ],
  authors: [{ name: "InfiniteResume Team" }],
  creator: "InfiniteResume",
  publisher: "InfiniteResume",
  openGraph: {
    title: "InfiniteResume | Build Your Professional Resume",
    description:
      "Create a stunning, professional resume in minutes with InfiniteResume. Choose from modern, minimal, and professional templates to land your dream job.",
    url: "https://infiniteresume.com",
    siteName: "InfiniteResume",
    images: [
      {
        url: "/og-image.png", // Assuming you have or will add an open graph image
        width: 1200,
        height: 630,
        alt: "InfiniteResume Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InfiniteResume | Build Your Professional Resume",
    description:
      "Create a stunning, professional resume in minutes with InfiniteResume. Choose from modern, minimal, and professional templates to land your dream job.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${roboto.variable} ${merriweather.variable} ${playfair.variable} ${lora.variable} ${openSans.variable} ${montserrat.variable} ${poppins.variable} ${raleway.variable} ${lato.variable}`}
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
