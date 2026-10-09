import { Suspense } from 'react'
import { Outlet } from 'react-router'
import Navigation from '@/sections/Navigation'
import Footer from '@/sections/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

/** Shared chrome for every page: the navbar persists across routes instead of remounting. */
export default function SiteLayout() {
  return (
    <main className="relative min-h-screen bg-background transition-colors duration-500">
      <Navigation />
      {/* full-height placeholder keeps the footer from jumping up while a page chunk loads */}
      <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
        <Outlet />
      </Suspense>
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
