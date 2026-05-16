import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr'],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        // default chunking
      },
    },
  },
})
