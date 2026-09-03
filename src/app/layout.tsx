import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TripHive | Vacation Rentals, Luxury Hotels & Experiences',
  description: 'Book unique luxury suites, boutique hotels, and private retreats around the globe with instant confirmation.',
  icons: {
    icon: '/assests/logo.jpg',
    shortcut: '/assests/logo.jpg',
    apple: '/assests/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white text-[#222222] min-h-screen antialiased selection:bg-[#ff385c] selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
