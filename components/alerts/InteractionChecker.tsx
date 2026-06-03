'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { WarningDialog } from '@/components/alerts/WarningDialog'
import type { CheckInteractionResult } from '@/lib/types/interaction'

interface Patient {
  id: string
  name: string
  patient_no: string
  birth_date: string | null
  gender: string | null
}

interface Product {
  id: string
  product_name: string
  product_code: string
  dosage_form: string | null
  manufacturer: string | null
}

interface InteractionCheckerProps {
  patients: Patient[]
  products: Product[]
}

export function InteractionChecker({ patients, products }: InteractionCheckerProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [patientOpen, setPatientOpen] = useState(false)
  const [productOpen, setProductOpen] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [checkResult, setCheckResult] = useState<CheckInteractionResult | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [safeMessage, setSafeMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 제품 추가 (중복 방지)
  const handleAddProduct = useCallback((product: Product) => {
    setSelectedProducts((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev
      return [...prev, product]
    })
    setProductOpen(false)
    setSafeMessage(false)
    setCheckResult(null)
  }, [])

  // 제품 제거
  const handleRemoveProduct = useCallback((productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId))
    setSafeMessage(false)
    setCheckResult(null)
  }, [])

  // 금기 검사 실행
  const handleCheck = async () => {
    if (!selectedPatient) {
      setErrorMessage('환자를 선택해주세요.')
      return
    }
    if (selectedProducts.length === 0) {
      setErrorMessage('제품을 1개 이상 선택해주세요.')
      return
    }

    setErrorMessage(null)
    setSafeMessage(false)
    setIsChecking(true)

    try {
      const response = await fetch('/api/interactions/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: selectedPatient.id,
          productIds: selectedProducts.map((p) => p.id),
        }),
      })

      const json = await response.json()

      if (!json.success) {
        setErrorMessage(json.error ?? '검사 중 오류가 발생했습니다.')
        return
      }

      const result: CheckInteractionResult = json.data
      setCheckResult(result)

      if (result.hasWarning) {
        setDialogOpen(true)
      } else {
        setSafeMessage(true)
      }
    } catch {
      setErrorMessage('서버와의 통신 중 오류가 발생했습니다.')
    } finally {
      setIsChecking(false)
    }
  }

  // 투약 중단 선택
  const handleStop = () => {
    setDialogOpen(false)
    setCheckResult(null)
    setSelectedProducts([])
  }

  // 확인 후 진행 선택
  const handleProceed = () => {
    setDialogOpen(false)
    setSafeMessage(true)
  }

  return (
    <div className="space-y-4">
      {/* 환자 선택 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">1. 환자 선택</CardTitle>
        </CardHeader>
        <CardContent>
          <Popover open={patientOpen} onOpenChange={setPatientOpen}>
            <PopoverTrigger
              className="w-full flex items-center justify-between rounded-lg border border-border bg-background px-3 h-8 text-sm hover:bg-muted transition-colors"
              aria-label="환자 선택"
            >
              <span className={selectedPatient ? 'text-foreground' : 'text-muted-foreground'}>
                {selectedPatient
                  ? `${selectedPatient.name} (${selectedPatient.patient_no})`
                  : '환자를 선택하세요...'}
              </span>
              <svg className="w-4 h-4 opacity-50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <Command>
                <CommandInput placeholder="환자명 또는 번호 검색..." />
                <CommandList>
                  <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                  <CommandGroup>
                    {patients.map((patient) => (
                      <CommandItem
                        key={patient.id}
                        value={`${patient.name} ${patient.patient_no}`}
                        onSelect={() => {
                          setSelectedPatient(patient)
                          setPatientOpen(false)
                          setSafeMessage(false)
                          setCheckResult(null)
                        }}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{patient.name}</span>
                          <span className="text-xs text-gray-500">
                            번호: {patient.patient_no}
                            {patient.gender && ` · ${patient.gender === 'M' ? '남' : '여'}`}
                            {patient.birth_date && ` · ${patient.birth_date}`}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {/* 제품 선택 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">2. 제품 선택</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* 선택된 제품 태그 */}
          {selectedProducts.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedProducts.map((product) => (
                <Badge
                  key={product.id}
                  variant="secondary"
                  className="flex items-center gap-1 pr-1 text-xs"
                >
                  {product.product_name}
                  <button
                    onClick={() => handleRemoveProduct(product.id)}
                    className="ml-1 rounded-full hover:bg-gray-300 p-0.5"
                    aria-label={`${product.product_name} 제거`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* 제품 검색 드롭다운 */}
          <Popover open={productOpen} onOpenChange={setProductOpen}>
            <PopoverTrigger
              className="w-full flex items-center justify-center rounded-lg border border-border bg-background px-3 h-8 text-sm hover:bg-muted transition-colors gap-2"
              aria-label="제품 추가"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              제품 추가
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="start">
              <Command>
                <CommandInput placeholder="제품명 또는 코드 검색..." />
                <CommandList>
                  <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                  <CommandGroup>
                    {products.map((product) => {
                      const alreadySelected = selectedProducts.some(
                        (p) => p.id === product.id
                      )
                      return (
                        <CommandItem
                          key={product.id}
                          value={`${product.product_name} ${product.product_code}`}
                          onSelect={() => handleAddProduct(product)}
                          disabled={alreadySelected}
                          className={alreadySelected ? 'opacity-40' : ''}
                        >
                          <div className="flex flex-col flex-1">
                            <span className="font-medium">{product.product_name}</span>
                            <span className="text-xs text-gray-500">
                              {product.product_code}
                              {product.dosage_form && ` · ${product.dosage_form}`}
                              {product.manufacturer && ` · ${product.manufacturer}`}
                            </span>
                          </div>
                          {alreadySelected && (
                            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {/* 에러 메시지 */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {errorMessage}
        </div>
      )}

      {/* 안전 메시지 */}
      {safeMessage && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium">안전합니다</p>
            <p className="text-xs text-green-600 mt-0.5">
              선택한 제품 조합에서 금기 사항이 발견되지 않았습니다.
            </p>
          </div>
        </div>
      )}

      {/* 검사 버튼 */}
      <Button
        onClick={handleCheck}
        disabled={isChecking}
        className="w-full"
        size="lg"
      >
        {isChecking ? (
          <>
            <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            검사 중...
          </>
        ) : (
          '금기 검사 실행'
        )}
      </Button>

      {/* 경고 다이얼로그 */}
      {checkResult && checkResult.hasWarning && (
        <WarningDialog
          open={dialogOpen}
          warnings={checkResult.warnings}
          onStop={handleStop}
          onProceed={handleProceed}
        />
      )}
    </div>
  )
}
