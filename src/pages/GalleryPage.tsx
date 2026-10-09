import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { ChevronLeft, ChevronRight, Images, X, ZoomIn } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import LazyImage from '@/components/LazyImage'
import { folderById, folders, photos, type FolderId, type GalleryPhoto } from '@/data/gallery'
import { imageSrcSet, imageUrl } from '@/lib/images'
import { lockScroll } from '@/lib/scroll'

type Filter = FolderId | 'all'

const countFor = (f: Filter) => (f === 'all' ? photos.length : photos.filter((p) => p.folder === f).length)
const coverFor = (f: FolderId) => photos.find((p) => p.folder === f)!

/* -------------------------------------------------------------------------- */
/* Folder tabs                                                                 */
/* -------------------------------------------------------------------------- */

function FolderTab({ id, active, onSelect }: { id: Filter; active: boolean; onSelect: (f: Filter) => void }) {
  const folder = id === 'all' ? null : folderById[id]
  const Icon = folder?.icon ?? Images

  return (
    <button
      type="button"
      role="tab"
      id={`folder-tab-${id}`}
      aria-selected={active}
      aria-controls="gallery-panel"
      data-testid={`gallery-folder-${id}`}
      onClick={() => onSelect(id)}
      className={`group relative shrink-0 snap-start w-[220px] md:w-auto text-left rounded-3xl p-2 transition-[border-color,box-shadow,background-color] duration-300 border ${
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
        {folder ? (
          <LazyImage src={coverFor(folder.id).src} alt="" ratio={16 / 10} sizes="240px" imgClassName="group-hover:scale-105" />
        ) : (
          // "All" = a 2×2 mosaic of every folder's cover (same overall 16:10 box as the others)
          <div className="grid grid-cols-2 gap-0.5">
            {folders.map((f) => (
              <LazyImage key={f.id} src={coverFor(f.id).src} alt="" ratio={16 / 10} sizes="120px" />
            ))}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060B1A]/80 via-[#060B1A]/10 to-transparent" />
        <span className="absolute top-2.5 right-2.5 rounded-full bg-[#060B1A]/60 px-2.5 py-1 text-[11px] font-semibold text-white tabular-nums">
          {countFor(id)}
        </span>
      </div>
      <div className="flex items-start gap-3 px-2 pt-3 pb-1.5">
        <span
          className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl ring-1 transition-colors ${
            active ? 'bg-gold/15 ring-gold/40 text-gold' : 'bg-sky/10 ring-sky/20 text-sky'
          }`}
        >
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block font-display font-semibold text-ivory leading-tight">{folder?.label ?? 'All Moments'}</span>
          <span className="block text-xs text-ghost mt-1 leading-snug">{folder?.blurb ?? 'Every folder, every moment'}</span>
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
    for (const d of [1, -1]) {
      const n = items[(index + d + items.length) % items.length]
      const img = new Image()
      img.src = imageUrl(n.src, 1600, n.ratio)
    }
  }, [index, items])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${photo.title} — photo ${index + 1} of ${items.length}`}
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
            className={`absolute top-1/2 -translate-y-1/2 z-10 hidden sm:grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20 transition-colors ${
              d < 0 ? 'left-4 md:left-8' : 'right-4 md:right-8'
            }`}
          >
            {d < 0 ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
          </button>
        ))}

      <figure className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <img
          key={photo.src}
          src={imageUrl(photo.src, 1600, photo.ratio)}
          srcSet={imageSrcSet(photo.src, photo.ratio)}
          sizes="(min-width: 1024px) 1024px, 100vw"
          alt={photo.title}
          width={1600}
          height={Math.round(1600 / photo.ratio)}
          decoding="async"
          // auto width/height under both max constraints keeps the ratio, so the box hugs the photo
          className="mx-auto h-auto w-auto max-h-[78vh] max-w-full rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-300"
        />
        <figcaption className="mt-4 flex flex-wrap items-end justify-between gap-3 text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8ECAE6]">{folderById[photo.folder].label}</p>
            <p className="font-display text-xl font-semibold">{photo.title}</p>
            <p className="text-sm text-white/70 mt-1">{photo.caption}</p>
          </div>
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
  // the open folder lives in the URL (?folder=tournaments) so it's shareable and survives reloads
  const [params, setParams] = useSearchParams()
  const raw = params.get('folder')
  const filter: Filter = isFilter(raw) ? raw : 'all'
  const [open, setOpen] = useState<number | null>(null)

  const visible = filter === 'all' ? photos : photos.filter((p) => p.folder === filter)
  const current = filter === 'all' ? null : folderById[filter]

  const select = (f: Filter) => {
    setOpen(null)
    setParams(f === 'all' ? {} : { folder: f }, { replace: true, preventScrollReset: true })
  }

  const close = useCallback(() => setOpen(null), [])
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + visible.length) % visible.length)),
    [visible.length],
  )

  return (
    <>
      <PageHeader
        docTitle="Gallery — ChessVerse Chess Institute"
        crumb="Gallery"
        tag="Inside ChessVerse"
        title={
          <>
            Moments from our <span className="text-gradient italic">boards</span>
          </>
        }
        subtitle="Tournament days, masterclasses, community nights and the students who make them unforgettable — sorted into folders."
      />

      <section className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 pb-24 md:pb-32">
        <div className="relative max-w-7xl mx-auto">
          {/* Folders — swipeable strip on mobile, grid on desktop */}
          <div
            role="tablist"
            aria-label="Gallery folders"
            className="-mx-4 px-4 pt-3 pb-4 flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:mx-0 md:px-0 md:grid md:grid-cols-5 md:overflow-visible"
          >
            {(['all', ...folders.map((f) => f.id)] as Filter[]).map((id) => (
              <FolderTab key={id} id={id} active={filter === id} onSelect={select} />
            ))}
          </div>

          {/* Current folder heading */}
          <div className="mt-12 mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-sky/10 pb-6">
            <div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-ivory leading-tight">
                {current?.label ?? 'All Moments'}
              </h2>
              <p className="text-ghost mt-2">{current?.blurb ?? 'Every folder in one place.'}</p>
            </div>
            <p className="text-sm text-ghost tabular-nums">
              {visible.length} {visible.length === 1 ? 'photo' : 'photos'}
            </p>
          </div>

          {/* Masonry — each tile reserves its aspect ratio, so nothing shifts as photos stream in.
              Keyed by folder: switching re-mounts the grid and replays the cheap CSS entrance. */}
          <div
            key={filter}
            id="gallery-panel"
            role="tabpanel"
            aria-labelledby={`folder-tab-${filter}`}
            className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5"
          >
            {visible.map((photo, i) => (
              <button
                key={photo.src}
                type="button"
                data-testid={`gallery-photo-${i}`}
                onClick={() => setOpen(i)}
                style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
                className="gallery-tile group relative mb-4 sm:mb-5 block w-full break-inside-avoid overflow-hidden rounded-2xl glow-border text-left"
              >
                <LazyImage
                  src={photo.src}
                  alt={photo.title}
                  ratio={photo.ratio}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  priority={i < 3}
                  imgClassName="group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060B1A]/85 via-[#060B1A]/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  {filter === 'all' && (
                    <span className="block text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#8ECAE6] mb-1">
                      {folderById[photo.folder].label}
                    </span>
                  )}
                  <span className="block font-display font-semibold text-lg sm:text-xl text-white">{photo.title}</span>
                  <span className="block text-sm text-white/75 mt-1 line-clamp-2">{photo.caption}</span>
                </div>
                <span className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/15 ring-1 ring-white/30 text-white opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 transition-[opacity,transform] duration-300">
                  <ZoomIn className="h-4 w-4" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {open !== null && visible[open] && <Lightbox items={visible} index={open} onClose={close} onStep={step} />}
    </>
  )
}
