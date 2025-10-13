import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Resume/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="text-4xl text-red-800">Hello "/Resume/"!</div>
}
