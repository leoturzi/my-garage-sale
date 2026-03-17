import Image from 'next/image'
import Link from 'next/link'
import type { HeroData, Media } from '@/lib/types'

function getImageUrl(image: Media | number | undefined): string | null {
  if (!image || typeof image === 'number') return null
  return image.url ?? null
}

export function HeroSection({ hero }: { hero: HeroData }) {
  const bgUrl = getImageUrl(hero.background_image)

  return (
    <section className="relative min-h-[400px] lg:min-h-[600px] flex items-center justify-center text-white">
      {bgUrl ? (
        <Image
          src={bgUrl}
          alt={hero.title ?? 'Hero'}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-900" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-2xl">
        {hero.title && (
          <h1 className="text-3xl lg:text-5xl font-bold uppercase tracking-wider mb-4">
            {hero.title}
          </h1>
        )}
        {hero.subtitle && (
          <p className="text-base lg:text-lg text-gray-200 mb-6">
            {hero.subtitle}
          </p>
        )}
        {hero.cta_label && hero.cta_link && (
          <Link
            href={hero.cta_link}
            className="inline-block bg-white text-black text-sm font-semibold uppercase tracking-wider px-8 py-3 hover:bg-gray-100 transition-colors"
          >
            {hero.cta_label}
          </Link>
        )}
      </div>
    </section>
  )
}
