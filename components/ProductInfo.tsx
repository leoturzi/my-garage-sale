import type { Product } from '@/lib/types'
import { Badge } from './Badge'

const conditionLabels: Record<string, string> = {
  new: 'New',
  like_new: 'Like New',
  good: 'Good',
  fair: 'Fair',
}

export function ProductInfo({ product }: { product: Product }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Brand */}
      {product.brand && (
        <p className="text-xs text-muted uppercase tracking-wider">{product.brand}</p>
      )}

      {/* Name */}
      <h1 className="text-xl lg:text-2xl font-bold uppercase tracking-wider">
        {product.name}
      </h1>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {product.status === 'sold' && <Badge label="Sold" variant="sold" />}
        {product.condition && (
          <Badge label={conditionLabels[product.condition] ?? product.condition} variant="condition" />
        )}
        {product.tags?.map((tag) => (
          <Badge key={tag} label={tag.replace('_', ' ')} variant={tag} />
        ))}
      </div>

      {/* Price */}
      <p className="text-2xl font-bold">&euro;{product.price}</p>

      {/* Size (if present) */}
      {product.size && (
        <p className="text-sm text-muted">
          Size: <span className="text-foreground font-medium">{product.size}</span>
        </p>
      )}

      {/* CTA Buttons */}
      <div className="flex flex-col gap-3 mt-2">
        <button
          className="w-full bg-accent text-white text-sm font-semibold uppercase tracking-wider px-8 py-3.5 hover:bg-gray-800 transition-colors"
          disabled={product.status === 'sold'}
        >
          {product.status === 'sold' ? 'Sold Out' : 'Add to Cart'}
        </button>
        <button
          className="w-full border-2 border-accent text-accent text-sm font-semibold uppercase tracking-wider px-8 py-3.5 hover:bg-accent hover:text-white transition-colors"
          disabled={product.status === 'sold'}
        >
          Purchase Now
        </button>
      </div>

      {/* Secure checkout note */}
      <p className="text-xs text-muted text-center">
        🔒 100% Secured Checkout
      </p>
    </div>
  )
}
