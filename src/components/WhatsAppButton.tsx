import { useEffect, useState } from 'react'

const WHATSAPP_NUMBER = '917629037237'
const WHATSAPP_MESSAGE = 'Hello, I want to know more about your chess classes.'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

export default function WhatsAppButton() {
  const [mounted, setMounted] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 1200)
    return () => clearTimeout(t)
  }, [])

  return (
    <a
      data-testid="whatsapp-float-btn"
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className={`fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-[60] flex items-center gap-3 transition-all duration-500 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      aria-label="Chat with ChessVerse on WhatsApp"
    >
      {/* Tooltip bubble */}
      <span
        className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-2xl rounded-br-sm bg-ivory text-twilight text-sm font-medium shadow-xl transition-all duration-300 ${
          showTooltip ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3 pointer-events-none'
        }`}
      >
        Chat with us
        <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-ivory rotate-45" />
      </span>

      {/* Button */}
      <span className="relative inline-flex">
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40" />
        <span className="absolute inset-0 rounded-full animate-pulse-glow" />
        <span
          className="relative inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full text-ivory shadow-2xl transition-transform duration-300 hover:scale-110 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            boxShadow: '0 10px 30px rgba(37, 211, 102, 0.5), inset 0 1px 0 rgba(255,255,255,0.25)',
          }}
        >
          {/* WhatsApp icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="w-7 h-7 sm:w-8 sm:h-8"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M19.11 17.21c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.06 2.89 1.21 3.09.15.2 2.08 3.18 5.05 4.46.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35zM16.05 28.07h-.01a12.04 12.04 0 0 1-6.13-1.68l-.44-.26-4.56 1.2 1.22-4.45-.29-.46a12.04 12.04 0 1 1 10.2 5.65zM16.06 4.04C9.46 4.04 4.1 9.4 4.1 16c0 2.31.66 4.46 1.8 6.3L4.5 28.04l5.86-1.54a11.94 11.94 0 0 0 5.71 1.45h.01c6.6 0 11.96-5.37 11.96-11.96S22.65 4.04 16.06 4.04z" />
          </svg>
        </span>
      </span>
    </a>
  )
}
