# CLAUDE.md — 병원 투약 안전 관리 시스템

## 프로젝트 개요

환자에게 처방된 약물 간 위험한 상호작용을 사전에 감지하여, 간호사 및 담당자가 투약 전에 인지하고 중단할 수 있도록 지원하는 병원 투약 전산 관리 시스템.

- 상세 요구사항: `docs/PRD.md`
- 개발 로드맵: `docs/ROADMAP.md`

## 핵심 도메인 개념

- **제품(product)**: 사용자가 선택하는 단위 (품목명 + 품목코드). 예: "타이레놀 500mg 정"
- **성분(ingredient)**: 금기 검사 기준 단위. 제품은 1개 이상의 성분을 가짐
- **금기 검사 흐름**: 제품 선택 → 성분 추출 → 성분 쌍(pair) 조합 → 금기 DB 대조 → 경고
- **3가지 금기 유형**: ① 환자 특이 금기, ② 성분 간 상호작용, ③ 급여/보험 제한

## 폴더 구조

```
app/
  (auth)/               # 로그인/로그아웃
  (dashboard)/          # 메인 화면 (환자, 처방, 약물)
  api/                  # Route Handlers
components/
  ui/                   # shadcn/ui 컴포넌트
  patients/
  drugs/
  alerts/               # 경고 팝업
lib/
  services/             # 비즈니스 로직
  repositories/         # DB 접근 (Supabase)
  types/                # TypeScript 타입 및 DTO
  utils/
  supabase/
    server.ts           # 서버용 클라이언트
    client.ts           # 브라우저용 클라이언트
supabase/
  migrations/           # DB 마이그레이션 SQL
docs/                   # 프로젝트 문서
.claude/
  commands/             # 커스텀 커맨드
  agents/               # 서브에이전트
  hooks/                # 훅
```

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| UI | shadcn/ui |
| Backend | Next.js Route Handlers |
| DB | Supabase (PostgreSQL) |
| 인증 | Supabase Auth |
| 배포 | Vercel |

## 주요 규칙 요약

- 아키텍처: Route Handler → Service → Repository
- 모든 테이블: `service_uid`, `job_uid` 컬럼 필수
- API 응답: `{ success: true, data }` / `{ success: false, error }`
- 에러 핸들링 및 DB 트랜잭션 처리 필수
- 주석: 한국어, 비즈니스 로직의 WHY가 비명확한 경우에만

## 컨텍스트 파일

@docs/next-js.md
@docs/supabase.md
@docs/coding-style.md
