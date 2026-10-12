import { Camera, Crown, GraduationCap, MapPin, Sparkles, TreePine, Trophy, type LucideIcon } from 'lucide-react'

/*
 * Shared by the full gallery (./gallery.ts, loaded with the /gallery page) and the home-page
 * teaser (./gallery-covers.ts, in the main bundle). Kept free of photo data, so the teaser never
 * pulls the whole manifest into the bundle every visitor downloads.
 */

/** One photo as written by scripts/build-gallery.mjs. */
export type GalleryManifestPhoto = {
  /** Original filename inside the folder */
  file: string
  /** Largest web rendition */
  src: string
  srcSet: string
  width: number
  height: number
  /** Tiny blurred data-URI preview */
  placeholder: string
}

/** One folder as written by scripts/build-gallery.mjs (./gallery.generated.ts). */
export type GalleryManifestCategory = {
  /** URL-safe slug of the folder name, used in ?folder= */
  id: string
  /** Readable label derived from the folder name */
  label: string
  /** Folder name inside /public/gallery */
  folder: string
  photos: GalleryManifestPhoto[]
}

/** A folder's first photo and photo count only (./gallery.covers.generated.ts). */
export type GalleryCoverCategory = Omit<GalleryManifestCategory, 'photos'> & {
  count: number
  cover: GalleryManifestPhoto
}

export type GalleryFolder = {
  id: string
  label: string
  blurb: string
  icon: LucideIcon
}

export type GalleryPhoto = {
  /** Unique across the gallery: `${folder}/${file}` */
  id: string
  src: string
  srcSet: string
  placeholder: string
  alt: string
  folder: string
  /** width / height of the photo — reserves space before load (no layout shift), no cropping */
  ratio: number
}

/*
 * Optional presentation per folder slug: display order, icon and a one-line blurb.
 * Folders not listed here still appear (after these, alphabetically) with a generic icon.
 */
const META: Record<string, { icon: LucideIcon; blurb: string }> = {
  'chessverse-open-rapid-chess-tournament': { icon: Trophy, blurb: 'Our open rapid tournament' },
  'chessverse-open-school-rapid-chess-tournament': { icon: Trophy, blurb: 'Rapid tournament for school players' },
  'im-guest-workshop': { icon: Crown, blurb: 'Workshop with a visiting International Master' },
  'school-workshops': { icon: GraduationCap, blurb: 'Chess sessions in schools' },
  'udaipur-workshop': { icon: MapPin, blurb: 'Workshop in Udaipur' },
  diwali: { icon: Sparkles, blurb: 'Diwali celebrations' },
  christmas: { icon: TreePine, blurb: 'Christmas celebrations' },
}
const ORDER = Object.keys(META)
const rank = (id: string) => (ORDER.includes(id) ? ORDER.indexOf(id) : ORDER.length)

export const sortCategories = <T extends { id: string; label: string }>(list: T[]) =>
  [...list].sort((a, b) => rank(a.id) - rank(b.id) || a.label.localeCompare(b.label))

export const folderFor = (c: { id: string; label: string }, count: number): GalleryFolder => ({
  id: c.id,
  label: c.label,
  blurb: META[c.id]?.blurb ?? `${count} ${count === 1 ? 'photo' : 'photos'}`,
  icon: META[c.id]?.icon ?? Camera,
})

export const toPhoto = (c: { id: string; label: string; folder: string }, p: GalleryManifestPhoto, index: number, count: number): GalleryPhoto => ({
  id: `${c.folder}/${p.file}`,
  src: p.src,
  srcSet: p.srcSet,
  placeholder: p.placeholder,
  alt: `${c.label} — photo ${index + 1} of ${count}`,
  folder: c.id,
  ratio: p.width / p.height,
})
