import { StrictMode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { ViteReactSSG } from 'vite-react-ssg'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import type { RouteRecord } from 'vite-react-ssg'
import './styles.css'

// Create Query Client
const queryClient = new QueryClient()

const helmetContext = {} // for SSR/SSG rendering

// Create Router
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Type registration (for TS users)
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Your App component
export const App = () => (
  <StrictMode>
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>
)

// This part is VERY important
// vite-ssg needs this function to know how to render your app during the build
const routes: Array<RouteRecord> = [
  {
    path: '/',
    element: <App />,
    entry: 'src/App.tsx',
    // ... more routes or children
  },
]
export const createApp = ViteReactSSG({
  // no App, no paths
  routes,
})
