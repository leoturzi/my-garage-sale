import Link from 'next/link'
import type { Category } from '@/lib/types'
import { MobileMenu } from './MobileMenu'

export function Header({
  storeName,
  categories,
}: {
  storeName: string
  categories: Category[]
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
          <MobileMenu storeName={storeName} navLinks={navLinks} />
        </div>

        {/* Store name */}
        <Link
          href="/"
          className="text-lg lg:text-xl font-bold uppercase tracking-wider"
        >
          {storeName}
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
