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
      <div
        className="border-primary/20 bg-card/40 flex items-center
          justify-between rounded-xl border p-6 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 rounded-lg p-2">
            <X className="text-primary/70 h-5 w-5" />
          </div>
          <div>
            <p className="text-foreground font-medium">{t('disabled')}</p>
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
        <div
          className="border-primary/20 bg-card/40 flex flex-col items-center
            justify-center rounded-xl border p-12 text-center backdrop-blur-sm"
        >
          <div className="bg-primary/10 mb-4 rounded-full p-4">
            <FileText className="text-primary/70 h-8 w-8" />
          </div>
          <p className="text-foreground mb-1 font-medium">{t('empty')}</p>
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
      <div
        className="flex flex-col gap-4 sm:flex-row sm:items-start
          sm:justify-between"
      >
        <div className="flex-1">
          <Heading title={t(`title`)} description={t(`disclaimer`)} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearHistory}
            className="border-primary/30 hover:border-primary/50
              hover:bg-destructive/10 hover:text-destructive flex items-center
              gap-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>{t('clear')}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={disableHistory}
            className="border-primary/30 hover:border-primary/50 flex
              items-center gap-2"
          >
            <X className="h-4 w-4" />
            <span>{t('disable')}</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div
        className="border-primary/20 bg-card/40 overflow-hidden rounded-xl
          border backdrop-blur-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-primary/20 bg-primary/5 border-b">
                <th
                  className="text-foreground px-6 py-4 text-left text-sm
                    font-semibold"
                >
                  {t('file_name')}
                </th>
                <th
                  className="text-foreground px-6 py-4 text-left text-sm
                    font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="text-primary/70 h-4 w-4" />
                    {t('date')}
                  </div>
                </th>
                <th
                  className="text-foreground px-6 py-4 text-center text-sm
                    font-semibold"
                >
                  {t('level')}
                </th>
                <th
                  className="text-foreground px-6 py-4 text-center text-sm
                    font-semibold"
                >
                  {t('total_haul')}
                </th>
                <th
                  className="text-foreground px-6 py-4 text-center text-sm
                    font-semibold"
                >
                  {t('players')}
                </th>
                <th
                  className="text-foreground px-6 py-4 text-right text-sm
                    font-semibold"
                >
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr
                  key={item.fileName + item.timestamp}
                  className="group border-primary/10 hover:bg-primary/5 border-b
                    transition-colors last:border-b-0"
                >
                  <td className="px-6 py-4">
                    <div
                      className="text-foreground font-mono text-sm font-medium"
                    >
                      {item.fileName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="text-muted-foreground flex items-center gap-2
                        text-sm"
                    >
                      <Clock className="text-primary/50 h-3.5 w-3.5 shrink-0" />
                      <span>{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className="text-foreground font-mono text-sm
                        font-semibold"
                    >
                      {item.summary.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className="text-foreground font-mono text-sm
                        font-semibold"
                    >
                      {item.summary.totalHaul}K
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className="text-foreground font-mono text-sm
                        font-semibold"
                    >
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
                        className="border-primary/30 hover:border-primary/50
                          flex items-center gap-2"
                        onClick={() =>
                          downloadSaveGame(item.saveGame, item.fileName)
                        }
                      >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          {t('download')}
                        </span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-destructive/30
                              hover:border-destructive/50
                              hover:bg-destructive/10 hover:text-destructive
                              flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">{t('delete')}</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {t('delete_title')}
                            </AlertDialogTitle>
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
                              className="bg-destructive
                                text-destructive-foreground
                                hover:bg-destructive/90"
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
