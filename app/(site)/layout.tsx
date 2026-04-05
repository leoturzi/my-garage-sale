import './globals.css'
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { getPayloadClient } from '@/lib/payload'
import type { Category, Media, SettingsData, SiteContentData } from '@/lib/types'
import { AnnouncementBar } from '@/components/AnnouncementBar'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { es_AR } from '@/lib/translations'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: es_AR.siteName,
  description: es_AR.siteDescription,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const payload = await getPayloadClient()

  const settingsRaw = await payload.findGlobal({ slug: 'settings' })
  const siteContentRaw = await payload.findGlobal({ slug: 'site-content' })
  const categoriesRaw = await payload.find({ collection: 'categories', sort: 'sort_order', limit: 20 })

  const settings = settingsRaw as unknown as SettingsData
  const siteContent = siteContentRaw as unknown as SiteContentData
  const categories = categoriesRaw.docs as unknown as Category[]
  const storeName = settings.store_name || 'My Garage Sale'

  const marqueeEnabled = siteContent.marquee?.enabled !== false
  const marqueeMessages = siteContent.marquee?.messages?.map((m) => m.text).filter(Boolean)
  const hasMarqueeMessages = marqueeMessages && marqueeMessages.length > 0
  const announcementMessages = hasMarqueeMessages ? marqueeMessages : es_AR.announcements

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
        {marqueeEnabled && <AnnouncementBar messages={announcementMessages} />}
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
