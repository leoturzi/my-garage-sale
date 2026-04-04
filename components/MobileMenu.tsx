'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { LogoProp } from './Header'

export function MobileMenu({
  storeName,
  navLinks,
  logo,
}: {
  storeName: string
  navLinks: { label: string; href: string }[]
  logo?: LogoProp
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="p-1"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          {/* Slide-out panel */}
          <div className="relative w-72 bg-white h-full shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              {logo?.mobile?.url ? (
                <Image
                  src={logo.mobile.url}
                  alt={logo.mobile.alt || storeName}
                  width={logo.mobile.width || 200}
                  height={logo.mobile.height || 60}
                  className="h-7 w-auto max-w-[160px]"
                />
              ) : (
                <span className="font-bold uppercase tracking-wider">
                  {storeName}
                </span>
              )}
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="p-1"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm uppercase tracking-wide text-muted hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
