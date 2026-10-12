import { Camera, Crown, GraduationCap, MapPin, Sparkles, TreePine, Trophy, type LucideIcon } from 'lucide-react'
import { manifest } from './gallery.generated'

/*
 * Gallery data comes from the folders in /public/gallery — each folder is a category.
 * To add photos: drop them into a folder (or create a new one), then run `npm run gallery`
 * (it also runs before every `npm run build`). That writes web-sized WebP copies to
 * /public/gallery-web and regenerates ./gallery.generated.ts. Originals are never modified.
 */

/** Shape written by scripts/build-gallery.mjs. */
export type GalleryManifestCategory = {
  /** URL-safe slug of the folder name, used in ?folder= */
  id: string
  /** Readable label derived from the folder name */
  label: string
  /** Folder name inside /public/gallery */
  folder: string
  photos: {
    /** Original filename inside the folder */
    file: string
    /** Largest web rendition */
    src: string
    srcSet: string
    width: number
    height: number
    /** Tiny blurred data-URI preview */
    placeholder: string
  }[]
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

const sorted = manifest
  .filter((c) => c.photos.length > 0)
  .sort((a, b) => rank(a.id) - rank(b.id) || a.label.localeCompare(b.label))

export const folders: GalleryFolder[] = sorted.map((c) => ({
  id: c.id,
  label: c.label,
  blurb: META[c.id]?.blurb ?? `${c.photos.length} ${c.photos.length === 1 ? 'photo' : 'photos'}`,
  icon: META[c.id]?.icon ?? Camera,
}))

export const photos: GalleryPhoto[] = sorted.flatMap((c) =>
  c.photos.map((p, i) => ({
    id: `${c.folder}/${p.file}`,
    src: p.src,
    srcSet: p.srcSet,
    placeholder: p.placeholder,
    alt: `${c.label} — photo ${i + 1} of ${c.photos.length}`,
    folder: c.id,
    ratio: p.width / p.height,
  })),
)

export const folderById: Record<string, GalleryFolder> = Object.fromEntries(folders.map((f) => [f.id, f]))

export const photosIn = (folder: string) => photos.filter((p) => p.folder === folder)
