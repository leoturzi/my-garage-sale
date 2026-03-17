interface ReviewCardProps {
  name: string
  rating: number
  date: string
  text: string
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 text-xs">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < count ? 'text-foreground' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </div>
  )
}

export function ReviewCard({ name, rating, date, text }: ReviewCardProps) {
  return (
    <div className="bg-surface p-5 flex flex-col gap-2">
      <Stars count={rating} />
      <p className="text-sm leading-relaxed">{text}</p>
      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="text-sm font-semibold">{name}</span>
        <span className="text-xs text-muted">{date}</span>
      </div>
    </div>
  )
}
