import { ReactNode } from 'react';
import '../globals.css';
import { BackofficeAuthWrapper } from '@/components/backoffice/BackofficeAuthWrapper';
import { TokenRefreshProvider } from '@/components/providers/TokenRefreshProvider';
import { QueryProvider } from '@/providers/QueryProvider';

export default function BackofficeLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <TokenRefreshProvider>
          <QueryProvider>
            <BackofficeAuthWrapper>
              {children}
            </BackofficeAuthWrapper>
          </QueryProvider>
        </TokenRefreshProvider>
      </body>
    </html>
  );
}
