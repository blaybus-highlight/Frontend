import '../globals.css';
import { ReactNode } from 'react';
import { cookies } from 'next/headers'; // 1. next/headers에서 cookies를 가져옵니다.
import { LoginHeader } from '@/components/layout/LoginHeader'; // 로그인 시 보여줄 헤더
import { LogoutHeader } from '@/components/layout/LogoutHeader'; // 로그아웃 시 보여줄 헤더
import { Footer } from '@/components/layout/Footer'; // 로그아웃 시 보여줄 헤더
import { QueryProvider } from '@/providers/QueryProvider';
import NotificationManager from '@/components/notifications/NotificationManager';

export const metadata = {
  title: 'Nafal',
  description: 'Nafal Auction Platform',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  // 2. 서버에서 쿠키를 읽어 토큰 존재 여부를 확인합니다.
  const cookieStore = await cookies();
  const hasToken = cookieStore.has('accessToken');

  return (
    <html lang='ko'>
      <body>
        <QueryProvider>
          {/* 3. hasToken 값에 따라 다른 헤더를 렌더링합니다. */}
          {hasToken ? <LoginHeader /> : <LogoutHeader />}
          <div className='pt-32'>{children}</div>
          <Footer />
          {/* 알림 매니저 - 로그인된 사용자에게만 표시 */}
          {hasToken && <NotificationManager />}
        </QueryProvider>
      </body>
    </html>
  );
}