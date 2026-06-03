import { createClient } from '@/lib/supabase/server'

// 제품 목록 전체 조회 (금기 검사 제품 선택용)
export async function getAllProducts() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('id, product_name, product_code, dosage_form, manufacturer')
    .order('product_name')

  if (error) {
    throw new Error(`제품 목록 조회 실패: ${error.message}`)
  }

  return data ?? []
}
