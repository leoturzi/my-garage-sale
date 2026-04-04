import { es_AR } from '@/lib/translations'

export function ValueProps() {
  const items = es_AR.valueProps
  return (
    <section className="bg-surface py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.title} className="text-center">
            <div className="text-2xl mb-2">{item.icon}</div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-1">
              {item.title}
            </h3>
            <p className="text-xs text-muted">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
