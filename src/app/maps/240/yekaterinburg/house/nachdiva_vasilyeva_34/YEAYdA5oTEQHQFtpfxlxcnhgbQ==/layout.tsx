import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ООО «Спорт Тех» — Яндекс Карты',
  description: 'ООО «Спорт Тех», 620043, Свердловская область, г Екатеринбург, ул Начдива Васильева, д. 34, кв. 417 — отзывы, фото, время работы, телефон и адрес на карте',
  icons: {
    icon: [
      { url: '/yandex-icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
    shortcut: '/yandex-icon.svg',
    apple: '/apple-touch-icon.png',
  },
};

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
