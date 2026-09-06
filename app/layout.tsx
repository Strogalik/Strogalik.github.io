import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { Experience } from "@/components/ui/Experience";
export const metadata: Metadata = {
  metadataBase: new URL("https://strogalik.github.io"),
  title: {
    default: "РусГаз — газификация дома. От проекта до тепла.",
    template: "%s — РусГаз",
  },
  description:
    "Газификация жилых домов, проектирование и строительство инженерных сетей. Обсудите ваш объект со специалистами РусГаз.",
  alternates: { canonical: "/" },
  icons: { icon: "/assets/rusgaz-mark.png" },
  openGraph: {
    title: "РусГаз. От проекта до тепла.",
    description: "Газификация дома и инженерные сети.",
    locale: "ru_RU",
    type: "website",
  },
  robots: { index: false, follow: true },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f5f2",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <a className="skip-link" href="#main">
          Перейти к содержимому
        </a>
        <Experience>{children}</Experience>
      </body>
    </html>
  );
}
