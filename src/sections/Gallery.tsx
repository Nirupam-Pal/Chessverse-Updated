import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ZoomIn } from 'lucide-react'

type GalleryItem = {
  src: string
  title: string
  tag: string
  span?: string
}

const items: GalleryItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=900&q=80',
    title: 'Tournament Day',
    tag: 'Events',
    span: 'sm:col-span-2 sm:row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?auto=format&fit=crop&w=700&q=80',
    title: 'Strategy Class',
    tag: 'Coaching',
  },
  {
    src: 'https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?auto=format&fit=crop&w=700&q=80',
    title: 'Young Champions',
    tag: 'Students',
  },
  {
    src: 'https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?auto=format&fit=crop&w=700&q=80',
    title: 'Opening Theory',
    tag: 'Classroom',
  },
  {
    src: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?auto=format&fit=crop&w=700&q=80',
    title: 'Endgame Drill',
    tag: 'Practice',
  },
  {
    src: 'https://images.unsplash.com/photo-1543092587-d8b8feaf362b?auto=format&fit=crop&w=900&q=80',
    title: 'Inter-School Meet',
    tag: 'Tournament',
    span: 'sm:col-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1568797629192-789acf8e4df3?auto=format&fit=crop&w=700&q=80',
    title: 'Online Class',
    tag: 'Digital',
  },
]

export default function Gallery() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [active, setActive] = useState<GalleryItem | null>(null)

  return (
    <section id="gallery" className="relative w-full bg-twilight section-padding overflow-hidden">
      <div className="absolute inset-0 chess-grid-bg opacity-40 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-royal/10 blur-[160px] pointer-events-none" />

      <div ref={ref} className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-16"
        >
          <span className="pill-tag mb-5" data-testid="gallery-tag">
            <ZoomIn className="w-3.5 h-3.5" />
            Inside ChessVerse
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-ivory mb-5 leading-tight">
            Moments From Our <span className="text-gradient italic">Boards</span>
          </h2>
          <p className="text-ghost text-lg max-w-2xl mx-auto">
            A peek into our classrooms, tournaments and the students that bring them alive.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 auto-rows-[140px] sm:auto-rows-[200px]">
          {items.map((item, i) => (
            <motion.button
              key={item.title}
              data-testid={`gallery-item-${i}`}
              onClick={() => setActive(item)}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`group relative overflow-hidden rounded-2xl glow-border bg-midnight/60 ${
                item.span ?? ''
              }`}
            >
              <img
                src={item.src}
                alt={item.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* dark gradient + hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-royal/0 via-royal/0 to-royal/0 group-hover:from-royal/40 group-hover:to-sky/20 transition-all duration-500" />

              <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-5 text-left">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-sky mb-1">
                  {item.tag}
                </span>
                <span className="font-display font-semibold text-base sm:text-xl text-ivory">
                  {item.title}
                </span>
              </div>

              {/* hover zoom icon */}
              <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-ivory/10 backdrop-blur-md ring-1 ring-ivory/20 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                <ZoomIn className="w-4 h-4 text-ivory" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {active && (
        <div
          data-testid="gallery-lightbox"
          onClick={() => setActive(null)}
          className="fixed inset-0 z-[70] bg-void/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="relative max-w-4xl w-full">
            <img
              src={active.src}
              alt={active.title}
              className="w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-sky">{active.tag}</p>
                <p className="font-display font-semibold text-ivory text-xl">{active.title}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActive(null)
                }}
                className="px-4 py-2 rounded-full bg-ivory/10 text-ivory text-sm font-medium hover:bg-ivory/20 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
