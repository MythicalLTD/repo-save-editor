'use client'

import { type SaveGame } from '@/model/save-game'
import PlayerList from './player-list'
import RunStats from './run-stats'
import { ItemInstances } from './item-instances'
import { Button } from '@/components/ui/button'
import { Home, LucideIcon, Plus, RotateCcw, Save } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { SteamAvatars } from '@/model/steam-avatars'

type SaveDataActionButtonProps = {
  icon: LucideIcon
  label: string
  onClick: () => void
  disabled?: boolean
}

function SaveDataActionButton({
  icon: Icon,
  label,
  onClick,
  disabled
}: SaveDataActionButtonProps & React.ComponentPropsWithoutRef<'button'>) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            onClick={onClick}
            className="flex items-center gap-2"
            disabled={disabled}
          >
            <Icon className="h-4 w-4" />
            <p className="hidden md:block">{label}</p>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="block md:hidden">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

type SaveDataProps = {
  saveGame: SaveGame
  onUpdateSaveData: (updatedSaveData: SaveGame) => void
  onReset: () => void
  hasChanges: boolean
  onSave: () => void
  onNewFile: () => void
  fileName?: string | null
  steamAvatars: SteamAvatars | null
  onAvatarUpdate?: (avatars: SteamAvatars) => void
}

export default function SaveData({
  saveGame,
  onUpdateSaveData,
  onReset,
  onSave,
  hasChanges,
  onNewFile,
  fileName,
  steamAvatars,
  onAvatarUpdate
}: SaveDataProps) {
  const t = useTranslations('save_data')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="space-y-6 pb-12">
      {fileName && (
        <div
          className="border-primary/20 bg-card/30 rounded-lg border px-4 py-2
            backdrop-blur-sm"
        >
          <p className="text-primary/80 text-sm font-medium">File:</p>
          <p className="text-muted-foreground font-mono text-sm">{fileName}</p>
        </div>
      )}
      <div
        className="border-primary/20 bg-card/30 flex flex-wrap items-center
          justify-between gap-3 rounded-xl border p-4 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2">
          <SaveDataActionButton
            icon={Home}
            label={t('back_to_main') || 'Back to Main'}
            onClick={onNewFile}
          />
          <SaveDataActionButton
            icon={Plus}
            label={t('new_file')}
            onClick={onNewFile}
          />
        </div>
        <div className="flex items-center gap-2">
          <SaveDataActionButton
            icon={RotateCcw}
            label={t('reset')}
            onClick={onReset}
            disabled={!hasChanges}
          />
          <SaveDataActionButton
            icon={Save}
            label={t('save')}
            onClick={onSave}
            disabled={!hasChanges}
          />
        </div>
      </div>
      <div className="space-y-6">
        <div className="relative">
          <div
            className="from-primary/5 absolute inset-0 -z-10 rounded-xl
              bg-gradient-to-br to-transparent blur-2xl"
          />
          <div
            className="border-primary/10 bg-card/20 relative space-y-4
              rounded-xl border p-6 backdrop-blur-sm"
          >
            <h3
              className="from-primary to-accent bg-gradient-to-r bg-clip-text
                text-xl font-bold text-transparent"
            >
              {t('run_data')}
            </h3>
            <RunStats saveGame={saveGame} onUpdateSaveData={onUpdateSaveData} />
          </div>
        </div>
        <div className="relative">
          <div
            className="from-accent/5 absolute inset-0 -z-10 rounded-xl
              bg-gradient-to-br to-transparent blur-2xl"
          />
          <div
            className="border-primary/10 bg-card/20 relative space-y-4
              rounded-xl border p-6 backdrop-blur-sm"
          >
            <h3
              className="from-primary to-accent bg-gradient-to-r bg-clip-text
                text-xl font-bold text-transparent"
            >
              {t('players')}
            </h3>
            <PlayerList
              saveGame={saveGame}
              onUpdateSaveData={onUpdateSaveData}
              steamAvatars={steamAvatars}
              onAvatarUpdate={onAvatarUpdate}
            />
          </div>
        </div>
        <div className="relative">
          <div
            className="from-primary/5 absolute inset-0 -z-10 rounded-xl
              bg-gradient-to-br to-transparent blur-2xl"
          />
          <div
            className="border-primary/10 bg-card/20 relative space-y-4
              rounded-xl border p-6 backdrop-blur-sm"
          >
            <ItemInstances
              saveGame={saveGame}
              onUpdateSaveData={onUpdateSaveData}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
