// src/app/layout.tsx

import './globals.css';

import { ReactNode } from 'react';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { QueryProvider } from '@/providers/QueryProvider';

export const metadata = {
  title: 'Nafal',
  description: 'Nafal Auction Platform',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='ko'>
      <body>
        <QueryProvider>
          <Header />
          <div className='pt-32'>{children}</div>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
