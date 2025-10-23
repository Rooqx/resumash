import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

type AppProps = {
  children: React.ReactNode
}
const queryClient = new QueryClient()
export default function App({ children }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <main>{children}</main>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
