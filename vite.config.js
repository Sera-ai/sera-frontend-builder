import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; // Import the path module
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    '__BE_ROUTER_PORT__': JSON.stringify(process.env.BE_ROUTER_PORT),
    "global": {}
  },
  plugins: [react()],
  server: {
    port: process.env.FE_BUILDER_PORT,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '../../certs/localhost.key')),
      cert: fs.readFileSync(path.resolve(__dirname, '../../certs/localhost.crt'))
    }
  }
})
