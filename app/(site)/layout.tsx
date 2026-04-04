import './globals.css'
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { getPayloadClient } from '@/lib/payload'
import type { Category, Media, SettingsData } from '@/lib/types'
import { AnnouncementBar } from '@/components/AnnouncementBar'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: 'My Garage Sale',
  description: 'Quality second-hand items at unbeatable prices',
}

const announcementMessages = [
  'Free local delivery on orders over $50',
  'New items added weekly',
  'Message us on WhatsApp to buy',
]

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const payload = await getPayloadClient()

  const settingsRaw = await payload.findGlobal({ slug: 'settings' })
  const categoriesRaw = await payload.find({ collection: 'categories', sort: 'sort_order', limit: 20 })

  const settings = settingsRaw as unknown as SettingsData
  const categories = categoriesRaw.docs as unknown as Category[]
  const storeName = settings.store_name || 'My Garage Sale'

  function resolveMedia(field: Media | number | undefined) {
    if (!field || typeof field === 'number') return null
    return { url: field.url, alt: field.alt, width: field.width, height: field.height }
  }

  const logo = {
    desktop: resolveMedia(settings.logo_desktop),
    mobile: resolveMedia(settings.logo_mobile),
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <AnnouncementBar messages={announcementMessages} />
        <Header storeName={storeName} categories={categories} logo={logo} />
        <main>{children}</main>
        <Footer
          storeName={storeName}
          whatsappNumber={settings.whatsapp_number}
          categories={categories}
          logo={logo}
        />
      </body>
    </html>
  )
}
