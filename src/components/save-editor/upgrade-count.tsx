'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Minus, Plus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

type UpgradeCountProps = {
  count: number
  titleKey: string
  icon: LucideIcon
  onIncrease: () => void
  onDecrease: () => void
  onValueChange?: (newValue: number) => void
}

export function UpgradeCount({
  count,
  titleKey,
  icon: Icon,
  onIncrease,
  onDecrease,
  onValueChange
}: UpgradeCountProps) {
  const t = useTranslations('player_list')
  const [inputValue, setInputValue] = useState(count.toString())
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!isEditing) {
      setInputValue(count.toString())
    }
  }, [count, isEditing])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
  }

  const handleInputBlur = () => {
    setIsEditing(false)
    const numValue = parseInt(inputValue, 10)
    if (!isNaN(numValue) && numValue >= 0 && onValueChange) {
      onValueChange(numValue)
    } else {
      setInputValue(count.toString())
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    } else if (e.key === 'Escape') {
      setInputValue(count.toString())
      setIsEditing(false)
      e.currentTarget.blur()
    }
  }

  const handleInputFocus = () => {
    setIsEditing(true)
  }

  return (
    <div className="flex flex-col items-center text-center text-sm">
      <p className="font-medium">
        <Icon className="inline-flex size-4 shrink-0 pr-0.5" />
        {t(`attributes.${titleKey}`)}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="size-6"
          onClick={onDecrease}
          disabled={count <= 0}
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
            min={0}
            className="h-8 w-20 text-center font-mono text-lg font-bold [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            autoFocus
          />
        ) : (
          <p
            className="font-mono text-lg font-bold cursor-pointer hover:text-primary transition-colors min-w-[80px]"
            onClick={() => setIsEditing(true)}
            title="Click to edit"
          >
            {count}
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
