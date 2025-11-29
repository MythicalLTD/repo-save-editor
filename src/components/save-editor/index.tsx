'use client'

import SaveData from '@/components/save-editor/save-data'
import SaveGameHistory from '@/components/save-editor/save-game-history'
import UploadFile from '@/components/upload-file'
import { useSaveGameHistory } from '@/hooks/use-save-game-history'
import downloadSaveGame from '@/lib/download-save-game'
import fetchAvatars from '@/lib/fetch-avatars'
import { type SaveGame } from '@/model/save-game'
import { SaveGameHistoryType } from '@/model/save-game-history'
import { SteamAvatars } from '@/model/steam-avatars'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

export default function SaveEditor() {
  const t = useTranslations('save_editor')
  const [fileName, setFileName] = useState<string | null>(null)
  const [saveGame, setSaveGame] = useState<SaveGame | null>(null)
  const [steamAvatars, setSteamAvatars] = useState<SteamAvatars | null>(null)
  const [originalSaveData, setOriginalSaveData] = useState<SaveGame | null>(
    null
  )
  const { addToHistory } = useSaveGameHistory()

  const hasChanges = useMemo(() => {
    if (!saveGame || !originalSaveData) return false

    return JSON.stringify(saveGame) !== JSON.stringify(originalSaveData)
  }, [saveGame, originalSaveData])

  const handleSaveDataUpdate = (updatedSaveData: SaveGame) => {
    setSaveGame(updatedSaveData)
  }

  const handleReset = () => {
    if (originalSaveData) {
      setSaveGame(structuredClone(originalSaveData))
    }
  }

  const handleSave = async () => {
    if (!saveGame) return
    downloadSaveGame(saveGame, fileName ?? 'savegame.es3')
    setOriginalSaveData(structuredClone(saveGame))
  }

  const handleNewFile = () => {
    setSaveGame(null)
    setOriginalSaveData(null)
    setFileName(null)
  }

  const handleFileUpload = async (
    files: Array<{ base64: string; name: string }>
  ) => {
    if (files.length > 0) {
      try {
        const response = await fetch('/api/decrypt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ base64: files[0].base64 })
        })

        if (!response.ok) {
          throw new Error('Decryption failed')
        }

        const { decrypted } = await response.json()
        const parsed = JSON.parse(decrypted) as SaveGame
        setSaveGame(parsed)
        setOriginalSaveData(structuredClone(parsed))
        setFileName(files[0].name)

        addToHistory(files[0].name, parsed)
      } catch {
        toast.error(t('error.invalid_file'))
      }
    }
  }

  const handleSelectSave = (historyItem: SaveGameHistoryType) => {
    setSaveGame(structuredClone(historyItem.saveGame))
    setOriginalSaveData(structuredClone(historyItem.saveGame))
    setFileName(historyItem.fileName)
  }

  useEffect(() => {
    const fetch = async () => {
      const avatars = await fetchAvatars(
        Object.keys(saveGame?.playerNames.value ?? {})
      )
      setSteamAvatars(avatars)
    }
    if (!saveGame) return
    fetch()
  }, [saveGame])

  return (
    <>
      {saveGame ? (
        <SaveData
          saveGame={saveGame}
          onUpdateSaveData={handleSaveDataUpdate}
          onReset={handleReset}
          hasChanges={hasChanges}
          onSave={handleSave}
          onNewFile={handleNewFile}
          fileName={fileName}
          steamAvatars={steamAvatars}
          onAvatarUpdate={setSteamAvatars}
        />
      ) : (
        <div className="space-y-12 pb-12">
          {/* Hero Upload Section */}
          <div className="relative">
            <div
              className="from-primary/10 via-accent/5 to-primary/10 absolute
                inset-0 -z-10 rounded-2xl bg-gradient-to-br blur-3xl"
            />
            <div
              className="border-primary/20 bg-card/30 relative rounded-2xl
                border p-8 backdrop-blur-sm"
            >
              <UploadFile className="w-full" onFilesChange={handleFileUpload} />
            </div>
          </div>

          {/* Recent Section - Full Width */}
          <div className="relative">
            <div
              className="from-primary/5 absolute inset-0 -z-10 rounded-xl
                bg-gradient-to-br to-transparent blur-2xl"
            />
            <div
              className="border-primary/10 bg-card/20 relative rounded-xl border
                p-6 backdrop-blur-sm"
            >
              <SaveGameHistory onSelectSave={handleSelectSave} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
