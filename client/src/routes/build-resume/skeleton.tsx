import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/build-resume/skeleton')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/Resume/skeleton"!</div>
}
