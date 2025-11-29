import { SaveGame } from '@/model/save-game'

/**
 * Downloads the provided save game data as an encrypted file.
 * This function encrypts the save game data using ES3 encryption and
 * initiates a file download in the browser.
 *
 * @param {SaveGame} saveGame - The save game object to be downloaded
 * @param {string} filename - The name to give the downloaded file
 * @returns {Promise<void>} A promise that resolves when the download is initiated
 * @throws {TypeError} When called outside of a browser environment
 */
export default async function downloadSaveGame(
  saveGame: SaveGame,
  filename: string
): Promise<void> {
  if (globalThis.window === undefined) {
    throw new TypeError('This function can only be used in the browser')
  }

  const response = await fetch('/api/encrypt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: JSON.stringify(saveGame, null, 4)
    })
  })

  if (!response.ok) {
    throw new Error('Encryption failed')
  }

  const { encrypted } = await response.json()
  
  // Convert base64 to Uint8Array
  const binaryData = Uint8Array.from(
    atob(encrypted),
    (c) => c.charCodeAt(0)
  )
  
  const blob = new Blob([binaryData])

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  a.remove()
}
