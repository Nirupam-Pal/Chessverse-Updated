import { useSyncExternalStore } from 'react'

// A real hover-capable pointer (mouse / trackpad), not touch. Cursor-driven 3D effects only
// run where this is true; touch screens get the static layout.
const FINE_POINTER = '(hover: hover) and (pointer: fine)'

const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(FINE_POINTER)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

export const useFinePointer = () => useSyncExternalStore(subscribe, () => window.matchMedia(FINE_POINTER).matches, () => false)
