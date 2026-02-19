import { useRouteSocket } from '@/hooks/useRouteSocket'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/manage')({
  component: RouteComponent,
})

function RouteComponent() {
useRouteSocket();
  return <Outlet/>
}
