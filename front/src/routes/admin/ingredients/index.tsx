import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/ingredients/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/ingredients/"!</div>
}
