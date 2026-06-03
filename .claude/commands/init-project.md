Next.js 15 + Supabase 프로젝트를 초기화해줘.

아래 순서대로 진행해:

1. **현재 디렉토리 확인**
   - `package.json`이 없으면 프로젝트 초기화가 필요한 상태
   - 이미 Next.js 프로젝트가 있으면 2단계로 건너뜀

2. **Next.js 프로젝트 생성** (필요한 경우)
   ```
   npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
   ```

3. **필수 패키지 설치**
   ```
   npm install @supabase/supabase-js @supabase/ssr
   npm install -D @types/node
   ```

4. **폴더 구조 생성**
   아래 구조를 만들어줘:
   ```
   src/
   ├── app/
   ├── components/
   ├── lib/
   │   ├── supabase/
   │   │   ├── server.ts
   │   │   └── client.ts
   │   ├── services/
   │   ├── repositories/
   │   └── dto/
   ├── types/
   └── hooks/
   ```

5. **환경변수 파일 생성**
   `.env.local` 파일:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```
   `.env.example` 파일도 동일하게 생성 (실제 값 없이 키만)

6. **nextjs-starter-optimizer 에이전트 실행**
   - 보일러플레이트 코드 정리
   - ESLint + Prettier 설정
   - 프로덕션 환경 최적화

7. **완료 후 안내**
   - Supabase project ref를 `.mcp.json`에 설정해야 함을 알려줘
   - `npm run dev`로 개발 서버 시작 방법 안내
