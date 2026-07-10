import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/data/site";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import CustomCursor from "@/components/layout/CustomCursor";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/layout/CookieBanner";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Premium Webdesign Agentur aus der Schweiz`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Webdesign Schweiz",
    "Webentwicklung",
    "E-Commerce Agentur",
    "Next.js Agentur",
    "Premium Webdesign",
    "Branding Agentur Schweiz",
    "ShopWerk",
  ],
  authors: [{ name: siteConfig.legalName }],
  creator: siteConfig.legalName,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_CH",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Digitale Erlebnisse, die Kunden überzeugen.`,
    description: siteConfig.description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Premium Webdesign Agentur`,
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteConfig.legalName,
  alternateName: siteConfig.name,
  image: `${siteConfig.url}/opengraph-image`,
  url: siteConfig.url,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  priceRange: "$$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    postalCode: siteConfig.address.zip,
    addressLocality: siteConfig.address.city,
    addressCountry: siteConfig.address.countryCode,
  },
  areaServed: "CH",
  sameAs: Object.values(siteConfig.social),
  makesOffer: [
    "Webdesign",
    "Webentwicklung",
    "E-Commerce",
    "Branding",
    "SEO",
    "Performance-Optimierung",
    "Wartung",
    "Hosting",
  ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${fraunces.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[var(--color-bg)] text-[var(--color-fg)] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScrollProvider>
          <div className="noise-layer" aria-hidden />
          <CustomCursor />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieBanner />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
