import { covers } from './gallery.covers.generated'
import { folderFor, sortCategories, toPhoto } from './gallery-meta'

/** Each folder's cover (first photo) and photo count, in gallery order — for the home-page teaser. */
export const galleryCovers = sortCategories(covers.filter((c) => c.count > 0)).map((c) => ({
  folder: folderFor(c, c.count),
  cover: toPhoto(c, c.cover, 0, c.count),
  count: c.count,
}))
