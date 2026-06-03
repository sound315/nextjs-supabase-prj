# Claude Code Template

Next.js 15 + Supabase 프로젝트를 위한 Claude Code 설정 템플릿.

## 사용 방법

새 프로젝트에 적용할 때:

```bash
# 1. 이 레포의 .claude/, .mcp.json을 새 프로젝트 루트에 복사
cp -r claude-template/.claude  my-new-project/
cp    claude-template/.mcp.json my-new-project/

# 2. .mcp.json에서 Supabase project_ref 교체
#    YOUR_PROJECT_REF → 실제 Supabase 프로젝트 ref
```

## 포함 항목

### MCP 서버 (`.mcp.json`)

| 서버 | 용도 |
|------|------|
| `supabase` | DB 스키마, 마이그레이션, 로그, RLS 점검 |
| `playwright` | 브라우저 E2E 검증 |
| `context7` | Next.js/Supabase 최신 문서 실시간 조회 |
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

### Slack 훅 (`.claude/hooks/`)

Claude 작업 완료 / 권한 요청 시 Slack 알림 전송.

**활성화 방법**: 프로젝트 루트의 `.env` 파일에 추가:

```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/yyy/zzz
```

그리고 `.claude/settings.json`에 훅 연결:

```json
{
  "hooks": {
    "Stop": [{ "type": "command", "command": "bash .claude/hooks/stop-hook.sh" }],
    "Notification": [{ "type": "command", "command": "bash .claude/hooks/notification-hook.sh" }]
  }
}
```

### Slash Commands (`.claude/commands/`)

| 커맨드 | 기능 |
|--------|------|
| `/push` | 브랜치 확인 → 위험 경고 → 원격 push |
