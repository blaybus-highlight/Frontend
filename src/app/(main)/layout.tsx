import '../globals.css';
import { ReactNode } from 'react';
import { AuthHeader } from '@/components/layout/AuthHeader';
import { Footer } from '@/components/layout/Footer';
import { QueryProvider } from '@/providers/QueryProvider';
import NotificationManager from '@/components/notifications/NotificationManager';
import { TokenRefreshProvider } from '@/components/providers/TokenRefreshProvider';

export const metadata = {
  title: 'Nafal',
  description: 'Nafal Auction Platform',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='ko'>
      <body>
        <QueryProvider>
          <TokenRefreshProvider>
            {/* 클라이언트 사이드에서 토큰 상태를 확인하여 적절한 헤더 렌더링 */}
            <AuthHeader />
            <div className='pt-40 sm:pt-32'>{children}</div>
            <Footer />
            {/* 알림 매니저 - 로그인된 사용자에게만 표시 */}
            <NotificationManager />
          </TokenRefreshProvider>
        </QueryProvider>
      </body>
    </html>
  );
}