import {
  Inter,
  Lora,
  Poppins,
} from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

// Keep global font payload lean. Remaining font options map to these fallbacks in globals.css.
export const rootFontVariables = [
  inter.variable,
  lora.variable,
  poppins.variable,
].join(" ");
