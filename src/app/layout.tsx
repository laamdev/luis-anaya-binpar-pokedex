import "@/app/globals.css";

import { ReactNode } from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";

import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import Providers from "@/components/providers";

import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";

const fraktionMono = localFont({
  src: [
    {
      path: "../../public/fonts/fraktion/mono/thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/fraktion/mono/thin-italic.woff2",
      weight: "100",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-fraktionMono",
});

const fraktionSans = localFont({
  src: [
    {
      path: "../../public/fonts/fraktion/sans/regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/fraktion/sans/medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/fraktion/sans/medium-italic.woff2",
      weight: "500",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-fraktionSans",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.URL),
  title: {
    default: SITE.TITLE,
    template: `%s | ${SITE.TITLE}`,
  },
  description: SITE.DESCRIPTION,
  openGraph: {
    title: SITE.TITLE,
    description: SITE.DESCRIPTION,
    url: SITE.URL,
    siteName: SITE.TITLE,
    images: [
      {
        url: `${SITE.URL}/images/og.png`,
        width: 1200,
        height: 630,
      },
    ],
    locale: "es-ES",
    type: "website",
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
  twitter: {
    title: SITE.TITLE,
    site: SITE.TITLE,
    card: "summary_large_image",
    description: SITE.DESCRIPTION,
    images: [
      {
        url: `${SITE.URL}/images/og.png`,
        alt: `${SITE.TITLE} logo`,
        width: 1200,
        height: 630,
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/images/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="px-4 xl:px-0">
      <body
        className={cn(
          fraktionMono.variable,
          fraktionSans.variable,
          "dark font-sans antialiased"
        )}
      >
        <Providers>
          <Navbar />
          <main className="max-w-5xl mx-auto">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
