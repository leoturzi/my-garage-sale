export interface Media {
  id: number
  alt: string
  url?: string
  width?: number
  height?: number
  sizes?: {
    thumbnail?: { url?: string; width?: number; height?: number }
    card?: { url?: string; width?: number; height?: number }
  }
}

export interface Category {
  id: number
  name: string
  slug: string
  cover_image?: Media | number
  sort_order?: number
}

export interface Product {
  id: number
  name: string
  brand?: string
  category: Category | number
  description?: string
  price: number
  condition?: 'new' | 'like_new' | 'good' | 'fair'
  size?: string
  images?: (Media | number)[]
  tags?: ('sale' | 'offer' | 'new_arrival' | 'last_chance')[]
  details?: { label: string; value: string }[]
  status: 'available' | 'sold'
  createdAt: string
  updatedAt: string
}

export interface HeroData {
  title?: string
  subtitle?: string
  cta_label?: string
  cta_link?: string
  background_image?: Media | number
}

export interface SettingsData {
  store_name?: string
  whatsapp_number?: string
  logo_desktop?: Media | number
  logo_mobile?: Media | number
}

export interface SiteContentData {
  marquee?: {
    enabled?: boolean
    messages?: { text: string }[]
  }
  faq?: {
    sections?: {
      title: string
      show_on_product_page?: boolean
      questions?: { question: string; answer: string }[]
    }[]
  }
}
