import "@fontsource-variable/manrope";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SITE_URL } from "./site-config";
import { YandexMetrika } from "./YandexMetrika";

const title = "Студия звукозаписи Sound Wave в Москве — от 490 ₽";
const description =
  "Запись вокала, рэпа и треков в центре Москвы. Союз 017 TUBE, звукорежиссёр, аренда от 890 ₽/час. 7 минут от метро Маяковская.";

export const metadata: Metadata = {
  metadataBase: SITE_URL ? new URL(SITE_URL) : undefined,
  title,
  description,
  applicationName: "Sound Wave",
  keywords: [
    "студия звукозаписи Москва",
    "запись вокала",
    "записать песню",
    "запись рэпа",
    "Союз 017 TUBE",
    "студия Маяковская",
  ],
  alternates: SITE_URL ? { canonical: SITE_URL } : undefined,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    title,
    description,
    siteName: "Sound Wave",
    url: SITE_URL || undefined,
    images: SITE_URL
      ? [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: "Sound Wave — студия звукозаписи в Москве" }]
      : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: SITE_URL ? [`${SITE_URL}/og.png`] : undefined,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#030712",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        {children}
        <YandexMetrika />
      </body>
    </html>
  );
}
