import { ReactNode } from 'react';
import '../globals.css';
import { BackofficeAuthWrapper } from '@/components/backoffice/BackofficeAuthWrapper';
import { TokenRefreshProvider } from '@/components/providers/TokenRefreshProvider';

export default function BackofficeLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <TokenRefreshProvider>
          <BackofficeAuthWrapper>
            {children}
          </BackofficeAuthWrapper>
        </TokenRefreshProvider>
      </body>
    </html>
  );
}
