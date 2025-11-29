import { encryptEs3 } from '@/lib/es3-crypto'
import { ENCRYPTION_KEY } from '@/consts/encrypton-key'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs' // Use Node.js runtime for crypto operations

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json()
    
    if (!data) {
      return NextResponse.json(
        { error: 'Data is required' },
        { status: 400 }
      )
    }

    const encrypted = await encryptEs3(data, ENCRYPTION_KEY)
    
    // Convert Uint8Array to base64
    const base64 = Buffer.from(encrypted).toString('base64')
    
    return NextResponse.json({ encrypted: base64 })
  } catch (error) {
    console.error('Encryption error:', error)
    return NextResponse.json(
      { error: 'Failed to encrypt file' },
      { status: 500 }
    )
  }
}

