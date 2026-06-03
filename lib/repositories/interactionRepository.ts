import { createClient } from '@/lib/supabase/server'

// 제품 ID 목록으로 해당 성분 목록을 조회 (제품명 포함)
export async function getIngredientsByProductIds(productIds: string[]) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('product_ingredients')
    .select(`
      product_id,
      ingredient_id,
      ingredients (
        id,
        name_ko,
        name_en,
        ingredient_code
      ),
      products (
        id,
        product_name
      )
    `)
    .in('product_id', productIds)

  if (error) {
    throw new Error(`성분 조회 실패: ${error.message}`)
  }

  return data ?? []
}

// 성분 ID 쌍으로 상호작용 금기를 양방향으로 조회
export async function getIngredientInteractions(ingredientIds: string[]) {
  if (ingredientIds.length < 2) return []

  const supabase = await createClient()

  // 성분 간 상호작용은 A↔B 양방향 모두 존재할 수 있으므로 OR 조건으로 조회
  const { data, error } = await supabase
    .from('ingredient_interactions')
    .select(`
      id,
      ingredient_a_id,
      ingredient_b_id,
      severity,
      description,
      ingredients!ingredient_interactions_ingredient_a_id_fkey (
        id,
        name_ko
      )
    `)
    .or(
      `and(ingredient_a_id.in.(${ingredientIds.join(',')}),ingredient_b_id.in.(${ingredientIds.join(',')})),` +
      `and(ingredient_b_id.in.(${ingredientIds.join(',')}),ingredient_a_id.in.(${ingredientIds.join(',')}))`
    )

  if (error) {
    throw new Error(`성분 상호작용 조회 실패: ${error.message}`)
  }

  // 같은 성분 ID끼리의 쌍은 제외 (ingredient_a_id !== ingredient_b_id)
  return (data ?? []).filter(
    (row) => row.ingredient_a_id !== row.ingredient_b_id
  )
}

// 환자 특이 금기 조회 (성분 기반 + 제품 기반 모두 포함)
export async function getPatientContraindications(
  patientId: string,
  ingredientIds: string[],
  productIds: string[]
) {
  const supabase = await createClient()

  const conditions: string[] = []

  if (ingredientIds.length > 0) {
    conditions.push(`ingredient_id.in.(${ingredientIds.join(',')})`)
  }
  if (productIds.length > 0) {
    conditions.push(`product_id.in.(${productIds.join(',')})`)
  }

  if (conditions.length === 0) return []

  const { data, error } = await supabase
    .from('patient_contraindications')
    .select(`
      id,
      patient_id,
      ingredient_id,
      product_id,
      reason,
      ingredients (
        id,
        name_ko
      ),
      products (
        id,
        product_name
      )
    `)
    .eq('patient_id', patientId)
    .or(conditions.join(','))

  if (error) {
    throw new Error(`환자 특이 금기 조회 실패: ${error.message}`)
  }

  return data ?? []
}

// 급여/보험 제한 조회 (현재 유효한 제한만)
export async function getReimbursementRestrictions(productIds: string[]) {
  if (productIds.length === 0) return []

  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('reimbursement_restrictions')
    .select(`
      id,
      product_id,
      restriction,
      effective_from,
      effective_to,
      products (
        id,
        product_name
      )
    `)
    .in('product_id', productIds)
    .or(`effective_from.is.null,effective_from.lte.${today}`)
    .or(`effective_to.is.null,effective_to.gte.${today}`)

  if (error) {
    throw new Error(`급여 제한 조회 실패: ${error.message}`)
  }

  return data ?? []
}
