import { getAllPatients } from '@/lib/repositories/patientRepository'
import { getAllProducts } from '@/lib/repositories/productRepository'
import { InteractionChecker } from '@/components/alerts/InteractionChecker'

export default async function CheckPage() {
  // 서버에서 환자·제품 목록을 미리 조회하여 클라이언트 컴포넌트에 전달
  const [patients, products] = await Promise.all([
    getAllPatients(),
    getAllProducts(),
  ])

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">금기 검사</h2>
        <p className="mt-1 text-sm text-gray-600">
          환자를 선택하고 투약할 제품을 추가한 뒤 검사 버튼을 누르세요.
        </p>
      </div>

      <InteractionChecker patients={patients} products={products} />
    </div>
  )
}
