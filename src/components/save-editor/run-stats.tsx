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
import { DollarSign, Gauge, Zap } from 'lucide-react'
import { PurchasedItems } from './purchased-items'
import { StatsItem } from './stats-item'
import { TimePlayedEditor } from './time-played-editor'
import { useSaveGame } from '@/hooks/use-save-game'

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
  const { updateTimePlayed } = useSaveGame({
    saveGame,
    onUpdateSaveData
  })

  const handleTimePlayedChange = (newTimePlayed: number) => {
    updateTimePlayed(newTimePlayed)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{saveGame.teamName.value}</CardTitle>
        <CardDescription>
          <TimePlayedEditor
            timePlayed={saveGame.timePlayed.value}
            onTimePlayedChange={handleTimePlayedChange}
          />
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
