# ROADMAP: 병원 투약 안전 관리 시스템

## Phase 1: MVP 개발

**목표:** 핵심 기능인 약물 상호작용 경고 시스템 구현

### 환경 설정
- [x] Next.js 16 프로젝트 초기화
- [x] Supabase 프로젝트 생성 및 연동 (bbrzwpgvqohwtofocpug, Singapore)
- [x] 환경변수 설정 (`.env.local`)
- [x] shadcn/ui 설치 및 기본 레이아웃 구성
- [x] 레이어드 아키텍처 폴더 구조 세팅
- [x] Vercel 배포 (https://medication-guard.vercel.app)

### 인증/권한
- [x] ~~Supabase Auth 로그인/로그아웃~~ → **로그인 제거 (완전 공개 모드로 전환)**
- [x] RLS 정책 공개 조회 허용 (인증 없이 SELECT 가능)
- [ ] 역할 기반 접근 제어 (Phase 2로 이전)

### DB 스키마 설계 및 마이그레이션
- [x] `products` 테이블
- [x] `ingredients` 테이블
- [x] `product_ingredients` 테이블
- [x] `ingredient_interactions` 테이블
- [x] `patient_contraindications` 테이블
- [x] `reimbursement_restrictions` 테이블
- [x] `patients` 테이블
- [x] `prescriptions` 테이블
- [x] `prescription_products` 테이블
- [x] `medication_logs` 테이블
- [x] `alert_logs` 테이블
- [x] **실제 DUR 데이터 적재** — 급여/비급여 병용금기 Excel 각 5000행 추출
  - 성분 914개, 제품 3,433개, 금기 조합 3,786쌍

### 약물 상호작용 경고 (핵심)
- [x] 제품 검색/선택 UI (품목명 자동완성)
- [x] 상호작용 검사 API (`POST /api/interactions/check`)
- [x] 검사 로직: 제품 → 성분 추출 → 성분 쌍 조합 → 금기 DB 대조
- [x] 경고 팝업 컴포넌트 (심각도별 색상)
- [x] 투약 진행/중단 선택 처리
- [ ] 경고 이력 자동 저장 (`alert_logs` 테이블에 미저장)

### 기본 관리 화면
- [x] 환자 목록 조회 (금기 검사 화면 내 드롭다운)
- [ ] 환자 CRUD 페이지 (`/patients`)
- [ ] 처방 약물 입력/조회
- [ ] 투약 이력 조회 (`/medications`)
- [ ] 약물 DB 조회 (`/products`)

---

## Phase 2: 기능 확장

**목표:** 관리 기능 고도화 및 운영 편의성 향상

### 약물 DB 관리
- [ ] 제품/성분/매핑 등록·수정·삭제 UI (관리자/약사)
- [ ] 성분 간 병용금기 조합 관리 UI (`/interactions`)
- [ ] 환자 특이 금기 등록·수정·삭제 UI
- [ ] 급여/보험 제한 등록·수정·삭제 UI
- [ ] 제품 검색 고도화 (서버사이드 검색 — 현재 전체 로드 후 클라이언트 필터링)

### 경고 이력 및 통계
- [ ] 경고 이력 저장 (`alert_logs`) 및 조회 페이지 (`/alerts`)
- [ ] 투약 진행/중단 비율 통계
- [ ] 환자별/약물별 경고 발생 현황

### UX 개선
- [ ] 모바일 반응형 UI 최적화
- [ ] 경고 팝업 접근성 개선

### 보안 및 운영
- [ ] 역할(role) 기반 메뉴 접근 제어 (간호사/의사/약사/관리자)
- [ ] 감사 로그
- [ ] CI/CD 설정

---

## Phase 3: DUR 데이터 자동화

**목표:** 수동 시드 데이터를 공공 API 기반 자동 동기화로 전환

- [ ] 현재 수동 적재된 DUR 데이터 → 전체 87만 행으로 확대 여부 검토
- [ ] 식약처 DUR 병용금기 API 연동 → `ingredient_interactions` 자동 동기화
- [ ] 월 1회 배치 자동 동기화 (Vercel Cron)
- [ ] 관리자 화면에서 수동 동기화 실행 버튼

> **현재 데이터 현황 (2026-06-04)**
> - 원본: 급여 745,629행 + 비급여 126,539행 + MTX 328행
> - 적재: 각 5,000행 샘플 추출 → 성분 914개, 제품 3,433개, 금기 3,786쌍
> - 파일: `docs/rawdata/게시_병용금기 급여/비급여 품목리스트_2606.xlsx`

---

## 기술 부채

- [ ] 제품 검색 서버사이드로 전환 (현재 3,433개 전체 클라이언트 로드)
- [ ] `alert_logs` 저장 구현
- [ ] E2E 테스트 (Playwright) 추가
- [ ] 성분 함량 기반 중복 투여 위험 용량 계산
