export interface CheckInteractionDto {
  patientId: string
  productIds: string[]
  jobUid: string
  serviceUid: string
}

export interface InteractionWarning {
  type: 'patient_contraindication' | 'interaction' | 'reimbursement'
  severity: 'contraindicated' | 'major' | 'moderate' | 'minor' | 'info'
  productAName?: string
  productBName?: string
  ingredientAName?: string
  ingredientBName?: string
  description: string
}

export interface CheckInteractionResult {
  hasWarning: boolean
  warnings: InteractionWarning[]
}
