'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'
import type { SaveGame } from '@/model/save-game'
import { Trash2, Plus } from 'lucide-react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

type ItemInstancesProps = {
  saveGame: SaveGame
  onUpdateSaveData: (updatedSaveData: SaveGame) => void
}

export function ItemInstances({
  saveGame,
  onUpdateSaveData
}: ItemInstancesProps) {
  const t = useTranslations('run_stats')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newItemId, setNewItemId] = useState('')
  const [newItemValue, setNewItemValue] = useState(0)
  const [newItemBattery, setNewItemBattery] = useState(100)

  const itemDict = saveGame.dictionaryOfDictionaries.value.item || {}
  const batteryDict = saveGame.dictionaryOfDictionaries.value.itemStatBattery || {}

  const updateItemValue = (itemId: string, newValue: number) => {
    const updatedSaveGame = structuredClone(saveGame)
    if (!updatedSaveGame.dictionaryOfDictionaries.value.item) {
      updatedSaveGame.dictionaryOfDictionaries.value.item = {}
    }
    updatedSaveGame.dictionaryOfDictionaries.value.item[itemId] = newValue
    onUpdateSaveData(updatedSaveGame)
  }

  const updateItemBattery = (itemId: string, newBattery: number) => {
    const updatedSaveGame = structuredClone(saveGame)
    if (!updatedSaveGame.dictionaryOfDictionaries.value.itemStatBattery) {
      updatedSaveGame.dictionaryOfDictionaries.value.itemStatBattery = {}
    }
    updatedSaveGame.dictionaryOfDictionaries.value.itemStatBattery[itemId] = newBattery
    onUpdateSaveData(updatedSaveGame)
  }

  const removeItem = (itemId: string) => {
    const updatedSaveGame = structuredClone(saveGame)
    if (updatedSaveGame.dictionaryOfDictionaries.value.item?.[itemId]) {
      delete updatedSaveGame.dictionaryOfDictionaries.value.item[itemId]
    }
    if (updatedSaveGame.dictionaryOfDictionaries.value.itemStatBattery?.[itemId]) {
      delete updatedSaveGame.dictionaryOfDictionaries.value.itemStatBattery[itemId]
    }
    onUpdateSaveData(updatedSaveGame)
  }

  const addItem = () => {
    if (!newItemId.trim()) return
    const updatedSaveGame = structuredClone(saveGame)
    if (!updatedSaveGame.dictionaryOfDictionaries.value.item) {
      updatedSaveGame.dictionaryOfDictionaries.value.item = {}
    }
    if (!updatedSaveGame.dictionaryOfDictionaries.value.itemStatBattery) {
      updatedSaveGame.dictionaryOfDictionaries.value.itemStatBattery = {}
    }
    updatedSaveGame.dictionaryOfDictionaries.value.item[newItemId] = newItemValue
    updatedSaveGame.dictionaryOfDictionaries.value.itemStatBattery[newItemId] = newItemBattery
    onUpdateSaveData(updatedSaveGame)
    setNewItemId('')
    setNewItemValue(0)
    setNewItemBattery(100)
    setDialogOpen(false)
  }

  const itemEntries = Object.entries(itemDict).sort(([a], [b]) => a.localeCompare(b))

  if (itemEntries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Item Instances</CardTitle>
          <CardDescription>
            Individual item instances in your inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No item instances found.</p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item Instance
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Item Instance</DialogTitle>
                  <DialogDescription>
                    Add a new item instance (e.g., "Item Cart Medium/1")
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemId">Item ID</Label>
                    <Input
                      id="itemId"
                      value={newItemId}
                      onChange={(e) => setNewItemId(e.target.value)}
                      placeholder="Item Cart Medium/1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemValue">Value</Label>
                    <Input
                      id="itemValue"
                      type="number"
                      value={newItemValue}
                      onChange={(e) => setNewItemValue(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemBattery">Battery (%)</Label>
                    <Input
                      id="itemBattery"
                      type="number"
                      min="0"
                      max="100"
                      value={newItemBattery}
                      onChange={(e) => setNewItemBattery(Number(e.target.value))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addItem}>Add</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Item Instances</CardTitle>
            <CardDescription>
              Individual item instances in your inventory ({itemEntries.length} items)
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Instance
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Item Instance</DialogTitle>
                <DialogDescription>
                  Add a new item instance (e.g., "Item Cart Medium/1")
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="itemId">Item ID</Label>
                  <Input
                    id="itemId"
                    value={newItemId}
                    onChange={(e) => setNewItemId(e.target.value)}
                    placeholder="Item Cart Medium/1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="itemValue">Value</Label>
                  <Input
                    id="itemValue"
                    type="number"
                    value={newItemValue}
                    onChange={(e) => setNewItemValue(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="itemBattery">Battery (%)</Label>
                  <Input
                    id="itemBattery"
                    type="number"
                    min="0"
                    max="100"
                    value={newItemBattery}
                    onChange={(e) => setNewItemBattery(Number(e.target.value))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addItem}>Add</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-xl border border-primary/20 bg-card/40 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-primary/20 bg-primary/5">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Item ID
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                    Value
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                    Battery (%)
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {itemEntries.map(([itemId, value]) => (
                  <tr
                    key={itemId}
                    className="border-b border-primary/10 hover:bg-primary/5 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-sm">{itemId}</td>
                    <td className="px-6 py-4 text-center">
                      <Input
                        type="number"
                        value={value}
                        onChange={(e) =>
                          updateItemValue(itemId, Number(e.target.value))
                        }
                        className="w-24"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={batteryDict[itemId] ?? 0}
                        onChange={(e) =>
                          updateItemBattery(itemId, Number(e.target.value))
                        }
                        className="w-24"
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(itemId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

