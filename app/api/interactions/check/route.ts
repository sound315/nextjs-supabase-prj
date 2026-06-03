import { interactionService } from '@/lib/services/interactionService'
import { SERVICE_UID } from '@/lib/runtime'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { patientId, productIds } = body

    if (!patientId || typeof patientId !== 'string') {
      return Response.json(
        { success: false, error: '환자 ID가 유효하지 않습니다.' },
        { status: 400 }
      )
    }

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return Response.json(
        { success: false, error: '제품을 1개 이상 선택해주세요.' },
        { status: 400 }
      )
    }

    // 매 요청마다 고유한 job_uid 생성
    const jobUid = crypto.randomUUID()

    const result = await interactionService.check({
      patientId,
      productIds,
      jobUid,
      serviceUid: SERVICE_UID,
    })

    return Response.json({ success: true, data: result })
  } catch (error) {
    console.error('[POST /api/interactions/check]', error)
    return Response.json(
      { success: false, error: '금기 검사 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
