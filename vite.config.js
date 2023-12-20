import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    '__BE_ROUTER_PORT__': JSON.stringify(process.env.BE_ROUTER_PORT),
    "global": {}
  },
  plugins: [react()],
  server: {
    port: process.env.FE_BUILDER_PORT
  }
})
