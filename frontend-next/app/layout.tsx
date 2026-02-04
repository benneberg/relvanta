import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800'],
});

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
    <html lang="en" className={`dark ${inter.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-display antialiased selection:bg-primary/30">
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-charcoal-dark">
          <Header />
          <main className="flex-1 mobile-pb">{children}</main>
          <Footer />
          <MobileNav />
        </div>
      </body>
    </html>
  );
}
