import { createClient } from '@/lib/supabase/server'

// 환자 목록 전체 조회 (금기 검사 환자 선택용)
export async function getAllPatients() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('patients')
    .select('id, name, patient_no, birth_date, gender')
    .order('name')

  if (error) {
    throw new Error(`환자 목록 조회 실패: ${error.message}`)
  }

  return data ?? []
}
