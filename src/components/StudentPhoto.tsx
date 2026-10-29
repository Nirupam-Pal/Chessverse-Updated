import LazyImage from '@/components/LazyImage'

/**
 * A student's photo filling its (positioned) parent — or, when there's no photo, their initials
 * on a brand gradient, so a missing image never shows a broken box or a stand-in face.
 */
export default function StudentPhoto({
  name,
  src,
  sizes = '320px',
  className = '',
  initialsClassName = 'text-4xl',
}: {
  name: string
  src?: string
  sizes?: string
  className?: string
  initialsClassName?: string
}) {
  if (src) return <LazyImage fill src={src} alt={name} ratio={4 / 5} sizes={sizes} className={className} />
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('')
  return (
    <div
      role="img"
      aria-label={name}
      // fixed dark brand tones in both themes: cards set the name in white over the photo area
      className={`absolute inset-0 grid place-items-center bg-gradient-to-br from-[#1F4FAE] via-[#0E2A52] to-[#060B1A] ${className}`}
    >
      <span className={`font-display font-bold tracking-wide text-white/90 ${initialsClassName}`}>{initials}</span>
    </div>
  )
}
