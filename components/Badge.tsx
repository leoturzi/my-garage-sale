const variantStyles: Record<string, string> = {
  sale: 'bg-sale text-white',
  sold: 'bg-sold text-white',
  new: 'bg-new text-white',
  condition: 'bg-gray-200 text-gray-700',
  last_chance: 'bg-sale text-white',
  new_arrival: 'bg-new text-white',
  offer: 'bg-sale text-white',
}

export function Badge({
  label,
  variant,
}: {
  label: string
  variant: string
}) {
  return (
    <span
      className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm ${variantStyles[variant] ?? variantStyles.condition}`}
    >
      {label}
    </span>
  )
}
