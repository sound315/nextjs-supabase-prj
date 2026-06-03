import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">대시보드</h2>
        <p className="mt-1 text-sm text-gray-600">
          투약 전 약물 상호작용을 사전에 확인하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 금기 검사 바로가기 카드 */}
        <Link href="/check">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-blue-100 hover:border-blue-300">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <CardTitle className="text-base">금기 검사</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                환자를 선택하고 투약할 제품을 추가하여 금기 여부를 즉시 확인합니다.
                환자 특이 금기, 성분 간 상호작용, 급여 제한을 한 번에 검사합니다.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        {/* 안내 카드 */}
        <Card className="border-gray-100">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <CardTitle className="text-base">검사 유형 안내</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 inline-block w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                <span><strong>환자 특이 금기</strong> — 해당 환자에게 금지된 성분·제품</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 inline-block w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                <span><strong>성분 간 상호작용</strong> — 동시 투약 시 위험한 성분 조합</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 inline-block w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                <span><strong>급여/보험 제한</strong> — 보험 급여 기준 초과 여부</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
