const badges = [
  { icon: '✓', title: 'Fully Authentic', description: 'Every item verified genuine' },
  { icon: '★', title: 'Quality Checked', description: 'Inspected before listing' },
  { icon: '↩', title: 'Easy Returns', description: 'Hassle-free return policy' },
  { icon: '🔒', title: 'No Hidden Fees', description: 'What you see is what you pay' },
]

export function TrustBadges() {
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
