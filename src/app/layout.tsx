import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'TripHive | Vacation Rentals, Luxury Hotels & Experiences',
  description: 'Book unique luxury suites, boutique hotels, and private retreats around the globe with instant confirmation.',
};

export default function RootLayout({
  children,
}: Readonly< {
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased text-gray-900 bg-gray-50">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}