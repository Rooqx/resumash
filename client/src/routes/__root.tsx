import { Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'
import { TailoringJobProvider } from '@/features/resume-tailor/components/TailoringJobManager'
import { ToasterProvider } from '@/components/Toaster'

// Loading component
function NavigationLoader() {
  const routerState = useRouterState()
  const isNavigating = routerState.isLoading // TanStack Router's navigation state

  // Background polling and stale-data refreshes never block the workspace.
  const showLoader = isNavigating

  if (!showLoader) return null

  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center fixed top-0 z-[60]">
      <span
        className={`inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin align-middle`}
        aria-label="Loading..."
        role="status"
      />
    </div>
  )
}

const isProd = import.meta.env.PROD

export const Route = createRootRoute({
  component: () => (
    <>
      <TailoringJobProvider><Outlet /></TailoringJobProvider>
      <ToasterProvider />
      <NavigationLoader />
      {isProd ? (
        ''
      ) : (
        <TanstackDevtools
          config={{
            position: 'bottom-left',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      )}
    </>
  ),
})
