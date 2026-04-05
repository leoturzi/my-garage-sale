'use client'
import { useRowLabel } from '@payloadcms/ui'

export const RowLabel = ({
  fieldName,
  fallbackPrefix = 'Item',
}: {
  fieldName: string
  fallbackPrefix?: string
}) => {
  const { data, rowNumber } = useRowLabel<Record<string, string>>()
  const label = data?.[fieldName]
  return <span>{label || `${fallbackPrefix} ${String(rowNumber).padStart(2, '0')}`}</span>
}
