import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteConfig.url ? new URL(siteConfig.url) : undefined,
  title: {
    default: `${siteConfig.name} Layer1 — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name} Layer1`,
  },
  description: siteConfig.description,
  keywords: [
    "Nova",
    "Layer1",
    "blockchain",
    "decentralized storage",
    "decentralized compute",
    "gaming",
    "node network",
    "web3",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url || undefined,
    siteName: `${siteConfig.name} Layer1`,
    title: `${siteConfig.name} Layer1 — ${siteConfig.tagline}`,
    description: siteConfig.description,
    // 域名未设置时省略图片，避免无效相对 URL 与构建警告
    ...(siteConfig.url
      ? {
          images: [
            { url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name },
          ],
        }
      : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} Layer1`,
    description: siteConfig.description,
    ...(siteConfig.url ? { images: [siteConfig.ogImage] } : {}),
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#04060B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="relative min-h-screen bg-ink-950">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-nova-cyan focus:px-4 focus:py-2 focus:text-ink-950"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
