const UNSPLASH = 'https://images.unsplash.com/'

export const RESPONSIVE_WIDTHS = [400, 640, 960, 1280, 1600]

export const isResizable = (src: string) => src.startsWith(UNSPLASH)

/**
 * Unsplash (imgix) URL cropped to `ratio`. `auto=format` serves AVIF/WebP to browsers that
 * accept them, falling back to JPEG — compressed, correctly-sized files with no build step.
 * Local files are returned unchanged.
 */
export function imageUrl(src: string, width: number, ratio: number, placeholder = false) {
  if (!isResizable(src)) return src
  const base = src.split('?')[0]
  const h = Math.round(width / ratio)
  const quality = placeholder ? '&q=20&blur=60' : '&q=72'
  return `${base}?auto=format&fit=crop&w=${width}&h=${h}${quality}`
}

export const imageSrcSet = (src: string, ratio: number) =>
  isResizable(src) ? RESPONSIVE_WIDTHS.map((w) => `${imageUrl(src, w, ratio)} ${w}w`).join(', ') : undefined
