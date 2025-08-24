# Highlight - 경매 플랫폼

나팔(Nafal) 경매 플랫폼의 프론트엔드 애플리케이션입니다.

## 주요 기능

- **경매 시스템**: 실시간 경매 참여 및 입찰
- **사용자 관리**: 회원가입, 로그인, 마이페이지
- **관리자 페이지**: 백오피스를 통한 상품 및 경매 관리
- **알림 시스템**: 실시간 경매 상태 알림
- **랭킹 시스템**: 사용자 및 트리키퍼 랭킹

## 기술 스택

- **Framework**: Next.js 15.3.5 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Real-time**: STOMP WebSocket
- **Forms**: React Hook Form + Zod
- **Package Manager**: pnpm

## 개발 환경 설정

### 요구사항
- Node.js 18+
- pnpm

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start
```

개발 서버는 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

## 프로젝트 구조

```
src/
├── app/                # Next.js App Router 페이지
│   ├── (main)/        # 메인 사용자 페이지
│   └── (backoffice)/  # 관리자 페이지
├── components/        # 재사용 가능한 컴포넌트
├── hooks/            # 커스텀 훅
├── api/              # API 호출 함수
├── types/            # TypeScript 타입 정의
└── lib/              # 유틸리티 함수
```

## 주요 페이지

- `/` - 메인 페이지 (상품 목록, 랭킹)
- `/auction/[id]` - 경매 상세 페이지
- `/mypage` - 마이페이지
- `/backoffice` - 관리자 대시보드

## 배포

### 운영 환경 URL

**사용자 접속**
- http://ec2-52-78-128-131.ap-northeast-2.compute.amazonaws.com:3000/

**관리자 접속**
- http://ec2-52-78-128-131.ap-northeast-2.compute.amazonaws.com:3000/backoffice/login

Docker를 사용한 컨테이너 배포를 지원합니다. 자세한 배포 방법은 `DEPLOYMENT.md`를 참고하세요.