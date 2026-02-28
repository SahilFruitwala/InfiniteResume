import type {Metadata} from 'next';
import { Inter, Roboto, Merriweather, Playfair_Display, Lora, Open_Sans, Montserrat, Poppins, Raleway, Lato } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const roboto = Roboto({ weight: ['300', '400', '500', '700'], subsets: ['latin'], variable: '--font-roboto' });
const merriweather = Merriweather({ weight: ['300', '400', '700'], subsets: ['latin'], variable: '--font-merriweather' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const lora = Lora({ subsets: ['latin'], variable: '--font-lora' });
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-open-sans' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });
const poppins = Poppins({ weight: ['300', '400', '500', '600', '700'], subsets: ['latin'], variable: '--font-poppins' });
const raleway = Raleway({ subsets: ['latin'], variable: '--font-raleway' });
const lato = Lato({ weight: ['300', '400', '700'], subsets: ['latin'], variable: '--font-lato' });

export const metadata: Metadata = {
  title: 'My Google AI Studio App',
  description: 'My Google AI Studio App',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable} ${merriweather.variable} ${playfair.variable} ${lora.variable} ${openSans.variable} ${montserrat.variable} ${poppins.variable} ${raleway.variable} ${lato.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
