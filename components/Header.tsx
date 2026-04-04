import Image from 'next/image'
import Link from 'next/link'
import type { Category } from '@/lib/types'
import { MobileMenu } from './MobileMenu'

export type LogoProp = {
  desktop: { url?: string; alt: string; width?: number; height?: number } | null
  mobile: { url?: string; alt: string; width?: number; height?: number } | null
}

export function Header({
  storeName,
  categories,
  logo,
}: {
  storeName: string
  categories: Category[]
  logo?: LogoProp
}) {
  const navLinks = categories.map((c) => ({
    label: c.name,
    href: `/categories/${c.slug}`,
  }))

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14 lg:h-16">
        {/* Mobile menu */}
        <div className="lg:hidden">
          <MobileMenu storeName={storeName} navLinks={navLinks} logo={logo} />
        </div>

        {/* Store name / logo */}
        <Link href="/" className="flex items-center">
          {logo?.mobile?.url || logo?.desktop?.url ? (
            <>
              <Image
                src={(logo.mobile?.url || logo.desktop!.url)!}
                alt={logo.mobile?.alt || logo.desktop!.alt || storeName}
                width={logo.mobile?.width || logo.desktop!.width || 200}
                height={logo.mobile?.height || logo.desktop!.height || 60}
                className="h-8 w-auto max-w-[200px] lg:hidden"
                priority
              />
              <Image
                src={(logo.desktop?.url || logo.mobile!.url)!}
                alt={logo.desktop?.alt || logo.mobile!.alt || storeName}
                width={logo.desktop?.width || logo.mobile!.width || 200}
                height={logo.desktop?.height || logo.mobile!.height || 60}
                className="hidden lg:block h-10 w-auto max-w-[200px]"
                priority
              />
            </>
          ) : (
            <span className="text-lg lg:text-xl font-bold uppercase tracking-wider">
              {storeName}
            </span>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm uppercase tracking-wide text-muted hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Spacer for mobile to center the store name */}
        <div className="w-8 lg:hidden" />
      </div>
    </header>
  )
}
