import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { scrollToTarget } from '@/lib/scroll'

// Secondary pages are split into their own chunks so the landing page ships less JS.
// Loaders are shared with App's React.lazy so a hover-prefetch and the real render reuse one request.
export const pageLoaders = {
  '/about': () => import('@/pages/AboutPage'),
  '/gallery': () => import('@/pages/GalleryPage'),
  '/contact': () => import('@/pages/ContactPage'),
} as const

/** Warm a page's chunk ahead of the click (call on hover/focus). No-op for home sections. */
export function prefetchRoute(to: string) {
  if (to in pageLoaders) void pageLoaders[to as keyof typeof pageLoaders]()
}

/**
 * Navigate to a site destination: `#section` (a landing-page section, reachable from any page),
 * `/` (top of home) or a page path like `/gallery`.
 */
export function useSiteNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return useCallback(
    (to: string) => {
      const onHome = pathname === '/'
      if (to.startsWith('#')) {
        if (onHome) scrollToTarget(to)
        else navigate(`/${to}`)
      } else if (to === pathname) {
        scrollToTarget(0)
      } else {
        navigate(to)
      }
    },
    [navigate, pathname],
  )
}
