'use client'

import Image from 'next/image'
import { useState, useRef, useCallback, useEffect } from 'react'

interface CarouselImage {
  url: string
  alt: string
  thumbnail: string
}

export function ProductImages({ images }: { images: CarouselImage[] }) {
  const [current, setCurrent] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isScrolling = useRef(false)

  const count = images.length

  const goTo = useCallback(
    (index: number) => {
      const wrapped = ((index % count) + count) % count
      setCurrent(wrapped)
      if (scrollRef.current) {
        isScrolling.current = true
        scrollRef.current.scrollTo({ left: wrapped * scrollRef.current.offsetWidth, behavior: 'smooth' })
        setTimeout(() => {
          isScrolling.current = false
        }, 400)
      }
    },
    [count],
  )

  const prev = useCallback(() => goTo(current - 1), [current, goTo])
  const next = useCallback(() => goTo(current + 1), [current, goTo])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    function onScroll() {
      if (isScrolling.current || !el) return
      const index = Math.round(el.scrollLeft / el.offsetWidth)
      setCurrent(index)
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  if (count === 0) {
    return (
      <div className="aspect-[3/4] bg-surface flex items-center justify-center text-muted text-sm">
        No images
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image area */}
      <div className="relative">
        {/* Desktop: single image */}
        <div className="hidden lg:block relative aspect-[3/4] overflow-hidden bg-surface">
          <Image
            src={images[current].url}
            alt={images[current].alt}
            fill
            priority={current === 0}
            sizes="50vw"
            className="object-cover"
          />
          {count > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
                aria-label="Previous image"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
                aria-label="Next image"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Mobile: swipeable carousel */}
        <div
          ref={scrollRef}
          className="lg:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {images.map((img, i) => (
            <div key={i} className="min-w-full snap-start">
              <div className="relative aspect-[3/4] bg-surface">
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile dots */}
        {count > 1 && (
          <div className="lg:hidden flex justify-center gap-1.5 mt-3">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === current ? 'bg-foreground' : 'bg-gray-300'
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails (desktop only) */}
      {count > 1 && (
        <div className="hidden lg:flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative w-20 h-20 flex-shrink-0 overflow-hidden bg-surface border-2 transition-colors ${
                i === current ? 'border-foreground' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={img.thumbnail}
                alt={img.alt}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
