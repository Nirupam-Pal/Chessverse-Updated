import fs from "fs"
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// public/gallery holds the original photos (HEIC/RAW/full-size JPEG, ~330 MB). The site only uses
// the WebP copies in public/gallery-web (see scripts/build-gallery.mjs), so keep the originals out
// of dist — this also stops a dist/gallery/ folder from shadowing the /gallery route on static hosts.
function excludeGalleryOriginals(): Plugin {
  let outDir = 'dist'
  return {
    name: 'exclude-gallery-originals',
    apply: 'build',
    configResolved: (config) => {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    closeBundle: () => fs.rmSync(path.join(outDir, 'gallery'), { recursive: true, force: true }),
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Absolute asset URLs: the host rewrites every route (/gallery, /about, …) to index.html, and
  // relative ones would break on nested or trailing-slash URLs (/gallery/ → /gallery/assets/…).
  base: '/',
  plugins: [inspectAttr(), react(), excludeGalleryOriginals()],
  // 3D models imported from src (e.g. the hero knight, inlined via `?inline`)
  assetsInclude: ['**/*.glb'],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
    // Use local websocket HMR by default so changes reload automatically
    // The previous config forced WSS/clientPort 443 which can prevent HMR
    // from connecting on a typical local (http) dev server.
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      clientPort: 3000,
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
