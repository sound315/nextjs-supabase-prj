# Next.js 규칙

## 버전 및 라우팅
- Next.js 15 App Router 사용
- `app/` 디렉토리 기반 파일 시스템 라우팅
- Page는 기본적으로 Server Component

## 컴포넌트 규칙
- 클라이언트 상태/이벤트 필요 시에만 `'use client'` 선언
- 데이터 페칭은 Server Component에서 수행
- 공통 UI는 `components/ui/` (shadcn), 도메인 컴포넌트는 `components/` 하위 도메인 폴더

## API Route
- `app/api/` 하위에 Route Handler 작성
- 레이어드 아키텍처: Route Handler → Service → Repository
- 응답 형식 일관성 유지

```ts
// 성공
{ success: true, data: T }
// 실패
{ success: false, error: string }
```

## 폴더 구조
```
app/
  (auth)/          # 인증 관련 페이지
  (dashboard)/     # 로그인 후 메인 화면
  api/             # Route Handlers
components/
  ui/              # shadcn 컴포넌트
  patients/        # 환자 관련 컴포넌트
  drugs/           # 약물 관련 컴포넌트
  alerts/          # 경고 팝업 컴포넌트
lib/
  services/        # 비즈니스 로직
  repositories/    # DB 접근
  types/           # TypeScript 타입/DTO
  utils/           # 공통 유틸
```

## 환경변수
- `.env.local` 사용, `.env.example`에 키 목록 유지
- 서버 전용 변수는 `NEXT_PUBLIC_` 접두사 없이 사용
