import { Routes, Route } from 'react-router'
import { MotionConfig } from 'framer-motion'
import Home from './pages/Home'
import Chatbot from './components/Chatbot'
import SmoothScroll from './components/SmoothScroll'

export default function App() {
  return (
    // honour the visitor's "reduce motion" setting for every framer-motion animation
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Chatbot />
    </MotionConfig>
  )
}
