import '../../../globals.css';
import { ReactNode } from 'react';
import DashboardHeader from '@/components/backoffice/DashboardHeader';
import DashboardSidebar from '@/components/backoffice/DashboardSidebar';
import { QueryProvider } from '@/providers/QueryProvider';

export const metadata = {
  title: 'Nafal Backoffice',
  description: 'Nafal Auction Platform Backoffice',
};

export default function BackofficeLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
            <div className="flex h-screen">
              <DashboardSidebar />
              <div className="flex-1 flex flex-col">
                <DashboardHeader />
                <main className="p-4">
                  {children}
                </main>
              </div>
            </div>
        </QueryProvider>
      </body>
    </html>
  );
}