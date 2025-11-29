'use client'

import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { useSaveGameHistory } from '@/hooks/use-save-game-history'
import downloadSaveGame from '@/lib/download-save-game'
import { SaveGameHistoryType } from '@/model/save-game-history'
import {
  Check,
  Clock,
  Download,
  FileText,
  Trash2,
  Upload,
  X
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Heading from '@/components/heading'

type SaveGameHistoryProps = {
  onSelectSave?: (saveGame: SaveGameHistoryType) => void
}

export default function SaveGameHistory({
  onSelectSave
}: SaveGameHistoryProps) {
  const {
    history,
    clearHistory,
    removeFromHistory,
    disabled,
    disableHistory,
    enableHistory
  } = useSaveGameHistory()
  const t = useTranslations('save_history')

  if (disabled) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-card/40 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <X className="h-5 w-5 text-primary/70" />
          </div>
          <div>
            <p className="font-medium text-foreground">{t('disabled')}</p>
            <p className="text-muted-foreground text-sm">
              Enable history to track your save games
            </p>
          </div>
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={enableHistory}
          className="flex items-center gap-2"
        >
          <Check className="h-4 w-4" />
          <span>{t('enable')}</span>
        </Button>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="space-y-4">
        <Heading title={t(`title`)} description={t(`disclaimer`)} />
        <div className="flex flex-col items-center justify-center rounded-xl border border-primary/20 bg-card/40 p-12 text-center backdrop-blur-sm">
          <div className="mb-4 rounded-full bg-primary/10 p-4">
            <FileText className="h-8 w-8 text-primary/70" />
          </div>
          <p className="mb-1 font-medium text-foreground">{t('empty')}</p>
          <p className="text-muted-foreground text-sm">
            Upload a save file to start tracking your game history
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <Heading title={t(`title`)} description={t(`disclaimer`)} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearHistory}
            className="flex items-center gap-2 border-primary/30 hover:border-primary/50 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span>{t('clear')}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={disableHistory}
            className="flex items-center gap-2 border-primary/30 hover:border-primary/50"
          >
            <X className="h-4 w-4" />
            <span>{t('disable')}</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-primary/20 bg-card/40 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-primary/20 bg-primary/5">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  {t('file_name')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary/70" />
                    {t('date')}
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                  {t('level')}
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                  {t('total_haul')}
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                  {t('players')}
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr
                  key={item.fileName + item.timestamp}
                  className="group border-b border-primary/10 transition-colors hover:bg-primary/5 last:border-b-0"
                >
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm font-medium text-foreground">
                      {item.fileName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-primary/50" />
                      <span>
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {item.summary.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {item.summary.totalHaul}K
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {item.summary.playerCount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => onSelectSave?.(item)}
                      >
                        <Upload className="h-4 w-4" />
                        <span className="hidden sm:inline">{t('load')}</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2 border-primary/30 hover:border-primary/50"
                        onClick={() =>
                          downloadSaveGame(item.saveGame, item.fileName)
                        }
                      >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">{t('download')}</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-2 border-destructive/30 hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">{t('delete')}</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('delete_title')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('delete_description', {
                                fileName: item.fileName
                              })}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                removeFromHistory(item.fileName, item.timestamp)
                              }
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {t('delete')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
