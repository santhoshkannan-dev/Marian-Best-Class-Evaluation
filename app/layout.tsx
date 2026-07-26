import type { Metadata } from 'next';
import './globals.css';
import { AppContextProvider } from '@/context/AppContext';
import { NavSidebar } from '@/components/NavSidebar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Marian Best Class — Marian College Kuttikkanam',
  description: 'Best Class Evaluation System - Marian College Kuttikkanam. Track, verify and celebrate class achievements.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
