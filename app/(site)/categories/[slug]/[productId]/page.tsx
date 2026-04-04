import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import type { Product, Category, Media, SettingsData } from '@/lib/types'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ProductImages } from '@/components/ProductImages'
import { ProductInfo } from '@/components/ProductInfo'
import { TrustBadges } from '@/components/TrustBadges'
import { Accordion } from '@/components/Accordion'
import { ProductGrid } from '@/components/ProductGrid'
import { ReviewsSection } from '@/components/ReviewsSection'
import { FAQSection } from '@/components/FAQSection'
import { es_AR } from '@/lib/translations'

export const revalidate = 60
export const dynamicParams = true

interface PageProps {
  params: Promise<{ slug: string; productId: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { productId } = await params

  try {
    const payload = await getPayloadClient()
    const raw = await payload.findByID({ collection: 'products', id: Number(productId) })
    const product = raw as unknown as Product

    const firstImage =
      product.images && product.images.length > 0 && typeof product.images[0] !== 'number'
        ? (product.images[0] as Media)
        : null

    const ogImageUrl = firstImage?.sizes?.card?.url ?? firstImage?.url

    const title = `${product.name} | Mi Venta de Garaje`
    const description =
      product.description?.slice(0, 160) ?? `${product.name} ${es_AR.availableAt}`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        ...(ogImageUrl ? { images: [{ url: ogImageUrl }] } : {}),
      },
    }
  } catch {
    return { title: es_AR.productNotFound }
  }
}

function resolveImages(images: (Media | number)[] | undefined) {
  if (!images) return []
  return images
    .filter((img): img is Media => typeof img !== 'number')
    .map((img) => ({
      url: img.sizes?.card?.url ?? img.url ?? '',
      alt: img.alt,
      thumbnail: img.sizes?.thumbnail?.url ?? img.url ?? '',
    }))
    .filter((img) => img.url)
}

export default async function ProductPage({ params }: PageProps) {
  const { slug, productId } = await params
  const payload = await getPayloadClient()

  // 1. Fetch product
  let product: Product
  try {
    const raw = await payload.findByID({ collection: 'products', id: Number(productId) })
    product = raw as unknown as Product
  } catch {
    notFound()
  }

  // 2. Resolve category
  let category: Category
  if (typeof product.category === 'number') {
    const catRaw = await payload.findByID({ collection: 'categories', id: product.category })
    category = catRaw as unknown as Category
  } else {
    category = product.category
  }

  // Validate that the slug matches the product's category
  if (category.slug !== slug) notFound()

  // 3. Fetch settings for WhatsApp number
  const settingsRaw = await payload.findGlobal({ slug: 'settings' })
  const settings = settingsRaw as unknown as SettingsData

  // 4. Fetch related products (same category, excluding current)
  const relatedRaw = await payload.find({
    collection: 'products',
    where: {
      category: { equals: category.id },
      id: { not_equals: product.id },
      status: { equals: 'available' },
    },
    limit: 10,
    sort: '-createdAt',
  })
  const relatedProducts = relatedRaw.docs as unknown as Product[]

  // 4. Fetch recent products (placeholder for "Recently Viewed")
  const recentRaw = await payload.find({
    collection: 'products',
    where: {
      id: { not_equals: product.id },
      status: { equals: 'available' },
    },
    limit: 10,
    sort: '-createdAt',
  })
  const recentProducts = recentRaw.docs as unknown as Product[]

  // Prepare data
  const images = resolveImages(product.images)

  const accordionItems = [
    product.description
      ? {
        title: es_AR.description,
        defaultOpen: true,
        content: <p className="whitespace-pre-line">{product.description}</p>,
      }
      : null,
    product.details && product.details.length > 0
      ? {
        title: es_AR.details,
        content: (
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            {product.details.map((d, i) => (
              <div key={i} className="flex justify-between col-span-2 sm:col-span-1">
                <span className="font-medium text-foreground">{d.label}</span>
                <span>{d.value}</span>
              </div>
            ))}
          </div>
        ),
      }
      : null,
    {
      title: es_AR.shippingReturns,
      content: (
        <div className="space-y-3">
          <p>{es_AR.shippingText}</p>
          <p>{es_AR.returnsText}</p>
        </div>
      ),
    },
  ].filter(Boolean) as { title: string; content: React.ReactNode; defaultOpen?: boolean }[]

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: es_AR.home, href: '/' },
          { label: category.name, href: `/categories/${category.slug}` },
          { label: product.name },
        ]}
      />

      {/* Product: Images + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pb-8">
        <ProductImages images={images} />
        <ProductInfo
          product={product}
          whatsappNumber={settings.whatsapp_number}
          productUrl={`${process.env.NEXT_PUBLIC_SITE_URL!}/categories/${category.slug}/${product.id}`}
        />
      </div>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Accordion sections */}
      <div className="py-8">
        <Accordion items={accordionItems} />
      </div>

      {/* Reviews */}
      <ReviewsSection />

      {/* You May Also Like */}
      <ProductGrid title={es_AR.youMayAlsoLike} products={relatedProducts} />

      {/* Recently Viewed */}
      <ProductGrid title={es_AR.recentlyViewed} products={recentProducts} />

      {/* FAQ */}
      <FAQSection />
    </div>
  )
}
