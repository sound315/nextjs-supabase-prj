'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { InteractionWarning } from '@/lib/types/interaction'

interface WarningDialogProps {
  open: boolean
  warnings: InteractionWarning[]
  onStop: () => void      // 투약 중단
  onProceed: () => void   // 확인 후 진행
}

// severity 별 색상 및 레이블
const SEVERITY_CONFIG: Record<
  InteractionWarning['severity'],
  { label: string; badgeClass: string; rowClass: string }
> = {
  contraindicated: {
    label: '금기',
    badgeClass: 'bg-red-100 text-red-800 border-red-200',
    rowClass: 'border-l-4 border-red-500 bg-red-50',
  },
  major: {
    label: '주요',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
    rowClass: 'border-l-4 border-orange-500 bg-orange-50',
  },
  moderate: {
    label: '중등도',
    badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    rowClass: 'border-l-4 border-yellow-400 bg-yellow-50',
  },
  minor: {
    label: '경미',
    badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
    rowClass: 'border-l-4 border-gray-400 bg-gray-50',
  },
  info: {
    label: '정보',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    rowClass: 'border-l-4 border-blue-400 bg-blue-50',
  },
}

// 금기 유형 레이블
const TYPE_LABEL: Record<InteractionWarning['type'], string> = {
  patient_contraindication: '환자 특이 금기',
  interaction: '성분 간 상호작용',
  reimbursement: '급여/보험 제한',
}

export function WarningDialog({
  open,
  warnings,
  onStop,
  onProceed,
}: WarningDialogProps) {
  // 경고를 유형별로 그룹화
  const grouped = {
    patient_contraindication: warnings.filter(
      (w) => w.type === 'patient_contraindication'
    ),
    interaction: warnings.filter((w) => w.type === 'interaction'),
    reimbursement: warnings.filter((w) => w.type === 'reimbursement'),
  }

  // contraindicated 또는 major가 하나라도 있으면 심각한 경고로 판단, "확인 후 진행" 버튼 비활성화
  const hasCritical = warnings.some(
    (w) => w.severity === 'contraindicated' || w.severity === 'major'
  )

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent showCloseButton={false} className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-700">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
            금기 경고 {warnings.length}건
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-80 pr-3">
          <div className="space-y-4">
            {/* 환자 특이 금기 */}
            {grouped.patient_contraindication.length > 0 && (
              <section>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {TYPE_LABEL.patient_contraindication}
                </h3>
                <ul className="space-y-2">
                  {grouped.patient_contraindication.map((w, i) => (
                    <WarningItem key={i} warning={w} />
                  ))}
                </ul>
              </section>
            )}

            {/* 성분 간 상호작용 */}
            {grouped.interaction.length > 0 && (
              <section>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {TYPE_LABEL.interaction}
                </h3>
                <ul className="space-y-2">
                  {grouped.interaction.map((w, i) => (
                    <WarningItem key={i} warning={w} />
                  ))}
                </ul>
              </section>
            )}

            {/* 급여/보험 제한 */}
            {grouped.reimbursement.length > 0 && (
              <section>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {TYPE_LABEL.reimbursement}
                </h3>
                <ul className="space-y-2">
                  {grouped.reimbursement.map((w, i) => (
                    <WarningItem key={i} warning={w} />
                  ))}
                </ul>
              </section>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="destructive"
            onClick={onStop}
            className="flex-1"
          >
            투약 중단
          </Button>
          <Button
            variant="outline"
            onClick={onProceed}
            disabled={hasCritical}
            className="flex-1"
            aria-disabled={hasCritical}
          >
            확인 후 진행
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function WarningItem({ warning }: { warning: InteractionWarning }) {
  const config = SEVERITY_CONFIG[warning.severity]

  // 성분 또는 제품명 표시
  const subject = [
    warning.productAName,
    warning.productBName,
    warning.ingredientAName,
    warning.ingredientBName,
  ]
    .filter(Boolean)
    .join(' + ')

  return (
    <li className={`rounded-md p-3 ${config.rowClass}`}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-gray-800">
          {subject || '해당 약물'}
        </span>
        <Badge className={`text-xs flex-shrink-0 ${config.badgeClass}`}>
          {config.label}
        </Badge>
      </div>
      <p className="mt-1 text-xs text-gray-600">{warning.description}</p>
    </li>
  )
}
