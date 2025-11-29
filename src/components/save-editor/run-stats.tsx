import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useRunStats } from '@/hooks/use-run-stats'
import type { SaveGame } from '@/model/save-game'
import { DollarSign, Gauge, Zap, Edit2, Calendar } from 'lucide-react'
import { PurchasedItems } from './purchased-items'
import { StatsItem } from './stats-item'
import { TimePlayedEditor } from './time-played-editor'
import { useSaveGame } from '@/hooks/use-save-game'
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
import { useState } from 'react'
import { useTranslations } from 'next-intl'

type RunStatsProps = {
  saveGame: SaveGame
  onUpdateSaveData: (updatedSaveData: SaveGame) => void
}

export default function RunStats({
  saveGame,
  onUpdateSaveData
}: RunStatsProps) {
  const { getRunStatValue, handleStatChange, updateRunStatValue } = useRunStats(
    saveGame,
    onUpdateSaveData
  )
  const { updateTimePlayed, updateTeamName, updateDateAndTime } = useSaveGame({
    saveGame,
    onUpdateSaveData
  })
  const t = useTranslations('run_stats')

  const handleTimePlayedChange = (newTimePlayed: number) => {
    updateTimePlayed(newTimePlayed)
  }

  const [teamNameDialogOpen, setTeamNameDialogOpen] = useState(false)
  const [dateDialogOpen, setDateDialogOpen] = useState(false)
  const [teamNameInput, setTeamNameInput] = useState(saveGame.teamName.value)
  const [dateInput, setDateInput] = useState(saveGame.dateAndTime.value)

  const handleTeamNameSave = () => {
    updateTeamName(teamNameInput)
    setTeamNameDialogOpen(false)
  }

  const handleDateSave = () => {
    updateDateAndTime(dateInput)
    setDateDialogOpen(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {saveGame.teamName.value}
            <Dialog open={teamNameDialogOpen} onOpenChange={setTeamNameDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Edit2 className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('stats.team_name')}</DialogTitle>
                  <DialogDescription>
                    Update your team name
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="teamName">{t('stats.team_name')}</Label>
                    <Input
                      id="teamName"
                      value={teamNameInput}
                      onChange={(e) => setTeamNameInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleTeamNameSave()
                      }}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setTeamNameDialogOpen(false)}>
                    {t('cancel')}
                  </Button>
                  <Button onClick={handleTeamNameSave}>{t('save')}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </div>
        <CardDescription className="flex items-center gap-4 flex-wrap">
          <TimePlayedEditor
            timePlayed={saveGame.timePlayed.value}
            onTimePlayedChange={handleTimePlayedChange}
          />
          <Dialog open={dateDialogOpen} onOpenChange={setDateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-auto p-1 text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                {saveGame.dateAndTime.value}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('stats.date_and_time')}</DialogTitle>
                <DialogDescription>
                  Update the date and time (format: YYYY-MM-DD)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="date">{t('stats.date_and_time')}</Label>
                  <Input
                    id="date"
                    type="date"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleDateSave()
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDateDialogOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button onClick={handleDateSave}>{t('save')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatsItem
            icon={Gauge}
            titleKey="level"
            value={(getRunStatValue('level') + 1).toString()}
            numericValue={getRunStatValue('level') + 1}
            onIncrease={() => handleStatChange('level', 1, 1)}
            onDecrease={() => handleStatChange('level', -1, 1)}
            onValueChange={(newValue) => updateRunStatValue('level', Math.max(1, newValue - 1))}
            disableDecrease={getRunStatValue('level') <= 1}
            minValue={2}
          />
          <StatsItem
            icon={DollarSign}
            titleKey="currency"
            value={getRunStatValue('currency').toString()}
            numericValue={getRunStatValue('currency')}
            onIncrease={() => handleStatChange('currency', 1)}
            onDecrease={() => handleStatChange('currency', -1)}
            onValueChange={(newValue) => updateRunStatValue('currency', Math.max(0, newValue))}
            disableDecrease={getRunStatValue('currency') <= 0}
            minValue={0}
          />
          <StatsItem
            icon={DollarSign}
            titleKey="total_haul"
            value={getRunStatValue('totalHaul').toString()}
            numericValue={getRunStatValue('totalHaul')}
            onIncrease={() => handleStatChange('totalHaul', 1)}
            onDecrease={() => handleStatChange('totalHaul', -1)}
            onValueChange={(newValue) => updateRunStatValue('totalHaul', Math.max(0, newValue))}
            disableDecrease={getRunStatValue('totalHaul') <= 0}
            minValue={0}
          />
          <StatsItem
            icon={Zap}
            titleKey="charging_station"
            value={getRunStatValue('chargingStationCharge').toString()}
            numericValue={getRunStatValue('chargingStationCharge')}
            onIncrease={() => handleStatChange('chargingStationCharge', 1)}
            onDecrease={() => handleStatChange('chargingStationCharge', -1)}
            onValueChange={(newValue) => updateRunStatValue('chargingStationCharge', Math.max(0, newValue))}
            disableDecrease={getRunStatValue('chargingStationCharge') <= 0}
            minValue={0}
          />
        </div>
        <Separator />
        <PurchasedItems
          saveGame={saveGame}
          onUpdateSaveData={onUpdateSaveData}
        />
      </CardContent>
    </Card>
  )
}
