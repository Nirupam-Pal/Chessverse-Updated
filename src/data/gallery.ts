import { manifest } from './gallery.generated'
import { folderFor, sortCategories, toPhoto, type GalleryFolder, type GalleryPhoto } from './gallery-meta'

export type { GalleryFolder, GalleryPhoto } from './gallery-meta'

/*
 * Gallery data comes from the folders in /public/gallery — each folder is a category.
 * To add photos: drop them into a folder (or create a new one), then run `npm run gallery`
 * (it also runs before every `npm run build`). That writes web-sized WebP copies to
 * /public/gallery-web and regenerates ./gallery.generated.ts and ./gallery.covers.generated.ts.
 * Originals are never modified. Per-folder order, icons and blurbs live in ./gallery-meta.ts.
 *
 * This module carries every photo, so import it only from the /gallery page (its own chunk);
 * the home-page teaser uses ./gallery-covers.ts instead.
 */

const sorted = sortCategories(manifest.filter((c) => c.photos.length > 0))

export const folders: GalleryFolder[] = sorted.map((c) => folderFor(c, c.photos.length))

export const photos: GalleryPhoto[] = sorted.flatMap((c) => c.photos.map((p, i) => toPhoto(c, p, i, c.photos.length)))

export const folderById: Record<string, GalleryFolder> = Object.fromEntries(folders.map((f) => [f.id, f]))

export const photosIn = (folder: string) => photos.filter((p) => p.folder === folder)
