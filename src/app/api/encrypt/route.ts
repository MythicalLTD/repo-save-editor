import { encryptEs3 } from '@/lib/es3-crypto-edge'
import { ENCRYPTION_KEY } from '@/consts/encrypton-key'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge' // Use Edge runtime for Cloudflare Pages

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json()

    if (!data) {
      return NextResponse.json({ error: 'Data is required' }, { status: 400 })
    }

    const encrypted = await encryptEs3(data, ENCRYPTION_KEY)

    // Convert Uint8Array to base64 (Edge Runtime compatible)
    // Use chunking to avoid spread operator limits
    let binaryString = ''
    const chunkSize = 8192
    for (let i = 0; i < encrypted.length; i += chunkSize) {
      const chunk = encrypted.slice(i, i + chunkSize)
      binaryString += String.fromCharCode(...chunk)
    }
    const base64 = btoa(binaryString)

    return NextResponse.json({ encrypted: base64 })
  } catch (error) {
    console.error('Encryption error:', error)
    return NextResponse.json(
      { error: 'Failed to encrypt file' },
      { status: 500 }
    )
  }
}
