import { useRef } from 'react'
import { Link } from 'react-router'
import { motion, useInView } from 'framer-motion'
import { EASE_OUT } from '@/lib/motion'
import { prefetchRoute } from '@/lib/routes'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import LazyImage from '@/components/LazyImage'
import { galleryCovers } from '@/data/gallery-covers'

// Landing-page teaser: the cover (first photo) of up to six folders in a bento grid
// (2×2 feature + four tiles = two full rows); each tile opens its folder on the full /gallery page.
// Uses the covers-only data so the full photo manifest stays in the /gallery page chunk.
const items = galleryCovers.slice(0, 6)

export default function Gallery() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="gallery" className="relative w-full bg-twilight section-padding overflow-hidden">
      <div className="absolute inset-0 chess-grid-bg opacity-40 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-royal/10 blur-[160px] pointer-events-none" />

      <div ref={ref} className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-14"
        >
          <div className="max-w-2xl">
            <span className="pill-tag mb-5" data-testid="gallery-tag">
              Inside Chessverse
            </span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ivory mb-5 leading-tight">
              Moments From Our <span className="text-gradient italic">Boards</span>
            </h2>
            <p className="text-ghost text-lg">
              Tournaments, school workshops and festival celebrations with our students.
            </p>
          </div>
          <Link
            to="/gallery"
            data-testid="gallery-cta-full"
            onMouseEnter={() => prefetchRoute('/gallery')}
            onFocus={() => prefetchRoute('/gallery')}
            className="btn-ghost group shrink-0 self-start md:self-auto"
          >
            Explore the full gallery
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 auto-rows-[140px] sm:auto-rows-[200px]">
          {items.map(({ folder, cover, count }, i) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06, ease: EASE_OUT }}
              className={i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}
            >
              <Link
                to={`/gallery?folder=${folder.id}`}
                data-testid={`gallery-item-${i}`}
                onMouseEnter={() => prefetchRoute('/gallery')}
                className="group relative block h-full overflow-hidden rounded-2xl glow-border bg-midnight/60"
              >
                <LazyImage
                  fill
                  src={cover.src}
                  srcSet={cover.srcSet}
                  placeholder={cover.placeholder}
                  alt={cover.alt}
                  ratio={cover.ratio}
                  sizes={i === 0 ? '(min-width: 640px) 50vw, 50vw' : '(min-width: 640px) 25vw, 50vw'}
                  imgClassName="group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/30 to-transparent light:from-[#0B1733]/85 light:via-[#0B1733]/25" />

                <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-5 text-left">
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-azure light:text-[#C7D7FE] mb-1 tabular-nums">
                    {count} {count === 1 ? 'photo' : 'photos'}
                  </span>
                  <span
                    title={folder.label}
                    className="font-display font-semibold text-sm sm:text-xl leading-snug text-ivory light:text-white gallery-title line-clamp-2"
                  >
                    {folder.label}
                  </span>
                </div>

                <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-ivory/10 light:bg-white/20 ring-1 ring-ivory/20 light:ring-white/40 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-[opacity,transform] duration-300">
                  <ArrowUpRight className="w-4 h-4 text-ivory light:text-white" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
