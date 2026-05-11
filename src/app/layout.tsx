import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";

const inter = Inter({ subsets: ["cyrillic", "latin"] });

export const metadata: Metadata = {
  title: "ООО «Спорт Тех» — Яндекс Карты",
  description: "ООО «Спорт Тех», 620043, Свердловская область, г Екатеринбург, ул Начдива Васильева, д. 34, кв. 417 — отзывы, фото, время работы, телефон и адрес на карте",
  icons: {
    icon: "/sport-tech-logo.jpg",
    shortcut: "/sport-tech-logo.jpg",
    apple: "/sport-tech-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />
      </head>
      <body suppressHydrationWarning className={`${inter.className} antialiased`}>
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
