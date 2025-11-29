'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PURCHASED_ITEMS_ICON } from '@/consts/purchased-items-icon'
import { useRunStats } from '@/hooks/use-run-stats'
import { SaveGame } from '@/model/save-game'
import { Box, Plus, Search, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { StatsItem } from './stats-item'

type PurchasedItemsProps = {
  saveGame: SaveGame
  onUpdateSaveData: (updatedSaveData: SaveGame) => void
}

export function PurchasedItems({
  saveGame,
  onUpdateSaveData
}: PurchasedItemsProps) {
  const t = useTranslations('run_stats')
  const { handleItemsPurchasedChange, addPurchasedItem, updatePurchasedItemValue } = useRunStats(saveGame, onUpdateSaveData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [initialQuantity, setInitialQuantity] = useState('0')

  // Get all existing item keys
  const existingItemKeys = useMemo(() => {
    return new Set(
      Object.keys(saveGame.dictionaryOfDictionaries.value.itemsPurchased).map(
        (key) => key.replace('Item ', '').replaceAll('_', ' ')
      )
    )
  }, [saveGame.dictionaryOfDictionaries.value.itemsPurchased])

  // Get all available items (from the icon map) that aren't already added
  const availableItems = useMemo(() => {
    return Object.keys(PURCHASED_ITEMS_ICON)
      .filter((itemName) => !existingItemKeys.has(itemName))
      .filter((itemName) =>
        itemName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort()
  }, [existingItemKeys, searchQuery])

  const handleAddItem = () => {
    if (selectedItem) {
      const quantity = parseInt(initialQuantity, 10) || 0
      addPurchasedItem(selectedItem, quantity)
      setIsDialogOpen(false)
      setSelectedItem(null)
      setInitialQuantity('0')
      setSearchQuery('')
    }
  }

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" className="last:border-b">
        <AccordionTrigger className="hover:bg-accent p-2">
          <div className="flex items-center gap-0.5">
            <Box className="size-4" />
            <p>{t(`items_title`)}</p>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="mt-4 space-y-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full border-primary/30 hover:border-primary/50"
                >
                  <Plus className="mr-2 size-4" />
                  Add New Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Item</DialogTitle>
                  <DialogDescription>
                    Select an item to add to your purchased items list.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Search Items</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search for an item..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-select">Select Item</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                          id="item-select"
                        >
                          {selectedItem || 'Choose an item...'}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="max-h-60 w-full overflow-y-auto">
                        {availableItems.length > 0 ? (
                          availableItems.map((itemName) => {
                            const Icon = PURCHASED_ITEMS_ICON[itemName] ?? Zap
                            return (
                              <DropdownMenuItem
                                key={itemName}
                                onClick={() => setSelectedItem(itemName)}
                                className="flex items-center gap-2"
                              >
                                <Icon className="size-4" />
                                {itemName}
                              </DropdownMenuItem>
                            )
                          })
                        ) : (
                          <DropdownMenuItem disabled>
                            {searchQuery
                              ? 'No items found'
                              : 'All items already added'}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {selectedItem && (
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Initial Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="0"
                        value={initialQuantity}
                        onChange={(e) => setInitialQuantity(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false)
                      setSelectedItem(null)
                      setInitialQuantity('0')
                      setSearchQuery('')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddItem}
                    disabled={!selectedItem}
                  >
                    Add Item
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {Object.entries(
                saveGame.dictionaryOfDictionaries.value.itemsPurchased
              ).map(([key, value]) => {
                const itemName = key.replace('Item ', '').replaceAll('_', ' ')
                return (
                  <StatsItem
                    key={key}
                    icon={PURCHASED_ITEMS_ICON[itemName] ?? Zap}
                    titleKey={itemName}
                    value={value.toString()}
                    numericValue={value}
                    onIncrease={() => handleItemsPurchasedChange(key, 1)}
                    onDecrease={() => handleItemsPurchasedChange(key, -1)}
                    onValueChange={(newValue) => updatePurchasedItemValue(key, newValue)}
                    disableDecrease={value <= 0}
                    minValue={0}
                  />
                )
              })}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
