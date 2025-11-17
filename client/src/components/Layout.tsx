import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { ToasterProvider } from './Toaster'
import Footer from './Footer'
import Header from './Header'

type AppProps = {
  children: React.ReactNode
}

const queryClient = new QueryClient()

export default function App({ children }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-black m-0">
        <Header />
        <main className="poppins">{children}</main>
        <ToasterProvider />
        <Footer />
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
