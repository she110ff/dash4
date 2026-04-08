import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 7112,
    proxy: {
      '/api': 'http://localhost:7111',
      '/socket.io': {
        target: 'http://localhost:7111',
        ws: true,
      },
    },
  },
})
