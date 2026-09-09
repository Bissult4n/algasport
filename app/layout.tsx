import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ALLOW_INDEXING, SITE_URL } from "@/lib/shop-config";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : SITE_URL),
  ),
  robots: { index: ALLOW_INDEXING, follow: ALLOW_INDEXING },
  title: "ALGA Sport Shop | Кимоно, FitLine и снаряжение",
  description:
    "Мобильный каталог ALGA Sport Shop: Zone, Adidas, FitLine, снаряжение и именные нашивки. Выбирайте товары и согласуйте заказ в переписке.",
  openGraph: {
    title: "ALGA Sport Shop",
    description: "Кимоно. FitLine. Снаряжение. Ваш путь начинается здесь.",
    images: [
      {
        url:
          (process.env.NEXT_PUBLIC_BASE_PATH || "") + "/images/alga-logo.webp",
        width: 1000,
        height: 1000,
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#101112",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
