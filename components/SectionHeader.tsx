import Link from 'next/link'

export function SectionHeader({
  title,
  ctaLabel,
  ctaHref,
}: {
  title: string
  ctaLabel?: string
  ctaHref?: string
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl lg:text-2xl font-bold uppercase tracking-wider">
        {title}
      </h2>
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="text-sm uppercase tracking-wide text-muted hover:text-foreground transition-colors"
        >
          {ctaLabel} &rarr;
        </Link>
      )}
    </div>
  )
}
