import { getPayloadClient } from '@/lib/payload'
import type { HeroData, Category, Product } from '@/lib/types'
import { HeroSection } from '@/components/HeroSection'
import { CategoryGrid } from '@/components/CategoryGrid'
import { ValueProps } from '@/components/ValueProps'
import { ProductGrid } from '@/components/ProductGrid'
import { SpotlightSection } from '@/components/SpotlightSection'
import { es_AR } from '@/lib/translations'

export const revalidate = 60

export default async function Home() {
  const payload = await getPayloadClient()

  const heroRaw = await payload.findGlobal({ slug: 'hero' })
  const categoriesRaw = await payload.find({
    collection: 'categories',
    sort: 'sort_order',
    limit: 20,
  })
  const justAddedRaw = await payload.find({
    collection: 'products',
    sort: '-createdAt',
    limit: 10,
    where: { status: { equals: 'available' } },
  })
  const allProductsRaw = await payload.find({
    collection: 'products',
    limit: 100,
    where: { status: { equals: 'available' } },
  })

  const hero = heroRaw as unknown as HeroData
  const categories = categoriesRaw.docs as unknown as Category[]
  const justAdded = justAddedRaw.docs as unknown as Product[]
  const allProducts = allProductsRaw.docs as unknown as Product[]

  // Filter sale/offer products in JS (Postgres enum doesn't support ILIKE)
  const saleProducts = allProducts.filter(
    (p) => p.tags?.includes('sale') || p.tags?.includes('offer'),
  )

  const brands = [
    ...new Set(allProducts.map((p) => p.brand).filter(Boolean)),
  ] as string[]
  const spotlightCategories = categories.slice(0, 3)

  return (
    <>
      <HeroSection hero={hero} />
      <CategoryGrid categories={categories} />
      <ValueProps />
      <ProductGrid title={es_AR.justAdded} ctaLabel={es_AR.viewAll} ctaHref={es_AR.viewAllHref} products={justAdded} />
      <SpotlightSection categories={spotlightCategories} />
      <ProductGrid title={es_AR.onSale} products={saleProducts} />
    </>
  )
}
