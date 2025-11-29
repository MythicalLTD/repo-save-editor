import { decryptEs3 } from '@/lib/es3-crypto'
import { ENCRYPTION_KEY } from '@/consts/encrypton-key'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs' // Use Node.js runtime for crypto operations

export async function POST(request: NextRequest) {
  try {
    const { base64 } = await request.json()
    
    if (!base64) {
      return NextResponse.json(
        { error: 'Base64 data is required' },
        { status: 400 }
      )
    }

    const decrypted = await decryptEs3(base64, ENCRYPTION_KEY)
    
    return NextResponse.json({ decrypted })
  } catch (error) {
    console.error('Decryption error:', error)
    return NextResponse.json(
      { error: 'Failed to decrypt file' },
      { status: 500 }
    )
  }
}

