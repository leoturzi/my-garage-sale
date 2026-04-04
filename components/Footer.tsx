'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Category } from '@/lib/types'
import { Accordion } from '@/components/Accordion'

const helpLinks = [
  { label: 'Preguntas frecuentes', href: '#faq' },
  { label: 'Envíos', href: '#' },
  { label: 'Devoluciones', href: '#' },
]

export function Footer({
  storeName,
  whatsappNumber,
  categories,
}: {
  storeName: string
  whatsappNumber?: string
  categories: Category[]
}) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    // TODO: wire to newsletter backend
    setSubscribed(true)
    setEmail('')
  }

  const sitemapItems = [
    {
      title: 'Categorías',
      content: (
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/categories/${cat.slug}`}
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Ayuda',
      content: (
        <ul className="space-y-2">
          {helpLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="text-sm text-gray-400 transition-colors hover:text-white">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Contacto',
      content: (
        <ul className="space-y-2">
          {whatsappNumber && (
            <li>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                WhatsApp
              </a>
            </li>
          )}
        </ul>
      ),
    },
  ]

  return (
    <footer className="bg-accent text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider">
              Suscríbete al newsletter
            </p>
            <p className="mt-1 text-xs text-gray-400">Novedades y ofertas exclusivas</p>
          </div>
          {subscribed ? (
            <p className="text-sm text-gray-300">¡Gracias por suscribirte!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="min-w-0 flex-1 rounded border border-white/20 bg-white/10 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-white/50 focus:outline-none md:w-64 md:flex-none"
              />
              <button
                type="submit"
                className="whitespace-nowrap rounded bg-white px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-gray-100"
              >
                Suscribirse
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Sitemap — mobile: accordion, desktop: columns */}
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Mobile */}
        <div className="md:hidden">
          <span className="mb-6 block text-lg font-bold uppercase tracking-wider">{storeName}</span>
          <Accordion items={sitemapItems} />
        </div>

        {/* Desktop */}
        <div className="hidden md:grid md:grid-cols-4 md:gap-8">
          <div>
            <span className="text-lg font-bold uppercase tracking-wider">{storeName}</span>
          </div>
          {sitemapItems.map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">{section.title}</h4>
              {section.content}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 md:flex-row">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
          </p>

          {/* Payment methods */}
          <div className="flex items-center gap-2">
            {/* Visa */}
            <div className="flex h-7 w-12 items-center justify-center rounded bg-[#1a1f71] px-2">
              <span className="text-xs font-bold italic tracking-wider text-white">VISA</span>
            </div>

            {/* Mastercard */}
            <div className="flex h-7 w-12 items-center justify-center rounded bg-white px-1">
              <svg viewBox="0 0 40 26" className="h-4 w-auto" aria-label="Mastercard">
                <circle cx="15" cy="13" r="11" fill="#EB001B" />
                <circle cx="25" cy="13" r="11" fill="#F79E1B" />
                <path
                  d="M20 4.8A11 11 0 0 1 23.6 13 11 11 0 0 1 20 21.2a11 11 0 0 1-3.6-8.2A11 11 0 0 1 20 4.8z"
                  fill="#FF5F00"
                />
              </svg>
            </div>

            {/* Mercado Pago */}
            <div className="flex h-7 flex-col items-center justify-center rounded bg-[#009EE3] px-2 leading-none">
              <span className="text-[7px] font-bold text-white">Mercado</span>
              <span className="text-[7px] font-bold text-white">Pago</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
