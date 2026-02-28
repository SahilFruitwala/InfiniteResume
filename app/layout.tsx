import type {Metadata} from 'next';
import { Inter, Roboto, Merriweather, Playfair_Display, Lora, Open_Sans } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const roboto = Roboto({ weight: ['300', '400', '500', '700'], subsets: ['latin'], variable: '--font-roboto' });
const merriweather = Merriweather({ weight: ['300', '400', '700'], subsets: ['latin'], variable: '--font-merriweather' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const lora = Lora({ subsets: ['latin'], variable: '--font-lora' });
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-open-sans' });

export const metadata: Metadata = {
  title: 'My Google AI Studio App',
  description: 'My Google AI Studio App',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable} ${merriweather.variable} ${playfair.variable} ${lora.variable} ${openSans.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
