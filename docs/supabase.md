# Supabase 사용 가이드

## 클라이언트 생성
- Server Component / Route Handler: `createServerClient` (쿠키 기반)
- Client Component: `createBrowserClient`
- `lib/supabase/server.ts`, `lib/supabase/client.ts`에 각각 정의

## 인증
- Supabase Auth 사용 (이메일/패스워드)
- 역할(role)은 `user_profiles` 테이블에 별도 관리
- 미들웨어(`middleware.ts`)에서 세션 갱신 및 인증 보호

## RLS 정책
- 모든 테이블에 RLS 활성화 필수
- 역할별 접근 제어: `auth.uid()`와 `user_profiles.role` 조인으로 판단
- 환자 데이터는 담당 역할 외 접근 차단

## DB 테이블 공통 규칙
- 모든 테이블에 `service_uid`, `job_uid` 컬럼 포함 (추적성)
- PK는 `uuid` 타입, `gen_random_uuid()` 기본값
- `created_at`, `updated_at` 타임스탬프 포함

## 핵심 테이블 구조

### 약물 관련
- `products` — 제품 정보 (품목명, 품목코드, 제조사)
- `ingredients` — 성분 정보 (성분명 한글/영문, 성분코드)
- `product_ingredients` — 제품-성분 매핑 (M:N)
- `ingredient_interactions` — 성분 간 금기 조합 + 위험 등급 + 사유
- `patient_contraindications` — 환자 특이 금기 (환자 ↔ 성분/제품)
- `reimbursement_restrictions` — 급여/보험 투약 제한 (제품 단위)

### 환자/처방 관련
- `patients` — 환자 기본 정보
- `prescriptions` — 처방 목록
- `prescription_products` — 처방별 제품 목록
- `medication_logs` — 투약 이력
- `alert_logs` — 경고 발생 이력

## 마이그레이션
- `supabase/migrations/` 폴더에 SQL 파일로 관리
- `/db-migrate` 커맨드로 실행
