import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppContextProvider } from '@/context/AppContext';
import { NavSidebar } from '@/components/NavSidebar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Marian Excellence Grid — Marian College Kuttikkanam',
  description: 'Marian Excellence Grid Evaluation System - Marian College Kuttikkanam. Track, verify and celebrate class achievements.',
  icons: {
    icon: '/Assets/Images/hands_logo.png',
    shortcut: '/Assets/Images/hands_logo.png',
    apple: '/Assets/Images/hands_logo.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/Assets/Images/hands_logo.png" />
        <link rel="shortcut icon" href="/Assets/Images/hands_logo.png" />
        <link rel="apple-touch-icon" href="/Assets/Images/hands_logo.png" />
      </head>
      <body>
        <AppContextProvider>
          <NavSidebar />
          {children}
          <Footer />
        </AppContextProvider>
      </body>
    </html>
  );
}

