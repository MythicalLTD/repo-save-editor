'use client'

import Image from 'next/image'
import logo from '@/assets/closed.png'
import logoOpen from '@/assets/open.png'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export default function Logo() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const randomInterval = Math.floor(Math.random() * (1500 - 100 + 1)) + 500
    const timeout = setTimeout(() => {
      setIsOpen(!isOpen)
    }, randomInterval)

    return () => {
      clearTimeout(timeout)
    }
  }, [isOpen])

  const handleClick = () => {
    window.location.href = '/'
  }

  return (
    <button
      onClick={handleClick}
      className="cursor-pointer transition-opacity hover:opacity-80"
      title="Back to main menu"
    >
      <Image
        src={logo}
        alt="logo"
        width={64}
        height={64}
        className={cn('size-12 purple-logo', isOpen ? 'hidden' : 'block')}
        priority
      />
      <Image
        src={logoOpen}
        alt="logoOpen"
        width={64}
        height={64}
        className={cn('size-12 purple-logo', isOpen ? 'block' : 'hidden')}
        priority
      />
    </button>
  )
}
