import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { ChevronLeft, ChevronRight, Images, X, ZoomIn } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import LazyImage from '@/components/LazyImage'
import { folderById, folders, photos, photosIn, type GalleryPhoto } from '@/data/gallery'
import { lockScroll } from '@/lib/scroll'

/** 'all' or a folder id (slug of the folder name in /public/gallery) */
type Filter = string

const countFor = (f: Filter) => (f === 'all' ? photos.length : photosIn(f).length)
const coverFor = (f: string) => photosIn(f)[0]

/* -------------------------------------------------------------------------- */
/* Folder tabs                                                                 */
/* -------------------------------------------------------------------------- */

function FolderTab({ id, active, onSelect }: { id: Filter; active: boolean; onSelect: (f: Filter) => void }) {
  const folder = id === 'all' ? null : folderById[id]
  const Icon = folder?.icon ?? Images
  const cover = folder && coverFor(folder.id)

  return (
    <button
      type="button"
      role="tab"
      id={`folder-tab-${id}`}
      aria-selected={active}
      aria-controls="gallery-panel"
      data-testid={`gallery-folder-${id}`}
      onClick={() => onSelect(id)}
      className={`group relative shrink-0 snap-start w-[200px] md:w-auto text-left rounded-3xl p-2 transition-[border-color,box-shadow,background-color] duration-300 border ${
        active
          ? 'border-gold/50 bg-gold/5 shadow-glow-gold light:shadow-[0_16px_36px_-18px_rgba(124,94,14,0.45)]'
          : 'border-sky/10 bg-twilight/60 hover:border-sky/35'
      }`}
    >
      {/* folder tab lip */}
      <span
        aria-hidden
        className={`absolute -top-2 left-6 h-3 w-16 rounded-t-lg transition-colors duration-300 ${active ? 'bg-gold/50' : 'bg-sky/15 group-hover:bg-sky/30'}`}
      />
      <div className="relative overflow-hidden rounded-2xl">
        {cover ? (
          <LazyImage
            src={cover.src}
            srcSet={cover.srcSet}
            placeholder={cover.placeholder}
            alt=""
            ratio={16 / 10}
            sizes="240px"
            imgClassName="group-hover:scale-105"
          />
        ) : (
          // "All" = a 2×2 mosaic of the first four folders' covers (same overall 16:10 box as the others)
          <div className="grid grid-cols-2 gap-0.5">
            {folders.slice(0, 4).map((f) => {
              const c = coverFor(f.id)
              return <LazyImage key={f.id} src={c.src} srcSet={c.srcSet} placeholder={c.placeholder} alt="" ratio={16 / 10} sizes="120px" />
            })}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060B1A]/80 via-[#060B1A]/10 to-transparent" />
        <span className="absolute top-2.5 right-2.5 rounded-full bg-[#060B1A]/60 px-2.5 py-1 text-[11px] font-semibold text-white tabular-nums">
          {countFor(id)}
        </span>
      </div>
      <div className="flex items-start gap-2.5 px-1.5 pt-3 pb-1.5">
        <span
          className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ring-1 transition-colors ${
            active ? 'bg-gold/15 ring-gold/40 text-gold' : 'bg-sky/10 ring-sky/20 text-sky'
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className="min-w-0">
          <span title={folder?.label} className="font-display font-semibold text-sm text-ivory leading-tight line-clamp-2">
            {folder?.label ?? 'All Photos'}
          </span>
          <span className="block text-xs text-ghost mt-1 leading-snug">{folder?.blurb ?? 'Every folder in one place'}</span>
        </span>
      </div>
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* Lightbox                                                                    */
/* -------------------------------------------------------------------------- */

function Lightbox({
  items,
  index,
  onClose,
  onStep,
}: {
  items: GalleryPhoto[]
  index: number
  onClose: () => void
  onStep: (delta: number) => void
}) {
  const photo = items[index]
  const closeRef = useRef<HTMLButtonElement>(null)
  const touchX = useRef<number | null>(null)

  useEffect(() => {
    lockScroll(true)
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    return () => {
      lockScroll(false)
      opener?.focus?.({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onStep(1)
      else if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onStep])

  // warm the neighbours so stepping through feels instant
  useEffect(() => {
    if (items.length < 2) return
    for (const d of [1, -1]) {
      const img = new Image()
      img.src = items[(index + d + items.length) % items.length].src
    }
  }, [index, items])

  const folder = folderById[photo.folder]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${folder.label} — photo ${index + 1} of ${items.length}`}
      data-testid="gallery-lightbox"
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 50) onStep(dx < 0 ? 1 : -1)
        touchX.current = null
      }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#060B1A]/90 p-4 sm:p-8 animate-in fade-in duration-200"
    >
      <button
        ref={closeRef}
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20 transition-colors"
      >
        <X className="h-5 w-5" />
      </button>

      {items.length > 1 &&
        ([-1, 1] as const).map((d) => (
          <button
            key={d}
            type="button"
            aria-label={d < 0 ? 'Previous photo' : 'Next photo'}
            onClick={(e) => {
              e.stopPropagation()
              onStep(d)
            }}
            className={`absolute top-1/2 -translate-y-1/2 z-10 grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-[#060B1A]/50 sm:bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20 transition-colors ${
              d < 0 ? 'left-2 sm:left-4 md:left-8' : 'right-2 sm:right-4 md:right-8'
            }`}
          >
            {d < 0 ? <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" /> : <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>
        ))}

      <figure className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <img
          key={photo.id}
          src={photo.src}
          srcSet={photo.srcSet}
          sizes="(min-width: 1024px) 1024px, 100vw"
          alt={photo.alt}
          width={1600}
          height={Math.round(1600 / photo.ratio)}
          decoding="async"
          // auto width/height under both max constraints keeps the ratio, so the box hugs the photo
          className="mx-auto h-auto w-auto max-h-[78vh] max-w-full rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300"
        />
        <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8ECAE6]">{folder.label}</p>
          <p className="text-sm text-white/60 tabular-nums">
            {index + 1} / {items.length}
          </p>
        </figcaption>
      </figure>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

const isFilter = (v: string | null): v is Filter => v === 'all' || folders.some((f) => f.id === v)

export default function GalleryPage() {
  // the open folder lives in the URL (?folder=diwali) so it's shareable and survives reloads
  const [params, setParams] = useSearchParams()
  const raw = params.get('folder')
  const filter: Filter = isFilter(raw) ? raw : 'all'
  const [open, setOpen] = useState<number | null>(null)

  const visible = filter === 'all' ? photos : photosIn(filter)
  const current = filter === 'all' ? null : folderById[filter]

  const select = (f: Filter) => {
    setOpen(null)
    setParams(f === 'all' ? {} : { folder: f }, { replace: true, preventScrollReset: true })
  }

  // stable callbacks, so the lightbox's key listener isn't re-bound on every render
  const close = useCallback(() => setOpen(null), [setOpen])
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + visible.length) % visible.length)),
    [visible.length, setOpen],
  )

  return (
    <>
      <PageHeader
        docTitle="Gallery — Chessverse Chess Institute"
        crumb="Gallery"
        tag="Inside Chessverse"
        title={
          <>
            Moments from our <span className="text-gradient italic">boards</span>
          </>
        }
        subtitle="Tournaments, school workshops and festival celebrations — sorted into folders."
      />

      <section className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 pb-24 md:pb-32">
        <div className="relative max-w-7xl mx-auto">
          {photos.length === 0 ? (
            <p className="py-24 text-center text-ghost">New photos are on their way — check back soon.</p>
          ) : (
            <>
              {/* Folders — swipeable strip on mobile, grid from tablet up */}
              <div
                role="tablist"
                aria-label="Gallery folders"
                className="-mx-4 px-4 pt-3 pb-4 flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:mx-0 md:px-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible"
              >
                {['all', ...folders.map((f) => f.id)].map((id) => (
                  <FolderTab key={id} id={id} active={filter === id} onSelect={select} />
                ))}
              </div>

              {/* Current folder heading */}
              <div className="mt-10 mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-sky/10 pb-6">
                <div>
                  <h2 className="font-display font-bold text-3xl sm:text-4xl text-ivory leading-tight">
                    {current?.label ?? 'All Photos'}
                  </h2>
                  <p className="text-ghost mt-2">{current?.blurb ?? 'Every folder in one place.'}</p>
                </div>
                <p className="text-sm text-ghost tabular-nums">
                  {visible.length} {visible.length === 1 ? 'photo' : 'photos'}
                </p>
              </div>

              {/* Masonry — each tile reserves the photo's own aspect ratio (no crop, no layout shift).
                  Keyed by folder: switching re-mounts the grid and replays the cheap CSS entrance. */}
              <div
                key={filter}
                id="gallery-panel"
                role="tabpanel"
                aria-labelledby={`folder-tab-${filter}`}
                className="columns-2 md:columns-3 xl:columns-4 gap-3 sm:gap-4"
              >
                {visible.map((photo, i) => (
                  <button
                    key={photo.id}
                    type="button"
                    aria-label={`Open ${photo.alt}`}
                    data-testid={`gallery-photo-${i}`}
                    onClick={() => setOpen(i)}
                    style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
                    className="gallery-tile group relative mb-3 sm:mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl glow-border text-left"
                  >
                    <LazyImage
                      src={photo.src}
                      srcSet={photo.srcSet}
                      placeholder={photo.placeholder}
                      alt={photo.alt}
                      ratio={photo.ratio}
                      sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                      priority={i < 4}
                      imgClassName="group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#060B1A]/0 group-hover:bg-[#060B1A]/15 transition-colors duration-300" />
                    {filter === 'all' && (
                      <span className="absolute left-2.5 bottom-2.5 rounded-full bg-[#060B1A]/65 px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8ECAE6] backdrop-blur-sm">
                        {folderById[photo.folder].label}
                      </span>
                    )}
                    <span className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-[#060B1A]/40 ring-1 ring-white/30 text-white opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 transition-[opacity,transform] duration-300">
                      <ZoomIn className="h-4 w-4" />
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {open !== null && visible[open] && <Lightbox items={visible} index={open} onClose={close} onStep={step} />}
    </>
  )
}
