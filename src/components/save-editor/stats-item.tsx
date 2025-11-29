'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LucideIcon, Minus, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

type StatsItemProps = {
  titleKey: string
  value: string
  numericValue: number
  icon: LucideIcon
  onIncrease: () => void
  onDecrease: () => void
  onValueChange?: (newValue: number) => void
  disableDecrease?: boolean
  minValue?: number
  translationNamespace?: string
}

export function StatsItem({
  titleKey,
  value,
  numericValue,
  icon: Icon,
  onIncrease,
  onDecrease,
  onValueChange,
  disableDecrease = false,
  minValue = 0,
  translationNamespace = 'stats'
}: StatsItemProps) {
  const t = useTranslations('run_stats')
  const [inputValue, setInputValue] = useState(value)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!isEditing) {
      setInputValue(value)
    }
  }, [value, isEditing])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
  }

  const handleInputBlur = () => {
    setIsEditing(false)
    const numValue = parseInt(inputValue, 10)
    if (!isNaN(numValue) && numValue >= minValue && onValueChange) {
      onValueChange(numValue)
    } else {
      setInputValue(value)
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    } else if (e.key === 'Escape') {
      setInputValue(value)
      setIsEditing(false)
      e.currentTarget.blur()
    }
  }

  const handleInputFocus = () => {
    setIsEditing(true)
  }

  return (
    <div className="flex flex-col items-center text-sm">
      <p className="text-center font-medium">
        <Icon className="inline-flex size-4 shrink-0 pr-0.5" />
        {t(`${translationNamespace}.${titleKey}`)}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="size-6"
          onClick={onDecrease}
          disabled={disableDecrease}
        >
          <Minus className="size-3" />
        </Button>
        {isEditing ? (
          <Input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            onFocus={handleInputFocus}
            min={minValue}
            className="h-8 w-20 text-center font-mono text-lg font-bold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            autoFocus
          />
        ) : (
          <p
            className="text-center font-mono text-lg font-bold cursor-pointer hover:text-primary transition-colors min-w-[80px]"
            onClick={() => setIsEditing(true)}
            title="Click to edit"
          >
            {value}
          </p>
        )}
        <Button
          variant="outline"
          size="icon"
          className="size-6"
          onClick={onIncrease}
        >
          <Plus className="size-3" />
        </Button>
      </div>
    </div>
  )
}
