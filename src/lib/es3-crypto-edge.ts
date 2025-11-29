/**
 * Edge Runtime compatible ES3 crypto functions using Web Crypto API
 * This version works in Cloudflare Pages Edge Runtime
 */

import pako from 'pako'

/**
 * Converts a string password and salt to a CryptoKey using PBKDF2
 */
async function deriveKey(
  password: string,
  salt: Uint8Array,
  iterations: number = 100
): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: iterations,
      hash: 'SHA-1'
    },
    passwordKey,
    { name: 'AES-CBC', length: 128 },
    false,
    ['encrypt', 'decrypt']
  )
}

/**
 * Compresses data using GZIP (using pako library for Edge Runtime compatibility)
 */
async function gzip(data: Uint8Array): Promise<Uint8Array> {
  return pako.gzip(data)
}

/**
 * Decompresses GZIP data (using pako library for Edge Runtime compatibility)
 */
async function gunzip(data: Uint8Array): Promise<Uint8Array> {
  return pako.ungzip(data)
}

/**
 * Encrypts data using AES-128-CBC encryption with optional GZIP compression
 * Edge Runtime compatible version
 */
export async function encryptEs3FromBuffer(
  data: Uint8Array,
  password: string,
  shouldGzip: boolean = false
): Promise<Uint8Array> {
  let dataToEncrypt = data
  if (shouldGzip) {
    dataToEncrypt = await gzip(data)
  }

  // Generate random IV (16 bytes for AES-128-CBC)
  const iv = crypto.getRandomValues(new Uint8Array(16))

  // Derive key using PBKDF2
  const key = await deriveKey(password, iv, 100)

  // Encrypt using AES-CBC
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-CBC',
      iv: iv
    },
    key,
    dataToEncrypt
  )

  // Combine IV and encrypted data
  const result = new Uint8Array(iv.length + encrypted.byteLength)
  result.set(iv, 0)
  result.set(new Uint8Array(encrypted), iv.length)

  return result
}

/**
 * Encrypts a string using AES-128-CBC encryption with optional GZIP compression
 * Edge Runtime compatible version
 */
export async function encryptEs3(
  data: string,
  password: string,
  shouldGzip: boolean = false
): Promise<Uint8Array> {
  const encoder = new TextEncoder()
  const bufferData = encoder.encode(data)
  return encryptEs3FromBuffer(bufferData, password, shouldGzip)
}

/**
 * Decrypts AES-128-CBC encrypted data from a base64 data URI and converts to string
 * Edge Runtime compatible version
 */
export async function decryptEs3(
  base64Data: string,
  password: string,
  encoding: BufferEncoding = 'utf8'
): Promise<string> {
  // Extract the base64 part from the data URI if it includes the prefix
  const base64Content = base64Data.includes('base64,')
    ? base64Data.split('base64,')[1]
    : base64Data

  // Decode base64 to Uint8Array
  const binaryString = atob(base64Content)
  const encryptedData = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    encryptedData[i] = binaryString.charCodeAt(i)
  }

  // Extract IV (first 16 bytes) and ciphertext
  const iv = encryptedData.subarray(0, 16)
  const cipherText = encryptedData.subarray(16)

  // Derive key using PBKDF2
  const key = await deriveKey(password, iv, 100)

  // Decrypt using AES-CBC
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-CBC',
      iv: iv
    },
    key,
    cipherText
  )

  const decryptedData = new Uint8Array(decrypted)

  // Check if data is GZIP compressed (magic bytes: 0x1F 0x8B)
  if (
    decryptedData.length >= 2 &&
    decryptedData[0] === 0x1f &&
    decryptedData[1] === 0x8b
  ) {
    const unzippedData = await gunzip(decryptedData)
    const decoder = new TextDecoder(encoding)
    return decoder.decode(unzippedData)
  }

  const decoder = new TextDecoder(encoding)
  return decoder.decode(decryptedData)
}
