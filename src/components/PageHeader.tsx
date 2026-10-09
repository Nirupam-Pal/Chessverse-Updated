import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'
import Reveal from '@/components/Reveal'

/** Title block for secondary pages: breadcrumb, tag, headline — same type scale as the home sections. */
export default function PageHeader({
  crumb,
  tag,
  title,
  subtitle,
  docTitle,
  children,
}: {
  crumb: string
  tag: string
  title: ReactNode
  subtitle: string
  /** browser-tab title */
  docTitle: string
  children?: ReactNode
}) {
  useEffect(() => {
    const prev = document.title
    document.title = docTitle
    return () => {
      document.title = prev
    }
  }, [docTitle])

  return (
    <header className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8 xl:px-12 pt-36 md:pt-44 pb-14 md:pb-20">
      <div className="absolute inset-0 chess-board-bg opacity-30 pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[420px] w-[760px] max-w-full rounded-full bg-royal/20 blur-[140px] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sky/25 to-transparent" />

      <Reveal className="relative max-w-7xl mx-auto">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-sm text-ghost">
            <li>
              <Link to="/" className="hover:text-ivory transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="w-3.5 h-3.5" />
            </li>
            <li aria-current="page" className="text-ivory">
              {crumb}
            </li>
          </ol>
        </nav>
        <span className="pill-tag mb-5">{tag}</span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-7xl text-ivory leading-[1.05] max-w-4xl mb-6">
          {title}
        </h1>
        <p className="text-ghost text-lg md:text-xl leading-relaxed max-w-2xl">{subtitle}</p>
        {children}
      </Reveal>
    </header>
  )
}
