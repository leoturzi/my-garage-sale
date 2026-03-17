import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import type { Category } from '@/lib/types'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CategoryCard } from '@/components/CategoryCard'

export const metadata: Metadata = {
  title: 'Categories | My Garage Sale',
  description: 'Browse all categories — quality second-hand items at great prices.',
}

export default async function CategoriesPage() {
  const payload = await getPayloadClient()

  const categoriesRaw = await payload.find({
    collection: 'categories',
    sort: 'sort_order',
    limit: 50,
  })
  const categories = categoriesRaw.docs as unknown as Category[]

  return (
    <div className="max-w-7xl mx-auto px-4">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Categories' },
        ]}
      />

      <div className="pb-4">
        <h1 className="text-2xl font-bold uppercase tracking-wide">All Categories</h1>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pb-12">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      ) : (
        <p className="text-muted py-12 text-center">No categories yet.</p>
      )}
    </div>
  )
}
