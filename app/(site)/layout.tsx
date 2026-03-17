import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { getPayloadClient } from '@/lib/payload'
import type { Category, SettingsData } from '@/lib/types'
import { AnnouncementBar } from '@/components/AnnouncementBar'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'My Garage Sale',
  description: 'Quality second-hand items at unbeatable prices',
}

const announcementMessages = [
  'Free local delivery on orders over €50',
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

  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <AnnouncementBar messages={announcementMessages} />
        <Header storeName={storeName} categories={categories} />
        <main>{children}</main>
        <Footer
          storeName={storeName}
          whatsappNumber={settings.whatsapp_number}
        />
      </body>
    </html>
  )
}
