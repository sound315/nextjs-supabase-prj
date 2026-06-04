import { redirect } from 'next/navigation'

// 로그인 비활성화 — /dashboard로 바로 이동
export default function LoginPage() {
  redirect('/dashboard')
}
