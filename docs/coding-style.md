# 코딩 스타일 가이드

## 기본 규칙
- 언어: TypeScript (strict 모드)
- 들여쓰기: 2칸
- 네이밍: camelCase (변수/함수), PascalCase (컴포넌트/타입/클래스)
- 주석: 한국어, 비즈니스 로직의 WHY가 비명확한 경우에만 작성

## 아키텍처 레이어

### Route Handler (Controller)
- 요청 파싱, 응답 반환만 담당
- 비즈니스 로직 포함 금지

```ts
// app/api/interactions/check/route.ts
export async function POST(req: Request) {
  const body = await req.json()
  const result = await interactionService.check(body)
  return Response.json({ success: true, data: result })
}
```

### Service
- 비즈니스 로직 담당
- Repository를 조합하여 처리
- `lib/services/` 하위에 도메인별 파일

```ts
// lib/services/interactionService.ts
export const interactionService = {
  async check(dto: CheckInteractionDto) { ... }
}
```

### Repository
- DB 접근만 담당 (Supabase 쿼리)
- `lib/repositories/` 하위에 도메인별 파일

```ts
// lib/repositories/ingredientRepository.ts
export const ingredientRepository = {
  async findByProductIds(productIds: string[]) { ... }
}
```

## DTO 패턴
- `lib/types/` 하위에 도메인별 타입 파일
- 요청/응답 타입을 명시적으로 분리

```ts
// lib/types/interaction.ts
export interface CheckInteractionDto {
  patientId: string
  productIds: string[]
  jobUid: string
  serviceUid: string
}

export interface InteractionResult {
  hasWarning: boolean
  warnings: Warning[]
}
```

## 에러 핸들링
- try/catch는 Route Handler 또는 Service 최상단에서만
- 에러는 반드시 로그 후 일관된 형식으로 반환

```ts
try {
  ...
} catch (error) {
  console.error('[interactionService.check]', error)
  return { success: false, error: '상호작용 검사 중 오류가 발생했습니다.' }
}
```

## DB 트랜잭션
- 여러 테이블을 동시에 변경하는 경우 Supabase RPC(함수) 또는 트랜잭션 처리
- `service_uid`, `job_uid`는 요청 진입 시 생성하여 레이어 전체에 전달
