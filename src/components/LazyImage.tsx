import { useState } from 'react'
import { imageSrcSet, imageUrl, isResizable } from '@/lib/images'

type Props = {
  src: string
  alt: string
  /** width / height. Reserves the box before the file arrives (zero layout shift) and sets the crop. */
  ratio: number
  /** Fill a positioned parent instead of sizing by `ratio`. */
  fill?: boolean
  /** Rendered width hint for responsive `srcset` selection, e.g. "(min-width: 1024px) 33vw, 100vw". */
  sizes?: string
  /** Above-the-fold images: fetch eagerly with high priority. */
  priority?: boolean
  className?: string
  imgClassName?: string
}

/**
 * Lazy, responsive image with a blurred low-res preview that cross-fades to the full photo.
 * The fade is a CSS opacity transition (compositor-only), never a JS animation.
 */
export default function LazyImage({
  src,
  alt,
  ratio,
  fill = false,
  sizes = '100vw',
  priority = false,
  className = '',
  imgClassName = '',
}: Props) {
  // React attaches onLoad before the element gets its src, so even cached images report in
  const [loaded, setLoaded] = useState(false)
  const remote = isResizable(src)

  return (
    <div
      className={`${fill ? 'absolute inset-0' : 'relative'} overflow-hidden bg-midnight/60 ${className}`}
      style={fill ? undefined : { aspectRatio: ratio }}
    >
      {remote && !loaded && (
        // ~1 KB blurred preview, upscaled; hidden from assistive tech
        <img
          src={imageUrl(src, 32, ratio, true)}
          alt=""
          aria-hidden
          decoding="async"
          className="absolute inset-0 h-full w-full scale-110 object-cover"
        />
      )}
      <img
        src={imageUrl(src, 960, ratio)}
        srcSet={imageSrcSet(src, ratio)}
        sizes={remote ? sizes : undefined}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        // opacity + transform only, so callers' hover zooms (group-hover:scale-*) also animate
        className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
    </div>
  )
}
