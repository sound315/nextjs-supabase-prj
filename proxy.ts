import { NextResponse, type NextRequest } from 'next/server'

// 인증 비활성화 — 완전 공개 모드
export async function proxy(request: NextRequest) {
  return NextResponse.next({ request })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
