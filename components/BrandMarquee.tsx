export function BrandMarquee({ brands }: { brands: string[] }) {
  if (brands.length === 0) return null

  const doubled = [...brands, ...brands]

  return (
    <section className="py-8 border-y border-gray-200 overflow-hidden">
      <div className="animate-marquee inline-flex gap-12 whitespace-nowrap">
        {doubled.map((brand, i) => (
          <span
            key={i}
            className="text-xl lg:text-2xl font-bold uppercase tracking-wider text-gray-300"
          >
            {brand}
          </span>
        ))}
      </div>
    </section>
  )
}
