import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/foods/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/foods/"!</div>
}
