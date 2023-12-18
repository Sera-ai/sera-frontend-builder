import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env
  },
  define: {
    "global": {}
  },
  plugins: [react()],
  server: {
    port: process.env.FE_BUILDER_PORT
  }
})
