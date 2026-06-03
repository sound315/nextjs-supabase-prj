Supabase 데이터베이스 마이그레이션을 실행해줘.

아래 순서대로 진행해:

1. **현재 DB 상태 파악**
   ```
   mcp__supabase__list_tables        → 현재 테이블 목록 확인
   mcp__supabase__list_migrations    → 마이그레이션 이력 확인
   mcp__supabase__get_advisors       → 보안/성능 문제 사전 점검
   ```

2. **마이그레이션 파일 확인**
   - `supabase/migrations/` 폴더의 미적용 마이그레이션 파일 목록 표시
   - 파일명 형식: `YYYYMMDD_description.sql`
   - 적용할 마이그레이션이 없으면 사용자에게 알려줌

3. **마이그레이션 적용**
   ```
   mcp__supabase__apply_migration → 마이그레이션 파일 적용
   ```
   - 각 마이그레이션 적용 결과를 순서대로 보고
   - 오류 발생 시 즉시 중단하고 오류 내용 표시

4. **타입 재생성**
   마이그레이션 성공 후:
   ```
   mcp__supabase__generate_typescript_types → types/database.ts 재생성
   ```

5. **검증**
   ```
   mcp__supabase__get_advisors → 마이그레이션 후 보안 점검
   mcp__supabase__get_logs     → 최근 DB 로그 확인 (에러 없음 확인)
   ```

6. **완료 요약**
   - 적용된 마이그레이션 수
   - 현재 테이블 목록
   - 타입 파일 재생성 여부
