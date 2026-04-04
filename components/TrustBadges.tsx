import { es_AR } from '@/lib/translations'

export function TrustBadges() {
  const badges = es_AR.trustBadges
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-8 border-y border-gray-200">
      {badges.map((badge) => (
        <div key={badge.title} className="text-center">
          <div className="text-lg mb-1">{badge.icon}</div>
          <h3 className="text-[11px] font-semibold uppercase tracking-wider">
            {badge.title}
          </h3>
        </div>
      ))}
    </div>
  )
}
