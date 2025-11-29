import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function Footer() {
  const t = await getTranslations('footer')

  return (
    <div className="border-t border-primary/20 bg-background/50 px-6 py-4 text-sm backdrop-blur-sm md:px-12">
      <p className="text-foreground/70">
        {t('description')}{' '}
        <Link
          href="https://github.com/MythicalLTD"
          target="_blank"
          className="text-primary underline-offset-3 transition-colors hover:text-accent hover:underline"
        >
          MythicalLTD
        </Link>
      </p>
    </div>
  )
}
