import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NOVA – Moderner Onlineshop",
    template: "%s | NOVA",
  },
  description:
    "NOVA ist dein moderner Onlineshop für hochwertige Produkte – schnell, sicher und stilvoll.",
  openGraph: {
    type: "website",
    title: "NOVA – Moderner Onlineshop",
    description:
      "NOVA ist dein moderner Onlineshop für hochwertige Produkte – schnell, sicher und stilvoll.",
    siteName: "NOVA",
  },
  twitter: {
    card: "summary_large_image",
    title: "NOVA – Moderner Onlineshop",
    description:
      "NOVA ist dein moderner Onlineshop für hochwertige Produkte – schnell, sicher und stilvoll.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
