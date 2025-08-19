import { ReactNode } from 'react';
import '../globals.css';
import { BackofficeAuthWrapper } from '@/components/backoffice/BackofficeAuthWrapper';

export default function BackofficeLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <BackofficeAuthWrapper>
          {children}
        </BackofficeAuthWrapper>
      </body>
    </html>
  );
}
