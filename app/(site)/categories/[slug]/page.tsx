import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import type { Product, Category } from '@/lib/types'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ProductCard } from '@/components/ProductCard'
import { es_AR } from '@/lib/translations'

export const revalidate = 60
export const dynamicParams = true

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    const category = result.docs[0] as unknown as Category | undefined

    if (!category) return { title: es_AR.categoryNotFound }

    return {
      title: `${category.name} | Mi Venta de Garaje`,
      description: `${es_AR.browseCategory} ${category.name} — artículos de segunda mano de calidad a precios excelentes.`,
    }
  } catch {
    return { title: es_AR.categoryNotFound }
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayloadClient()

  // Fetch category by slug
  const categoryResult = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const category = categoryResult.docs[0] as unknown as Category | undefined

  if (!category) notFound()

  // Fetch products: available first, then sold
  // Sequential — session pooler has limited concurrent connections
  const availableRaw = await payload.find({
    collection: 'products',
    where: {
      category: { equals: category.id },
      status: { equals: 'available' },
    },
    sort: '-createdAt',
    limit: 100,
  })
  const soldRaw = await payload.find({
    collection: 'products',
    where: {
      category: { equals: category.id },
      status: { equals: 'sold' },
    },
    sort: '-createdAt',
    limit: 100,
  })

  const available = availableRaw.docs as unknown as Product[]
  const sold = soldRaw.docs as unknown as Product[]
  const products = [...available, ...sold]

  return (
    <div className="max-w-7xl mx-auto px-4">
      <Breadcrumbs
        items={[
          { label: es_AR.home, href: '/' },
          { label: category.name },
        ]}
      />

      <div className="pb-4">
        <h1 className="text-2xl font-bold uppercase tracking-wide">{category.name}</h1>
        <p className="text-sm text-muted mt-1">
          {available.length} {available.length === 1 ? es_AR.itemAvailable : es_AR.itemsAvailable}
          {sold.length > 0 && ` · ${sold.length} ${es_AR.sold}`}
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 pb-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-muted py-12 text-center">{es_AR.noItemsInCategory}</p>
      )}
    </div>
  )
}
