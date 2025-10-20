import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tailor-resume/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/Resume/tailor-resume/"!</div>
}
