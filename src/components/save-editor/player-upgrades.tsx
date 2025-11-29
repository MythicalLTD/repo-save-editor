import { UpgradeCount } from '@/components/save-editor/upgrade-count'
import { UPGRADES_ICON } from '@/consts/upgrades-icon'
import {
  UpgradeType,
  upgradeType,
  usePlayerUpgrades
} from '@/hooks/use-player-upgrades'
import { SaveGame } from '@/model/save-game'
import { useMemo } from 'react'

type PlayerUpgradesProps = {
  saveGame: SaveGame
  onUpdateSaveData: (updatedSaveData: SaveGame) => void
  playerId: string
}

const BASE_HEALTH = 100
const HEALTH_INCREMENT = 20

export default function PlayerUpgrades({
  saveGame,
  onUpdateSaveData,
  playerId
}: PlayerUpgradesProps) {
  const { getUpgradeValue, handleIncrease, handleDecrease, setUpgradeValue } =
    usePlayerUpgrades(saveGame, onUpdateSaveData)

  const upgradeValues = useMemo(
    () =>
      Object.values(upgradeType).filter(
        (upgradeType: UpgradeType) => upgradeType !== 'playerHealth'
      ),
    []
  )

  const updateHealthAndUpgrade = (
    key: string,
    newHealthUpgrade: number,
    newHealth: number
  ) => {
    const updatedSaveData = { ...saveGame }
    if (
      updatedSaveData.dictionaryOfDictionaries.value.playerUpgradeHealth &&
      updatedSaveData.dictionaryOfDictionaries.value.playerHealth
    ) {
      updatedSaveData.dictionaryOfDictionaries.value.playerUpgradeHealth[key] =
        newHealthUpgrade
      updatedSaveData.dictionaryOfDictionaries.value.playerHealth[key] =
        newHealth
      onUpdateSaveData(updatedSaveData)
    }
  }

  const handleIncreaseHealth = (key: string) => {
    const currentHealthUpgrade = getUpgradeValue(key, 'playerUpgradeHealth')
    const newHealthUpgrade = currentHealthUpgrade + 1
    const maxHealth = BASE_HEALTH + newHealthUpgrade * HEALTH_INCREMENT
    updateHealthAndUpgrade(key, newHealthUpgrade, maxHealth)
  }

  const handleDecreaseHealth = (key: string) => {
    const currentHealthUpgrade = getUpgradeValue(key, 'playerUpgradeHealth')
    if (currentHealthUpgrade > 0) {
      const newHealthUpgrade = currentHealthUpgrade - 1
      const maxHealth = BASE_HEALTH + newHealthUpgrade * HEALTH_INCREMENT
      updateHealthAndUpgrade(key, newHealthUpgrade, maxHealth)
    }
  }

  const handleHealthUpgradeChange = (key: string, newValue: number) => {
    // Ensure newValue is non-negative
    const safeValue = Math.max(0, newValue)
    const maxHealth = BASE_HEALTH + safeValue * HEALTH_INCREMENT
    // Update both health upgrade and health in a single operation
    updateHealthAndUpgrade(key, safeValue, maxHealth)
  }

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {upgradeValues.map(
        (upgrade: UpgradeType) =>
          saveGame.dictionaryOfDictionaries.value[upgrade] && (
            <UpgradeCount
              count={getUpgradeValue(playerId, upgrade)}
              key={upgrade}
              onIncrease={() =>
                upgrade === 'playerUpgradeHealth'
                  ? handleIncreaseHealth(playerId)
                  : handleIncrease(playerId, upgrade)
              }
              onDecrease={() =>
                upgrade === 'playerUpgradeHealth'
                  ? handleDecreaseHealth(playerId)
                  : handleDecrease(playerId, upgrade)
              }
              onValueChange={(newValue) => {
                if (upgrade === 'playerUpgradeHealth') {
                  handleHealthUpgradeChange(playerId, newValue)
                } else {
                  setUpgradeValue(playerId, upgrade, Math.max(0, newValue))
                }
              }}
              icon={UPGRADES_ICON[upgrade]}
              titleKey={upgrade}
            />
          )
      )}
    </div>
  )
}
