# 병원 투약 안전 관리 시스템

환자에게 처방된 약물 간 위험한 상호작용을 사전에 감지하여, 간호사 및 담당자가 투약 전에 인지하고 중단할 수 있도록 지원하는 병원 투약 전산 관리 시스템.

## 핵심 기능

- **투약 금지 조건 검사**: 제품 선택 시 성분 기반으로 3가지 조건 실시간 검사
  - 환자 특이 금기 (알레르기, 기저질환 등)
  - 성분 간 병용금기 (위험 상호작용)
  - 급여/보험 투약 제한
- **경고 팝업**: 문제 감지 시 즉시 표시, 담당자가 명시적으로 확인해야 닫힘
- **투약 이력 관리**: 경고 발생 및 처리 결과 전체 로그 저장
- **역할별 권한**: 간호사 / 의사 / 약사 / 관리자

## 도메인 핵심 개념

- **제품(product)**: 사용자가 선택하는 단위 (품목명 + 품목코드)
- **성분(ingredient)**: 금기 검사 기준 단위, 제품은 1개 이상의 성분을 가짐
- **검사 흐름**: 제품 선택 → 성분 추출 → 성분 쌍(pair) 조합 → 금기 DB 대조 → 경고

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| UI | shadcn/ui |
| Backend | Next.js Route Handlers |
| DB | Supabase (PostgreSQL) |
| 인증 | Supabase Auth + RLS |
| 배포 | Vercel |

## 문서

| 문서 | 설명 |
|------|------|
| [PRD.md](docs/PRD.md) | 프로젝트 요구사항 및 핵심 기능 명세 |
| [ROADMAP.md](docs/ROADMAP.md) | Phase 1~3 개발 로드맵 |
| [next-js.md](docs/next-js.md) | Next.js 15 규칙 및 폴더 구조 |
| [supabase.md](docs/supabase.md) | Supabase 사용 가이드 및 테이블 구조 |
| [coding-style.md](docs/coding-style.md) | 레이어드 아키텍처 및 코딩 컨벤션 |

## Claude Code 설정

### MCP 서버 (`.mcp.json`)

| 서버 | 용도 |
|------|------|
| `supabase` | DB 스키마, 마이그레이션, RLS 점검 |
| `github` | PR, 이슈 관리 |
| `playwright` | 브라우저 E2E 검증 |
| `context7` | Next.js/Supabase 최신 문서 조회 |
| `sequential-thinking` | 복잡한 설계 단계별 분석 |
| `shadcn` | shadcn/ui 컴포넌트 추가 |

> **설정 필요**: `.mcp.json`의 `YOUR_PROJECT_REF`를 실제 Supabase project ref로 교체

### 에이전트 (`.claude/agents/`)

| 에이전트 | 트리거 상황 |
|----------|-------------|
| `nextjs-supabase-fullstack` | DB 스키마, 인증, API, Realtime 구현 |
| `nextjs-app-router-expert` | 페이지, 컴포넌트, 라우팅, SEO |
| `test-auto-runner` | 코드 변경 후 자동 품질 검증 |
| `nextjs-starter-optimizer` | create-next-app 초기 세팅 정리 |

### Slash Commands (`.claude/commands/`)

| 커맨드 | 기능 |
|--------|------|
| `/init-project` | Next.js + Supabase 프로젝트 초기화 |
| `/db-migrate` | Supabase 마이그레이션 실행 |
| `/push` | 브랜치 확인 → 위험 경고 → 원격 push |

### Hooks (`.claude/hooks/`)

Claude 작업 완료 / 권한 요청 시 Slack 알림 전송.

**활성화 방법**: `.env.local`에 추가:

```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/yyy/zzz
```
