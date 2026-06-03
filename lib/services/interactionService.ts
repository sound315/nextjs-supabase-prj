import {
  getIngredientsByProductIds,
  getIngredientInteractions,
  getPatientContraindications,
  getReimbursementRestrictions,
} from '@/lib/repositories/interactionRepository'
import type {
  CheckInteractionDto,
  CheckInteractionResult,
  InteractionWarning,
} from '@/lib/types/interaction'

export const interactionService = {
  async check(dto: CheckInteractionDto): Promise<CheckInteractionResult> {
    const { patientId, productIds } = dto
    const warnings: InteractionWarning[] = []

    // 1. 선택된 productIds로 성분 목록 추출
    const productIngredientRows = await getIngredientsByProductIds(productIds)

    // 성분 ID 목록 (중복 제거)
    const ingredientIdSet = new Set<string>()
    for (const row of productIngredientRows) {
      if (row.ingredient_id) ingredientIdSet.add(row.ingredient_id)
    }
    const ingredientIds = Array.from(ingredientIdSet)

    // 성분 ID → 성분명 매핑
    const ingredientNameMap = new Map<string, string>()
    for (const row of productIngredientRows) {
      if (row.ingredient_id && row.ingredients) {
        const ing = Array.isArray(row.ingredients)
          ? row.ingredients[0]
          : row.ingredients
        if (ing) ingredientNameMap.set(row.ingredient_id, ing.name_ko)
      }
    }

    // 제품 ID → 제품명 매핑
    const productNameMap = new Map<string, string>()
    for (const row of productIngredientRows) {
      if (row.product_id && row.products) {
        const prod = Array.isArray(row.products)
          ? row.products[0]
          : row.products
        if (prod) productNameMap.set(row.product_id, prod.product_name)
      }
    }

    // 2. 환자 특이 금기 검사
    const contraindications = await getPatientContraindications(
      patientId,
      ingredientIds,
      productIds
    )

    for (const row of contraindications) {
      const ingredientName = row.ingredient_id
        ? ingredientNameMap.get(row.ingredient_id) ?? '알 수 없는 성분'
        : undefined
      const productName = row.product_id
        ? productNameMap.get(row.product_id) ??
          (row.products
            ? (Array.isArray(row.products)
                ? row.products[0]?.product_name
                : (row.products as { product_name?: string }).product_name)
            : undefined)
        : undefined

      warnings.push({
        type: 'patient_contraindication',
        severity: 'contraindicated',
        ingredientAName: ingredientName,
        productAName: productName as string | undefined,
        description: row.reason ?? '이 환자에게 금기된 성분 또는 제품입니다.',
      })
    }

    // 3. 성분 쌍 조합 생성 후 상호작용 검사
    if (ingredientIds.length >= 2) {
      const interactions = await getIngredientInteractions(ingredientIds)

      for (const row of interactions) {
        const ingAName =
          ingredientNameMap.get(row.ingredient_a_id) ?? '알 수 없는 성분'
        const ingBName =
          ingredientNameMap.get(row.ingredient_b_id) ?? '알 수 없는 성분'

        const severity = mapSeverity(row.severity)

        warnings.push({
          type: 'interaction',
          severity,
          ingredientAName: ingAName,
          ingredientBName: ingBName,
          description:
            row.description ??
            `${ingAName}와(과) ${ingBName} 간 상호작용이 있습니다.`,
        })
      }
    }

    // 4. 급여 제한 검사
    const restrictions = await getReimbursementRestrictions(productIds)

    for (const row of restrictions) {
      const prod = row.products
      const productName = prod
        ? Array.isArray(prod)
          ? prod[0]?.product_name
          : (prod as { product_name?: string }).product_name
        : productNameMap.get(row.product_id)

      warnings.push({
        type: 'reimbursement',
        severity: 'info',
        productAName: productName as string | undefined,
        description: row.restriction,
      })
    }

    return {
      hasWarning: warnings.length > 0,
      warnings,
    }
  },
}

// DB severity 값을 InteractionWarning severity 타입으로 변환
function mapSeverity(
  severity: string
): InteractionWarning['severity'] {
  switch (severity) {
    case 'contraindicated':
      return 'contraindicated'
    case 'major':
      return 'major'
    case 'moderate':
      return 'moderate'
    case 'minor':
      return 'minor'
    default:
      return 'info'
  }
}
