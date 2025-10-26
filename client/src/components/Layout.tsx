import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { ToasterProvider } from './Toaster'
import Footer from './Footer'

type AppProps = {
  children: React.ReactNode
}

const queryClient = new QueryClient()

export default function App({ children }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="poppins">{children}</main>
      <ToasterProvider />
      <Footer />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
