import { LoginForm } from '@/components/auth/LoginForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 이미 로그인된 사용자는 대시보드로 이동
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">투약 안전 관리</h1>
          <p className="mt-1 text-sm text-gray-500">시스템에 로그인하세요</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
