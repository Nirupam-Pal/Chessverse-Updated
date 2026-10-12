/**
 * Gallery pipeline: public/gallery/<Category>/<photo> → web-ready WebP + a typed manifest.
 *
 *   npm run gallery          (also runs automatically before `npm run build`)
 *
 * - Every sub-folder of public/gallery is a category; its name becomes the label
 *   ("school-workshops" → "School Workshops"). Empty folders are skipped.
 * - Originals are never touched. Resized copies go to public/gallery-web/<category>/,
 *   because browsers can't show HEIC/ARW and the camera JPEGs are 3–20 MB each.
 * - Incremental: a photo is only re-encoded when its source is newer than its outputs.
 *   Outputs whose source was removed are deleted, so the manifest never points at stale files.
 * - Byte-identical duplicates inside one category are listed once.
 */
import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import decodeHeic from 'heic-decode'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC_DIR = path.join(ROOT, 'public', 'gallery')
const OUT_DIR = path.join(ROOT, 'public', 'gallery-web')
const MANIFEST = path.join(ROOT, 'src', 'data', 'gallery.generated.ts')

/** Output widths (px). Grid tiles pick from the smaller ones, the lightbox uses the largest. */
const WIDTHS = [480, 960, 1600]
const QUALITY = 78
const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.tif', '.tiff', '.heic', '.heif', '.arw'])

const slugify = (s) =>
  s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const labelFor = (folder) =>
  folder
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\p{L}/gu, (c) => c.toUpperCase())

const naturalSort = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })

const exists = (p) => fs.stat(p).then((s) => s, () => null)

/* ---------------------------------- decoders ---------------------------------- */

/** Sony ARW is TIFF-based; browsers and libvips can't read it, but it embeds a full-colour JPEG preview. */
function arwPreview(buf) {
  const le = buf.readUInt16LE(0) === 0x4949
  const u16 = (o) => (le ? buf.readUInt16LE(o) : buf.readUInt16BE(o))
  const u32 = (o) => (le ? buf.readUInt32LE(o) : buf.readUInt32BE(o))
  const seen = new Set()
  let best = null
  let orientation = 1
  const walk = (off, depth) => {
    if (!off || off + 2 > buf.length || seen.has(off) || depth > 8) return
    seen.add(off)
    const n = u16(off)
    let jo = 0
    let jl = 0
    const subs = []
    for (let i = 0; i < n; i++) {
      const e = off + 2 + i * 12
      if (e + 12 > buf.length) break
      const tag = u16(e)
      const count = u32(e + 4)
      const value = u32(e + 8)
      if (tag === 0x0201) jo = value
      else if (tag === 0x0202) jl = value
      else if (tag === 0x0112 && depth === 0) orientation = u16(e + 8)
      else if (tag === 0x014a) for (let k = 0; k < count; k++) subs.push(count === 1 ? value : u32(value + 4 * k))
    }
    if (jo && jl && jo + jl <= buf.length && (!best || jl > best.length)) best = { offset: jo, length: jl }
    subs.forEach((s) => walk(s, depth + 1))
    walk(u32(off + 2 + n * 12), depth)
  }
  walk(u32(4), 0)
  if (!best) throw new Error('no embedded JPEG preview found')
  return { jpeg: buf.subarray(best.offset, best.offset + best.length), orientation }
}

const ROTATION = { 3: 180, 6: 90, 8: 270 }

/** Returns an auto-oriented sharp pipeline for any supported file. */
async function load(file) {
  const ext = path.extname(file).toLowerCase()
  const buf = await fs.readFile(file)
  if (ext === '.heic' || ext === '.heif') {
    // libheif applies the file's rotation/mirror transforms, so pixels are already upright
    const { width, height, data } = await decodeHeic({ buffer: buf })
    const rgba = Buffer.from(data.buffer, data.byteOffset, data.byteLength)
    // HEIC photos are opaque; dropping the decoder's alpha keeps the WebPs smaller
    return { buf, image: sharp(rgba, { raw: { width, height, channels: 4 } }).removeAlpha() }
  }
  if (ext === '.arw') {
    const { jpeg, orientation } = arwPreview(buf)
    return { buf, image: sharp(jpeg).rotate(ROTATION[orientation] ?? 0) }
  }
  return { buf, image: sharp(buf, { animated: false }).rotate() } // .rotate() = honour EXIF orientation
}

/* ------------------------------------ main ------------------------------------ */

/** Existing renditions of one photo (`<outBase>-<width>.webp`), smallest first. */
async function existingOutputs(outBase) {
  const dir = path.dirname(outBase)
  const prefix = path.basename(outBase) + '-'
  const names = await fs.readdir(dir).catch(() => [])
  return names
    .filter((n) => n.startsWith(prefix) && /^\d+\.webp$/.test(n.slice(prefix.length)))
    .map((n) => ({ file: path.join(dir, n), w: Number(n.slice(prefix.length, -5)) }))
    .sort((a, b) => a.w - b.w)
}

async function processPhoto(file, outBase) {
  const srcStat = await fs.stat(file)
  let renditions = await existingOutputs(outBase)
  const outStats = await Promise.all(renditions.map((r) => fs.stat(r.file)))
  // a rendition named wider than it really is means an older run upscale-duplicated it; rebuild the set
  const fresh =
    renditions.length > 0 &&
    outStats.every((s) => s.mtimeMs >= srcStat.mtimeMs) &&
    (await sharp(renditions[renditions.length - 1].file).metadata()).width === renditions[renditions.length - 1].w

  let hash
  if (!fresh) {
    const { buf, image } = await load(file)
    hash = createHash('sha1').update(buf).digest('hex')
    // decode once, then resize the upright pixels to each width
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true })
    const base = () => sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    // only widths smaller than the source, plus one capped at the source size — never upscaled duplicates
    const widths = [...WIDTHS.filter((w) => w < info.width), Math.min(info.width, WIDTHS[WIDTHS.length - 1])]
    renditions = [...new Set(widths)].map((w) => ({ file: `${outBase}-${w}.webp`, w }))
    for (const r of renditions) {
      await base().resize({ width: r.w }).webp({ quality: QUALITY, effort: 5 }).toFile(r.file)
    }
  } else {
    hash = createHash('sha1').update(await fs.readFile(file)).digest('hex')
  }

  const outputs = renditions.map((r) => r.file)
  const largest = await sharp(outputs[outputs.length - 1]).metadata()
  // ~150-byte blurred preview shown while the real tile streams in
  const placeholder = await sharp(outputs[0]).resize({ width: 16 }).blur(1.2).webp({ quality: 40 }).toBuffer()

  const srcSet = renditions.map((r) => ({ url: '/' + path.relative(path.join(ROOT, 'public'), r.file).split(path.sep).join('/'), w: r.w }))

  return {
    hash,
    entry: {
      file: path.basename(file),
      src: srcSet[srcSet.length - 1].url,
      srcSet: srcSet.map((s) => `${s.url} ${s.w}w`).join(', '),
      width: largest.width,
      height: largest.height,
      placeholder: `data:image/webp;base64,${placeholder.toString('base64')}`,
    },
    outputs,
    reencoded: !fresh,
  }
}

async function main() {
  const started = Date.now()
  if (!(await exists(SRC_DIR))) throw new Error(`Missing ${path.relative(ROOT, SRC_DIR)}`)

  const dirs = (await fs.readdir(SRC_DIR, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name).sort(naturalSort)
  const categories = []
  const keep = new Set()
  const usedSlugs = new Set()
  let reencoded = 0
  const skipped = []

  for (const dir of dirs) {
    let id = slugify(dir) || 'category'
    while (usedSlugs.has(id)) id += '-2'
    usedSlugs.add(id)

    const files = (await fs.readdir(path.join(SRC_DIR, dir), { withFileTypes: true }))
      .filter((f) => f.isFile())
      .map((f) => f.name)
      .sort(naturalSort)

    await fs.mkdir(path.join(OUT_DIR, id), { recursive: true })
    const photos = []
    const hashes = new Set()
    const fileSlugs = new Set()

    for (const name of files) {
      const rel = `${dir}/${name}`
      if (!SUPPORTED.has(path.extname(name).toLowerCase())) {
        if (!name.startsWith('.')) skipped.push(`${rel} (unsupported type)`)
        continue
      }
      let slug = slugify(name)
      while (fileSlugs.has(slug)) slug += '-2'
      fileSlugs.add(slug)
      try {
        const res = await processPhoto(path.join(SRC_DIR, dir, name), path.join(OUT_DIR, id, slug))
        res.outputs.forEach((o) => keep.add(o))
        if (res.reencoded) reencoded++
        if (hashes.has(res.hash)) {
          skipped.push(`${rel} (duplicate of another photo in this folder)`)
          continue
        }
        hashes.add(res.hash)
        photos.push(res.entry)
        process.stdout.write(res.reencoded ? '+' : '.')
      } catch (err) {
        skipped.push(`${rel} (${err.message})`)
      }
    }

    if (photos.length) categories.push({ id, label: labelFor(dir), folder: dir, photos })
    else skipped.push(`${dir}/ (no usable images — category hidden)`)
  }

  // remove derivatives whose source no longer exists
  let removed = 0
  for (const entry of await fs.readdir(OUT_DIR, { recursive: true, withFileTypes: true })) {
    const full = path.join(entry.parentPath ?? entry.path, entry.name)
    if (entry.isFile() && !keep.has(full)) {
      await fs.rm(full)
      removed++
    }
  }
  for (const d of await fs.readdir(OUT_DIR, { withFileTypes: true })) {
    if (d.isDirectory() && !usedSlugs.has(d.name)) await fs.rm(path.join(OUT_DIR, d.name), { recursive: true })
  }

  const banner = `// AUTO-GENERATED by scripts/build-gallery.mjs from public/gallery/ — do not edit by hand.\n// Run \`npm run gallery\` after adding, removing or renaming photos.\n`
  const body = `import type { GalleryManifestCategory } from './gallery'\n\nexport const manifest: GalleryManifestCategory[] = ${JSON.stringify(categories, null, 2)}\n`
  await fs.writeFile(MANIFEST, banner + '\n' + body)

  const total = categories.reduce((n, c) => n + c.photos.length, 0)
  console.log(`\n\nGallery: ${total} photos in ${categories.length} categories (${reencoded} encoded, ${removed} stale files removed) in ${((Date.now() - started) / 1000).toFixed(1)}s`)
  for (const c of categories) console.log(`  ${c.label.padEnd(22)} ${String(c.photos.length).padStart(3)}  ← public/gallery/${c.folder}/`)
  if (skipped.length) {
    console.warn('\nSkipped:')
    skipped.forEach((s) => console.warn('  - ' + s))
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
