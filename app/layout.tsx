import type { Metadata, Viewport } from "next";
import { Instrument_Serif, DM_Sans } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Menu } from "@/components/Menu";
import { CartDrawer } from "@/components/CartDrawer";
import { Motion, motionBootScript } from "@/motion/Motion";
import { ExperienceMount } from "@/webgl/ExperienceMount";
import { isShopifyConfigured } from "@/commerce/client";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument-serif", display: "swap" });
const sans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Vireli — Night Gummies · Dein Abend. Dein Ritual. Deine Ruhe.",
  description: "Vireli Night Gummies – Mixed Berry. Deine Abendroutine mit ausgewählten Inhaltsstoffen – melatoninfrei, vegan und ohne Zuckerzusatz.",
};

export const viewport: Viewport = {
  themeColor: "#05060f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const connected = isShopifyConfigured();
  return (
    <html lang="de-CH" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
      </head>
      <body>
        <a href="#produkt" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ivory focus:px-5 focus:py-3 focus:text-midnight">
          Direkt zum Produkt
        </a>
        <Header />
        <Menu />
        <CartDrawer connected={connected} />
        <ExperienceMount />
        <main id="top" className="relative z-[1]">{children}</main>
        <Footer />
        <div className="grain" aria-hidden="true" />
        <Motion />
      </body>
    </html>
  );
}
