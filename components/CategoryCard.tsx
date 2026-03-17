import Image from 'next/image'
import Link from 'next/link'
import type { Category, Media } from '@/lib/types'

function getCoverUrl(image: Media | number | undefined): string | null {
  if (!image || typeof image === 'number') return null
  return image.sizes?.card?.url ?? image.url ?? null
}

export function CategoryCard({ category }: { category: Category }) {
  const coverUrl = getCoverUrl(category.cover_image)

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="relative block aspect-[3/4] overflow-hidden group"
    >
      {coverUrl ? (
        <Image
          src={coverUrl}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-300" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Text */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="text-sm lg:text-base font-bold uppercase tracking-wider mb-1">
          {category.name}
        </h3>
        <span className="text-xs uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors">
          Shop Now
        </span>
      </div>
    </Link>
  )
}
