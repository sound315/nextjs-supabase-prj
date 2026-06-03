import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 미인증 사용자는 로그인 페이지로 이동
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 사이드바 */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-sm font-bold text-gray-900 leading-tight">
            투약 안전
            <br />
            관리 시스템
          </h1>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            대시보드
          </Link>
          <Link
            href="/check"
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            금기 검사
          </Link>
        </nav>

        {/* 로그아웃 */}
        <div className="p-3 border-t border-gray-200">
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100 transition-colors text-left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              로그아웃
            </button>
          </form>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div />
          <div className="text-xs text-gray-500">{user.email}</div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
