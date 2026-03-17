import type { Product } from '@/lib/types'
import { SectionHeader } from './SectionHeader'
import { ProductCard } from './ProductCard'

export function ProductGrid({
  title,
  ctaLabel,
  ctaHref,
  products,
}: {
  title: string
  ctaLabel?: string
  ctaHref?: string
  products: Product[]
}) {
  if (products.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <SectionHeader title={title} ctaLabel={ctaLabel} ctaHref={ctaHref} />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
