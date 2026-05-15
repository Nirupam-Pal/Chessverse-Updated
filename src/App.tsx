import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Chatbot from './components/Chatbot'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Chatbot />
    </>
  )
}
