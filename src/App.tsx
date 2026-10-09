import { lazy } from 'react'
import { Routes, Route } from 'react-router'
import { MotionConfig } from 'framer-motion'
import Home from './pages/Home'
import Chatbot from './components/Chatbot'
import SmoothScroll from './components/SmoothScroll'
import SiteLayout from './components/SiteLayout'
import { pageLoaders } from './lib/routes'

const FounderPage = lazy(pageLoaders['/about'])
const GalleryPage = lazy(pageLoaders['/gallery'])

export default function App() {
  return (
    // honour the visitor's "reduce motion" setting for every framer-motion animation
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<FounderPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
      <Chatbot />
    </MotionConfig>
  )
}
