'use client'

import version from '@/../version.json'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { DATE_LOCALE } from '@/consts/date-locale'
import { LocaleType } from '@/model/locale'
import { type VersionHistoryType } from '@/model/version-history'
import { Asterisk, History } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'

export default function NavbarVersionHistory() {
  const t = useTranslations('version_history')
  const versionHistory = version as unknown as VersionHistoryType
  const locale = useLocale() as LocaleType
  const [isOpen, setIsOpen] = useState(false)

  const date = useCallback(
    (date: string) => new Date(date).toLocaleDateString(DATE_LOCALE[locale]),
    [locale]
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="border-primary/30 hover:border-primary/50"
          title={t('title')}
        >
          <History className="h-4 w-4" />
          <span className="sr-only">{t('title')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('title')}
          </DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 font-mono">
          {[...versionHistory.releases].reverse().map((release) => (
            <Accordion key={release.version} type="single" collapsible>
              <AccordionItem value={release.version} className="last:border-b">
                <AccordionTrigger className="hover:bg-accent/30 p-2 font-semibold">
                  {release.version}
                </AccordionTrigger>
                <AccordionContent className="space-y-2 p-2">
                  <p className="w-fit font-mono text-sm">
                    <span className="font-semibold">{t(`release_date`)}:</span>{' '}
                    {date(release.date)}
                  </p>
                  <p className="w-fit font-mono text-sm font-semibold">
                    {t(`changes`)} ({release.changes[locale].length})
                  </p>
                  {release.changes[locale].map((change, index) => (
                    <div className="flex items-center gap-1" key={index}>
                      <Asterisk className="size-4 shrink-0 text-primary/70" />
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{change}</span>
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

