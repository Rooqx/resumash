import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Resume/skeleton')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/Resume/skeleton"!</div>
}
