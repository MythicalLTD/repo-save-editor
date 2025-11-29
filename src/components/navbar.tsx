import GitHubStars from '@/components/github-stars'
import { LocaleSelector } from '@/components/locale-selector'
import Logo from '@/components/logo'
import NavbarVersionHistory from '@/components/navbar-version-history'

export default function Navbar() {
  return (
    <div
      className="border-primary/20 bg-background/80 fixed z-50 flex w-full
        items-center justify-between border-b px-7 pt-2 backdrop-blur-xl
        md:px-12"
      style={{
        background:
          'linear-gradient(to bottom, oklch(0.18 0.04 280 / 0.95), oklch(0.15 0.04 280 / 0.9))'
      }}
    >
      <Logo />

      <div className="flex -translate-y-1 gap-2">
        <NavbarVersionHistory />
        <GitHubStars />
        <LocaleSelector />
      </div>
    </div>
  )
}
