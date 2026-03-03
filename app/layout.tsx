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
import { ThemeProvider } from "./components/ThemeProvider";
import StructuredData from "./components/StructuredData";
import { ConvexClientProvider } from "./components/ConvexClientProvider";

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
    process.env.NEXT_PUBLIC_APP_URL || "https://infiniteresume.com",
  ),
  title: {
    default: "InfiniteResume | Build Your Professional Resume",
    template: "%s | InfiniteResume",
  },
  description:
    "Create a stunning, professional resume in minutes with InfiniteResume. Choose from modern, minimal, and professional templates to land your dream job. No technical skills required.",
  applicationName: "InfiniteResume",
  keywords: [
    "resume builder",
    "CV maker",
    "professional resume",
    "career",
    "job search",
    "resume templates",
    "free resume builder",
    "online CV creator",
    "ATS friendly resume",
  ],
  authors: [{ name: "InfiniteResume Team" }],
  creator: "InfiniteResume",
  publisher: "InfiniteResume",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "InfiniteResume | Build Your Professional Resume",
    description:
      "Create a stunning, professional resume in minutes with InfiniteResume. Choose from modern, minimal, and professional templates to land your dream job.",
    url: "https://infiniteresume.com",
    siteName: "InfiniteResume",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "InfiniteResume - Professional Resume Builder",
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
    creator: "@infiniteresume",
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
      suppressHydrationWarning
      className={`${inter.variable} ${roboto.variable} ${merriweather.variable} ${playfair.variable} ${lora.variable} ${openSans.variable} ${montserrat.variable} ${poppins.variable} ${raleway.variable} ${lato.variable}`}
    >
      <head>
        <StructuredData />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
