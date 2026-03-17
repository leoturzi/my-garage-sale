import Image from 'next/image'
import Link from 'next/link'
import type { Category, Media } from '@/lib/types'
import { SectionHeader } from './SectionHeader'

function getCoverUrl(image: Media | number | undefined): string | null {
  if (!image || typeof image === 'number') return null
  return image.sizes?.card?.url ?? image.url ?? null
}

export function SpotlightSection({
  categories,
}: {
  categories: Category[]
}) {
  if (categories.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <SectionHeader title="Spotlight" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {categories.map((cat) => {
          const coverUrl = getCoverUrl(cat.cover_image)
          return (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="relative block aspect-[3/4] lg:aspect-[2/3] overflow-hidden group"
            >
              {coverUrl ? (
                <Image
                  src={coverUrl}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-300" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-lg lg:text-xl font-bold uppercase tracking-wider mb-1">
                  {cat.name}
                </h3>
                <span className="text-xs uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors">
                  Shop Now
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
