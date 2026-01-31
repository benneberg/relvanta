import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Relvanta - AI Solutions for Medium-Sized Businesses',
    template: '%s | Relvanta',
  },
  description:
    'Discover and integrate AI-powered products and services designed for medium-sized businesses. From visual analytics to predictive insights.',
  keywords: [
    'AI solutions',
    'artificial intelligence',
    'business AI',
    'machine learning',
    'AI consulting',
  ],
  authors: [{ name: 'Relvanta' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://relvanta.com',
    siteName: 'Relvanta',
    title: 'Relvanta - AI Solutions for Medium-Sized Businesses',
    description:
      'Discover and integrate AI-powered products and services designed for medium-sized businesses.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
