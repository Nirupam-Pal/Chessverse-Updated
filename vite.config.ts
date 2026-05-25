import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react()],
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
