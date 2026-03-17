import type { Category } from '@/lib/types'
import { SectionHeader } from './SectionHeader'
import { CategoryCard } from './CategoryCard'

export function CategoryGrid({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <SectionHeader title="Shop by Category" ctaLabel="View All" ctaHref="/categories" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </section>
  )
}
