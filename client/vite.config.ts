import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

import type { UserConfig } from 'vite'
import type { RouteRecord } from 'vite-react-ssg'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    nodePolyfills(),
    tailwindcss(),
  ],
  ssgOptions: {
    includedRoutes(
      _paths: Array<string>,
      _routes: Readonly<Array<RouteRecord>>,
    ) {
      // return array of route paths to pre-render
      return ['/', '/tailor-resume', '/build-resume']
    },
  },
  server: {
    host: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
} as UserConfig)
