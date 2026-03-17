import Image from 'next/image'
import Link from 'next/link'
import type { Product, Media } from '@/lib/types'
import { Badge } from './Badge'

function getThumbUrl(images: (Media | number)[] | undefined): string | null {
  if (!images || images.length === 0) return null
  const first = images[0]
  if (typeof first === 'number') return null
  return first.sizes?.thumbnail?.url ?? first.url ?? null
}

const conditionLabels: Record<string, string> = {
  new: 'New',
  like_new: 'Like New',
  good: 'Good',
  fair: 'Fair',
}

function getCategorySlug(category: Product['category']): string | null {
  if (typeof category === 'object' && category.slug) return category.slug
  return null
}

export function ProductCard({ product }: { product: Product }) {
  const thumbUrl = getThumbUrl(product.images)
  const categorySlug = getCategorySlug(product.category)
  const href = categorySlug
    ? `/categories/${categorySlug}/${product.id}`
    : `/categories`

  return (
    <Link href={href} className="group block">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface mb-2">
        {thumbUrl ? (
          <Image
            src={thumbUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted text-xs">
            No image
          </div>
        )}

        {/* Badges */}
        {(product.tags && product.tags.length > 0) || product.status === 'sold' ? (
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {product.status === 'sold' && <Badge label="Sold" variant="sold" />}
            {product.tags?.map((tag) => (
              <Badge key={tag} label={tag.replace('_', ' ')} variant={tag} />
            ))}
          </div>
        ) : null}
      </div>

      {/* Info */}
      <div className="space-y-0.5">
        {product.brand && (
          <p className="text-xs text-muted uppercase tracking-wider">
            {product.brand}
          </p>
        )}
        <h3 className="text-sm font-medium truncate">{product.name}</h3>
        <div className="flex items-center gap-2 text-xs text-muted">
          {product.condition && (
            <span>{conditionLabels[product.condition]}</span>
          )}
          {product.condition && product.size && <span>&middot;</span>}
          {product.size && <span>{product.size}</span>}
        </div>
        <p className="text-sm font-semibold">&euro;{product.price}</p>
      </div>
    </Link>
  )
}
