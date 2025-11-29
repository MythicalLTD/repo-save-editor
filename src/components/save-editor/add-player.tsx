'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSaveGame } from '@/hooks/use-save-game'
import fetchAvatars from '@/lib/fetch-avatars'
import { SaveGame } from '@/model/save-game'
import { SteamAvatars } from '@/model/steam-avatars'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

type AddPlayerProps = {
  saveGame: SaveGame
  onUpdateSaveData: (updatedSaveData: SaveGame) => void
  onAvatarUpdate?: (avatars: SteamAvatars) => void
}

export default function AddPlayer({
  saveGame,
  onUpdateSaveData,
  onAvatarUpdate
}: AddPlayerProps) {
  const t = useTranslations('add_player')
  const { addPlayer } = useSaveGame({ saveGame, onUpdateSaveData })
  const [isOpen, setIsOpen] = useState(false)
  const [playerId, setPlayerId] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Validates if a string is a valid Steam ID
   * Steam IDs are typically 17-digit numbers (Steam ID64)
   * Format: Usually starts with 7656119... for most users
   */
  const isValidSteamId = (id: string): boolean => {
    // Remove any whitespace
    const trimmed = id.trim()
    // Check if it's a numeric string
    if (!/^\d+$/.test(trimmed)) {
      return false
    }
    // Steam IDs are typically 15-17 digits
    // Most common format is 17 digits starting with 7656119
    return trimmed.length >= 15 && trimmed.length <= 17
  }

  const handleAddPlayer = async () => {
    const trimmedId = playerId.trim()
    const trimmedName = playerName.trim()

    if (!trimmedId) {
      toast.error(t('error.player_id_required'))
      return
    }

    if (!trimmedName) {
      toast.error(t('error.player_name_required'))
      return
    }

    // Validate Steam ID format
    if (!isValidSteamId(trimmedId)) {
      toast.error(t('error.invalid_steam_id'))
      return
    }

    // Check if player ID (Steam ID) already exists
    if (saveGame.playerNames.value[trimmedId]) {
      toast.error(t('error.player_id_exists'))
      return
    }

    // Check if player name already exists
    const existingPlayerNames = Object.values(saveGame.playerNames.value)
    if (existingPlayerNames.includes(trimmedName)) {
      toast.error(t('error.player_name_exists'))
      return
    }

    setIsLoading(true)
    try {
      // Get all player IDs including the new one before adding
      const allPlayerIds = Object.keys(saveGame.playerNames.value).concat([
        trimmedId
      ])

      // Add the player first
      addPlayer(trimmedId, trimmedName)

      // Fetch all avatars including the new player
      if (onAvatarUpdate) {
        try {
          const allAvatars = await fetchAvatars(allPlayerIds)
          onAvatarUpdate(allAvatars)
        } catch (error) {
          // Avatar fetch failed, but player was added successfully
          console.warn('Failed to fetch avatar:', error)
          toast.warning(t('warning.avatar_fetch_failed'))
        }
      }

      toast.success(t('success.player_added'))
      setIsOpen(false)
      setPlayerId('')
      setPlayerName('')
    } catch (error) {
      toast.error(t('error.failed_to_add'))
      console.error('Failed to add player:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setPlayerId('')
      setPlayerName('')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-primary/30 hover:border-primary/50"
        >
          <Plus className="mr-2 size-4" />
          {t('button_label')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="player-id">{t('player_id_label')}</Label>
            <Input
              id="player-id"
              placeholder={t('player_id_placeholder')}
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && playerId && playerName && !isLoading) {
                  handleAddPlayer()
                }
              }}
              disabled={isLoading}
            />
            <p className="text-muted-foreground text-xs">
              {t('player_id_hint')}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="player-name">{t('player_name_label')}</Label>
            <Input
              id="player-name"
              placeholder={t('player_name_placeholder')}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && playerId && playerName && !isLoading) {
                  handleAddPlayer()
                }
              }}
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button
            onClick={handleAddPlayer}
            disabled={
              !playerId.trim() ||
              !playerName.trim() ||
              !isValidSteamId(playerId.trim()) ||
              isLoading
            }
          >
            {isLoading ? t('adding') : t('add')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
